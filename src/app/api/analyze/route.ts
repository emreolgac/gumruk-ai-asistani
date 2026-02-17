import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { getConfig } from '@/lib/config';
import { logSystem } from '@/lib/logger';
import { trackHit } from '@/lib/analytics';
import { getExchangeRate } from '@/lib/currency';
import { rateLimit } from '@/lib/rate-limit';
import * as XLSX from 'xlsx';

// Gemini pricing (per 1M tokens) - approximate for gemini-1.5-flash
const PRICING = {
    input: 0.075 / 1000000,
    output: 0.30 / 1000000,
};

const MODEL_NAME = "gemini-flash-latest";

export async function POST(request: NextRequest) {
    try {
        await trackHit('api/analyze');

        // --- NEW: Rate Limit (Item 8) ---
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        const limiter = rateLimit(ip, 10, 60 * 1000); // 10 requests per minute per IP
        if (!limiter.success) {
            return NextResponse.json({ error: 'Çok fazla istek. Lütfen bir dakika sonra deneyin.' }, { status: 429 });
        }
        // -------------------------------

        const session = await auth();

        // 1. Credit & Auth Check
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Bu işlem için giriş yapmalısınız.' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, credits: true, role: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
        }

        // Admin might have unlimited or bypass? Let's say everyone needs 1 credit for now.
        if (user.credits <= 0 && user.role !== 'ADMIN') {
            return NextResponse.json({
                error: 'Yetersiz kredi.',
                hint: 'Lütfen kredi satın alın veya admin ile iletişime geçin.'
            }, { status: 402 });
        }

        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'Dosya yüklenmedi.' }, { status: 400 });
        }

        // 2. File Size & Type Validation
        const totalSize = files.reduce((acc, f) => acc + f.size, 0);
        if (totalSize > 20 * 1024 * 1024) {
            return NextResponse.json({ error: 'Yüklenen toplam dosya boyutu çok büyük (Max 20MB).' }, { status: 400 });
        }

        const apiKey = await getConfig('GEMINI_API_KEY');
        if (!apiKey) {
            await logSystem('ERROR', 'API', 'Gemini API Key missing');
            return NextResponse.json({ error: 'API anahtarı bulunamadı (GEMINI_API_KEY).' }, { status: 500 });
        }

        // 3. Prepare files (Item 7: Multi-sheet Excel support)
        const fileParts = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                if (
                    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    file.type === 'application/vnd.ms-excel'
                ) {
                    try {
                        const workbook = XLSX.read(buffer, { type: 'buffer' });
                        let fullContent = `\n--- EXCEL DOSYA İÇERİĞİ (${file.name}) ---\n`;

                        // Loop through all sheets instead of just the first one
                        workbook.SheetNames.forEach(name => {
                            const sheet = workbook.Sheets[name];
                            const csv = XLSX.utils.sheet_to_csv(sheet);
                            fullContent += `[SAYFA: ${name}]\n${csv}\n`;
                        });

                        fullContent += `--- EXCEL SONU ---\n`;
                        return { text: fullContent };
                    } catch (e) {
                        console.error('Excel parsing error:', e);
                        return { inlineData: { data: buffer.toString('base64'), mimeType: file.type } };
                    }
                }

                return {
                    inlineData: {
                        data: buffer.toString('base64'),
                        mimeType: file.type,
                    },
                };
            })
        );

        const userInstructions = formData.get('userInstructions') as string || '';
        const regime = formData.get('regime') as string || 'ithalat';
        const hasCLP = files.some(f => f.name.toUpperCase().includes('CLP'));

        let regimeInstructions = '';
        if (regime === 'ihracat') {
            regimeInstructions = `- İHRACAT (EXPORT) İŞLEMİ. Tip: EX, Rejim: 1000.`;
        } else if (regime === 'transit') {
            regimeInstructions = `- TRANSİT (TRANSFER) İŞLEMİ. Tip: TR, Rejim: 0100.`;
        } else {
            regimeInstructions = `- İTHALAT (IMPORT) İŞLEMİ. Tip: IM, Rejim: 4000.`;
        }

        const prompt = `
          DİKKAT: Sen T.C. Ticaret Bakanlığı'na bağlı kıdemli bir "Gümrük Muayene Memuru" ve veri analistisin.
          Görevin: Ekte sunulan ticari belgeleri 4458 sayılı Gümrük Kanunu'na göre analiz et.
          ${hasCLP ? '🚨 ÖNCELİK: CLP (Çeki Listesi) verilerini baz al.' : ''}
          ${regimeInstructions}
          ${userInstructions ? `🚨 KULLANICI TALİMATI: "${userInstructions}"` : ''}

          HATA PAYI SIFIR OLMALI. TAREKS ürünlerinde her model ayrı kalem olmalı.
          
          ÇIKTI FORMATI (SAF JSON):
          {
            "gonderici_firma": { "adi": "", "adresi": "", "ulkesi": "" },
            "alici_firma": { "adi": "", "adresi": "", "vergi_no": "" },
            "belge_bilgileri": { "fatura_no": "", "fatura_tarihi": "", "teslim_sekli": "", "beyanname_tipi": "", "rejim_kodu": "", "cik_ulke": "" },
            "esya_listesi": [
              {
                "tanimi": "", "model_kodu": "", "gtip": "", "mensei": "", 
                "kap_adedi": 0, "brut_agirlik": 0.1, "net_agirlik": 0.1, 
                "adet": 1, "birim_fiyat": 0.1, "toplam_fiyat": 0.1, "doviz_cinsi": "USD"
              }
            ],
            "toplamlar": { "toplam_brut": 0, "toplam_net": 0, "toplam_fatura": 0, "toplam_kap": 0 },
            "ozet": "Memur raporu...",
            "kaynak_bilgileri": { ...her alan için dosya/sayfa/satır belirt... }
          }
        `;

        // 4. Gemini API Call
        const genAI = new GoogleGenerativeAI(apiKey);
        let activeModel = MODEL_NAME;
        const model = genAI.getGenerativeModel({ model: activeModel });

        // Simple call, without complex discovery for brevity but robust enough
        const result = await model.generateContent([prompt, ...fileParts]);
        const responseText = result.response.text();

        // Track Usage (Item 4)
        const usage = result.response.usageMetadata;
        if (usage) {
            const cost = (usage.promptTokenCount! * PRICING.input) + (usage.candidatesTokenCount! * PRICING.output);
            await prisma.apiUsage.create({
                data: {
                    userId: user.id,
                    model: activeModel,
                    inputTokens: usage.promptTokenCount || 0,
                    outputTokens: usage.candidatesTokenCount || 0,
                    totalTokens: usage.totalTokenCount || 0,
                    cost,
                    endpoint: 'analyze',
                },
            });
        }

        // 5. Post-Process (Credits, Taxes, Audit)
        let cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        let parsedResult = JSON.parse(cleanJson);

        // Fetch Live Exchange Rate (Item 2 & 10)
        const exchangeRate = await getExchangeRate('USD');

        if (parsedResult.esya_listesi) {
            await Promise.all(parsedResult.esya_listesi.map(async (item: any) => {
                const cleanGtip = item.gtip?.replace(/[^0-9]/g, '');
                if (cleanGtip) {
                    const tariff = await prisma.tariffCode.findFirst({
                        where: { code: { startsWith: cleanGtip.substring(0, 6) } }
                    });

                    if (tariff) {
                        const { calculateTaxes } = await import('@/lib/tax-engine');
                        item.vergiler = calculateTaxes(item.toplam_fiyat || 0, exchangeRate, tariff);
                    }
                }
            }));
        }

        // Auditor (RAG could be integrated here in the future)
        try {
            const { auditDeclaration } = await import('@/lib/agents/auditor');
            parsedResult.denetmen_raporu = await auditDeclaration(parsedResult, regimeInstructions);
        } catch (e) { console.error("Auditor error", e); }

        // 6. DB Deduction & History (Item 4)
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { credits: { decrement: 1 } }
            }),
            prisma.creditTransaction.create({
                data: {
                    userId: user.id,
                    amount: -1,
                    type: 'USAGE',
                    description: `${files.length} dosya analizi: ${files.map(f => f.name).join(', ')}`
                }
            }),
            prisma.declaration.create({
                data: {
                    userId: user.id,
                    fileName: files.map(f => f.name).join(', '),
                    status: 'COMPLETED',
                    result: JSON.stringify(parsedResult),
                }
            })
        ]);

        return NextResponse.json({ result: parsedResult, exchangeRateUsed: exchangeRate });

    } catch (error: any) {
        console.error('Analyze API Error:', error);
        return NextResponse.json({ error: error.message || 'Analiz sırasında bir hata oluştu.' }, { status: 500 });
    }
}
