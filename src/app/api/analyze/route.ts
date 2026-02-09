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

const MODEL_NAME = "gemini-1.5-flash-latest";

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
      Sen uzman bir gümrük müşaviri yardımcısısın. 
      Ekteki belgeleri dikkatlice analiz et (Fatura, Ordino, Çeki Listesi vb.).
      
      Aşağıdaki bilgileri JSON formatında çıkar:
      1. **gonderici_firma**: Adı, adresi ve ülkesi.
      2. **alici_firma**: Adı, adresi ve vergi numarası (varsa).
      3. **belge_bilgileri**: Fatura numarası, fatura tarihi, teslim şekli (Incoterms).
      4. **esya_listesi**: Her bir kalem için: Tanımı, GTİP (tahmini), brüt ağırlık, net ağırlık, adet, birim fiyat, toplam fiyat, döviz cinsi.
      5. **toplamlar**: Toplam brüt ağırlık, toplam net ağırlık, toplam fatura tutarı.
      6. **ozet**: Belgelerin ne olduğuna dair kısa bir Türkçe özet.

      Eğer belgede bilgi yoksa "Belirtilmemiş" yaz veya null bırak.
      Sadece saf JSON çıktısı ver, markdown ('''json) kullanma.
    `;

        // 3. Call Gemini API with Fallback Logic
        const genAI = new GoogleGenerativeAI(apiKey);
        let result;
        let activeModel = MODEL_NAME;

        try {
            console.log(`Analyzing with: ${activeModel}`);
            const model = genAI.getGenerativeModel({ model: activeModel });
            result = await model.generateContent([prompt, ...fileParts]);
        } catch (initialError: any) {
            console.error(`Gemini Error (${activeModel}):`, initialError.message);

            if (initialError.message?.includes('404')) {
                // Fallback 1: specific version
                activeModel = "gemini-1.5-flash";
                console.log(`Fallback 1: Trying ${activeModel}`);
                const model = genAI.getGenerativeModel({ model: activeModel });
                result = await model.generateContent([prompt, ...fileParts]);
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

