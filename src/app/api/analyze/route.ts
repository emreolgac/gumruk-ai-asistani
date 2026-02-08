import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// Gemini pricing (per 1M tokens) - approximate for gemini-1.5-flash
const PRICING = {
    input: 0.075 / 1000000,  // $0.075 per 1M input tokens
    output: 0.30 / 1000000,  // $0.30 per 1M output tokens
};

export async function POST(request: NextRequest) {
    try {
        // 1. Authentication Check (Disabled for development/demo ease, but recommended for production)
        const session = await auth();
        // if (!session) {
        //   return NextResponse.json({ error: 'Bu işlemi yapmak için giriş yapmalısınız.' }, { status: 401 });
        // }

        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'Dosya yüklenmedi.' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
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

        // 3. Call Gemini API
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        const result = await model.generateContent([prompt, ...fileParts]);
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
                    model: 'gemini-1.5-flash',
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
        console.error('Analyze API Error:', error);
        return NextResponse.json({ error: error.message || 'Bir hata oluştu.' }, { status: 500 });
    }
}

