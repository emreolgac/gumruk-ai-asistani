import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { getConfig } from '@/lib/config';
import { logSystem } from '@/lib/logger';
import { trackHit } from '@/lib/analytics';

// Gemini pricing (per 1M tokens) - approximate for gemini-1.5-flash
const PRICING = {
    input: 0.075 / 1000000,
    output: 0.30 / 1000000,
};

const MODEL_NAME = "gemini-flash-latest";

export async function POST(request: NextRequest) {
    try {
        // Track hit for analytics
        await trackHit('api/analyze');

        const session = await auth();

        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'Dosya yüklenmedi.' }, { status: 400 });
        }

        const apiKey = await getConfig('GEMINI_API_KEY');
        if (!apiKey) {
            await logSystem('ERROR', 'API', 'Gemini API Key missing');
            return NextResponse.json({ error: 'API anahtarı bulunamadı (GEMINI_API_KEY).' }, { status: 500 });
        }


        // 2. Prepare files for Gemini
        const fileParts = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                return {
                    inlineData: {
                        data: buffer.toString('base64'),
                        mimeType: file.type,
                    },
                };
            })
        );

        const prompt = `
          DİKKAT: Sen T.C. Ticaret Bakanlığı'na bağlı kıdemli bir "Gümrük Muayene Memuru"sun.
          Görevin: Ekte sunulan ticari belgeleri (Fatura, Çeki Listesi, Konşimento vb.) en ince ayrıntısına kadar incelemek ve 4458 sayılı Gümrük Kanunu ile 2024-2025 Türk Gümrük Tarife Cetveli'ne göre kesin doğrulukta sınıflandırmak.

          HEDEFLERİN VE KURALLARIN:
          1. **HATA PAYI SIFIR OLMALI:** Yanlış GTİP tespiti cezai işlem gerektirir. Bu yüzden her eşyanın tanımını, içeriğini ve kullanım alanını analiz et.
          2. **GTİP HASSASİYETİ:** Mümkün olan her durumda 12 haneli tam GTİP kodu ver. Sadece %100 emin değilsen yanına "(Tahmini)" yaz, ancak en uygun kodu TESPİT ETMEK ZORUNDASIN.
          3. **VERİ ÇIKARIMI:** Gönderici, Alıcı, Fatura No, Tarih, Teslim Şekli ve Döviz Cinsi gibi kritik verileri eksiksiz çek.
          
          ÇIKTI FORMATI (SAF JSON):
          - **gonderici_firma**: { adi, adresi (tam), ulkesi }
          - **alici_firma**: { adi, adresi (tam), vergi_no (varsa) }
          - **belge_bilgileri**: { fatura_no, fatura_tarihi (dd/mm/yyyy), teslim_sekli }
          - **esya_listesi**: [ 
              { 
                "tanimi": "Eşyanın ticari ve teknik Türkçe tanımı", 
                "gtip": "1234.56.78.90.00", 
                "brut_agirlik": 0.0, 
                "net_agirlik": 0.0, 
                "adet": 0, 
                "birim_fiyat": 0.0, 
                "toplam_fiyat": 0.0, 
                "doviz_cinsi": "USD" 
              } 
            ]
          - **toplamlar**: { toplam_brut_agirlik, toplam_net_agirlik, toplam_fatura_tutari }
          - **ozet**: "İncelenen belgeler kapsamında... tespit edilmiştir." şeklinde memur üslubuyla kısa özet.

          Eğer bir bilgi belgede AÇIKÇA yoksa, tahminde bulunma ve "Belirtilmemiş" yaz veya sayısal değerse 0 ver.
          Çıktı sadece ve sadece saf JSON olmalı. Markdown bloğu kullanma.
        `;

        // 3. Call Gemini API with Discovery & Fallback
        const genAI = new GoogleGenerativeAI(apiKey);
        let result;
        let activeModel = MODEL_NAME;

        async function tryAnalyze(modelId: string) {
            console.log(`Analyzing with: ${modelId}`);
            const model = genAI.getGenerativeModel({ model: modelId });
            return await model.generateContent([prompt, ...fileParts]);
        }

        try {
            result = await tryAnalyze(activeModel);
        } catch (initialError: any) {
            console.error(`Gemini Error (${activeModel}):`, initialError.message);

            if (initialError.message?.includes('404')) {
                // Try to discover valid models
                try {
                    console.log("Attempting model discovery...");
                    // Note: listModels is a property of the GenAI object in modern SDKs
                    // We'll try to guess a few common ones first for speed
                    const candidateModels = [
                        "gemini-2.5-flash",
                        "gemini-flash-latest",
                        "gemini-2.0-flash-lite",
                        "gemini-2.0-flash-001"
                    ];

                    for (const candidate of candidateModels) {
                        try {
                            console.log(`Trying candidate fallback: ${candidate}`);
                            activeModel = candidate;
                            result = await tryAnalyze(candidate);
                            if (result) break;
                        } catch (e) {
                            console.error(`Candidate ${candidate} failed:`, (e as any).message);
                        }
                    }
                } catch (discoveryError) {
                    console.error("Discovery failed:", discoveryError);
                }

                if (!result) throw initialError;
            } else {
                throw initialError;
            }
        }

        const responseText = result.response.text();

        // 4. Track API Usage
        const usageMetadata = result.response.usageMetadata;
        if (usageMetadata) {
            const inputTokens = usageMetadata.promptTokenCount || 0;
            const outputTokens = usageMetadata.candidatesTokenCount || 0;
            const totalTokens = usageMetadata.totalTokenCount || inputTokens + outputTokens;

            // Calculate estimated cost
            const cost = (inputTokens * PRICING.input) + (outputTokens * PRICING.output);

            // Get user ID if authenticated
            let userId: string | null = null;
            if (session?.user?.email) {
                const user = await prisma.user.findUnique({
                    where: { email: session.user.email },
                    select: { id: true },
                });
                userId = user?.id || null;
            }

            // Log API usage
            await prisma.apiUsage.create({
                data: {
                    userId,
                    model: activeModel,
                    inputTokens,
                    outputTokens,
                    totalTokens,
                    cost,
                    endpoint: 'analyze',
                },
            });

            console.log(`API Usage: ${inputTokens} in, ${outputTokens} out, $${cost.toFixed(6)}`);
        }

        console.log("Raw Gemini Response:", responseText); // Debugging

        // Clean up markdown code blocks if present
        let cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        let parsedResult;
        try {
            parsedResult = JSON.parse(cleanJson);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            // Fallback: Return raw text if JSON parsing fails
            return NextResponse.json({
                result: {
                    ozet: responseText,
                    raw: true,
                    warning: "AI çıktısı tam JSON formatında değildi, ham metin gösteriliyor."
                }
            });
        }

        return NextResponse.json({ result: parsedResult });

    } catch (error: any) {
        console.error('Analyze API Error final check:', error.message);

        // Detailed error for 404 to help the user identify available models
        if (error.message?.includes('404') || error.message?.includes('not found')) {
            return NextResponse.json({
                error: 'Yapay zeka modeli bulunamadı (404).',
                details: `Girdiğiniz API anahtarı seçilen modelleri desteklemiyor olabilir. Hata: ${error.message}`,
                hint: 'Lütfen Google AI Studio (aistudio.google.com) üzerinden "Gemini 1.5 Flash" modelinin aktif olduğundan ve anahtarın doğru kopyalandığından emin olun.'
            }, { status: 404 });
        }

        return NextResponse.json({ error: error.message || 'Bir hata oluştu.' }, { status: 500 });
    }
}

