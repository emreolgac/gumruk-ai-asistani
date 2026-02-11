import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { getConfig } from '@/lib/config';
import { logSystem } from '@/lib/logger';
import { trackHit } from '@/lib/analytics';
import * as XLSX from 'xlsx';

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


        // 2. Prepare files for Gemini (Handle Excel parsing)
        const fileParts = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                // Check for Excel MIME types
                if (
                    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    file.type === 'application/vnd.ms-excel'
                ) {
                    try {
                        const workbook = XLSX.read(buffer, { type: 'buffer' });
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        const csvContent = XLSX.utils.sheet_to_csv(sheet);

                        // Return as text part
                        return { text: `\n--- EXCEL DOSYA İÇERİĞİ (${file.name}) ---\n${csvContent}\n--- EXCEL SONU ---\n` };
                    } catch (e) {
                        console.error('Excel parsing error:', e);
                        // Fallback: send as is (might fail if Gemini doesn't support it directly)
                        return {
                            inlineData: {
                                data: buffer.toString('base64'),
                                mimeType: file.type,
                            },
                        };
                    }
                }

                // Default for PDF/Images
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
        const fileNames = files.map(f => f.name).join(', ');

        const hasCLP = files.some(f => f.name.toUpperCase().includes('CLP'));

        let regimeInstructions = '';
        if (regime === 'ihracat') {
            regimeInstructions = `
            - BU BİR İHRACAT (EXPORT) İŞLEMİDİR. 
            - Beyanname tipi: EX
            - KDV istisnası, A.TR, EUR.1 gibi ihracat belgelerini kontrol et.
            - Rejim kodu genellikle 1000'dir.
            `;
        } else if (regime === 'transit') {
            regimeInstructions = `
            - BU BİR TRANSİT (TRANSFER) İŞLEMİDİR.
            - Beyanname tipi: TR
            - Varış gümrüğü ve transit sürelerini kontrol et.
            - Rejim kodu genellikle 0100 veya T1/T2 senaryosuna göredir.
            `;
        } else {
            regimeInstructions = `
            - BU BİR İTHALAT (IMPORT) İŞLEMİDİR.
            - Beyanname tipi: IM
            - Gümrük vergileri, KDV ve ÖTV matrahlarını kontrol et.
            - Rejim kodu genellikle 4000'dir.
            `;
        }

        const prompt = `
          DİKKAT: Sen T.C. Ticaret Bakanlığı'na bağlı kıdemli bir "Gümrük Muayene Memuru" ve veri analistisin.
          Görevin: Ekte sunulan ticari belgeleri (Fatura, Çeki Listesi, Konşimento vb.) en ince ayrıntısına kadar incelemek ve 4458 sayılı Gümrük Kanunu ile 2024-2025 Türk Gümrük Tarife Cetveli'ne göre kesin doğrulukta sınıflandırmak.

          ${hasCLP ? `🚨 ÖNEMLİ: Dosyalar arasında "CLP" (Çeki Listesi / Packing List) dosyası tespit edildi. 
          Kap adedi, net/brüt kilolar, model kodları ve ürün detayları için ÖNCELİKLE "CLP" dosyasındaki verileri baz al.` : ''}

          ${regimeInstructions}

          ${userInstructions ? `
          ----------------------------------------------------------------------------------
          🚨 KULLANICI (MÜŞTERİ) TALİMATLARI VE EK BİLGİLER:
          "${userInstructions}"
          
          BU TALİMATLARI KESİNLİKLE DİKKATE AL.
          ----------------------------------------------------------------------------------
          ` : ''}

          🚨 KRİTİK KURAL: TAREKS, TARIM VE EMNİYET İZNİ GEREKTİREN EŞYALAR İÇİN SATIR BİRLEŞTİRME YASAKTIR!

          TAREKS/TARIM/EMNİYET İZNİ GEREKTİREN ÜRÜNLER:
          - Kişisel koruyucu donanım (2026/11)
          - Oyuncak (2026/10)
          - Yapı malzemeleri (2026/14)
          - Tıbbi Malzemeler (2026/16)
          - Telsiz ve Telekomünikasyon Terminal Ekipmanı (2026/8)
          - Pil ve akümülatör (2026/15)
          - Sanayi ürünleri ve Araç yedek parçaları (2026/1, 2026/9, 2026/2, 2026/25, 2026/32)
          - Kalite denetimine tabi tutulan tarım ürünleri (2026/5)
          - Deri ve Tekstil ürünleri (2026/18)
          - Anne ve Bebek ürünleri (2026/17)

          📋 YUKARIDAK İ ÜRÜN GRUPLARINDAKİ HER MODEL NUMARASI AYRI BİR KALEM OLARAK BEYAN EDİLMELİDİR!
          
          ÖRNEK YANLIŞ: 
          - "Oyuncak Araba Model A, B, C - 300 Adet" → TEK KALEM (YANLIŞ!)
          
          ÖRNEK DOĞRU:
          - "Oyuncak Araba Model A - 100 Adet" → BİRİNCİ KALEM
          - "Oyuncak Araba Model B - 100 Adet" → İKİNCİ KALEM  
          - "Oyuncak Araba Model C - 100 Adet" → ÜÇÜNCÜ KALEM

          Bu ürünlerde asla "Model A/B/C" veya "Çeşitli Modeller" gibi birleştirmeler yapma!
          Her modeli ayrı satırda göster, her birinin kendi miktarını, GTİP'ini ve fiyatını yaz.

          HEDEFLERİN VE KURALLARIN:
          1. **HATA PAYI SIFIR OLMALI:** Yanlış GTİP tespiti cezai işlem gerektirir. 
          2. **MODEL KODLARI:** Ürünlerin model kodlarını, parça numaralarını veya artikel numaralarını mutlaka "model_kodu" alanına yaz.
          3. **MENŞEİ TESPİTİ:** Her kalem için menşei ülkesini (ISO 2 haneli kod e.g. TR, CN, DE) tespit et.
          4. **KAP VE MİKTAR:** Kalem bazlı kap adedi ve miktar (Adet/KG/Set) bilgilerini hassas şekilde çek.
          5. **TESLİM ŞEKLİ:** Sadece kod olarak çek (Örn: FOB, CIF, EXW). Yanına şehir ismi ekleme.
          6. **MODEL BAZLI AYRIM:** TAREKS/TARIM/EMNİYET ürünlerinde her farklı model numarası mutlaka ayrı kalem olacak!
          
          ÇIKTI FORMATI (SAF JSON):
          - **gonderici_firma**: { adi, adresi (tam), ulkesi }
          - **alici_firma**: { adi, adresi (tam), vergi_no (varsa) }
          - **belge_bilgileri**: { fatura_no, fatura_tarihi (dd/mm/yyyy), teslim_sekli (SADECE KOD), beyanname_tipi (IM/EX/TR), rejim_kodu, cikis_ulkesi_kodu }
          - **esya_listesi**: [ 
              { 
                "tanimi": "Ürün Adı + Teknik Özellikler", 
                "model_kodu": "MODEL/ARTIKEL KODU",
                "gtip": "1234.56.78.90.00", 
                "mensei": "TR",
                "mensei_tam": "TÜRKİYE",
                "kap_adedi": 0,
                "brut_agirlik": 0.0, 
                "net_agirlik": 0.0, 
                "adet": 0, 
                "birim_fiyat": 0.0, 
                "toplam_fiyat": 0.0, 
                "doviz_cinsi": "USD" 
              } 
            ]
          - **toplamlar**: { toplam_brut_agirlik, toplam_net_agirlik, toplam_fatura_tutari, toplam_kap_adedi }
          - **ozet**: "İncelenen belgeler kapsamında... tespit edilmiştir." şeklinde memur üslubuyla kısa özet.

          Eğer bir bilgi belgede AÇIKÇA yoksa "Belirtilmemiş" yaz veya sayısal değerse 0 ver.
          Çıktı sadece ve sadece saf JSON olmalı.
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

        // 5. Save to Database for History
        try {
            if (session?.user?.email) {
                const user = await prisma.user.findUnique({
                    where: { email: session.user.email },
                    select: { id: true },
                });

                if (user) {
                    await prisma.declaration.create({
                        data: {
                            userId: user.id,
                            fileName: files.map(f => f.name).join(', '),
                            status: 'COMPLETED',
                            result: JSON.stringify(parsedResult),
                        }
                    });
                }
            }
        } catch (dbError) {
            console.error("Failed to save declaration to history:", dbError);
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

