import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { getConfig } from '@/lib/config';
import { logSystem } from '@/lib/logger';
import { trackHit } from '@/lib/analytics';
import { getExchangeRate } from '@/lib/currency';
import { rateLimit } from '@/lib/rate-limit';
import * as XLSX from 'xlsx';

// Claude pricing (per 1M tokens) - approximate for claude-sonnet-4-6
const PRICING = {
    input: 3.00 / 1000000,
    output: 15.00 / 1000000,
};

const MODEL_NAME = "claude-sonnet-4-6";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `Sen Türkiye Cumhuriyeti gümrük mevzuatına tam hakim, deneyimli bir gümrük müşavirisin. Görevin: kullanıcıların yüklediği ticari belgeleri analiz ederek ithalat beyannamesi verilerini otomatik olarak çıkarmak ve yapılandırılmış çıktı üretmektir.

Analiz edebileceğin belgeler: Ticari Fatura (Commercial Invoice), Çeki Listesi (Packing List), Konşimento (B/L, AWB, CMR), Menşe Belgesi (A.TR, EUR.1, Form A), özel firma Excel/TCP dosyaları. Excel dosyaları için sütun başlıklarını otomatik tanı, eşleştir, tanıyamadıklarını kullanıcıya sor.

Bildiğin mevzuat: 4458 Sayılı Gümrük Kanunu, Gümrük Yönetmeliği, Türk Gümrük Tarife Cetveli (TGTC), ÖTV Kanunu, KDV Kanunu, İthalat Rejim Kararnamesi, Gözetim ve Korunma Önlemleri Tebliğleri, A.TR/EUR.1/Form A uygulamaları, TAREKS, KKDF, Dahilde İşleme Rejimi.

GTİP TESPİT ADIMLARI:
1. Bölüm tespiti
2. Fasıl tespiti (2 hane)
3. Pozisyon (4 hane)
4. Alt pozisyon (6 hane - HS kodu)
5. Türk istatistik kodu (12 hane - tam GTİP)
6. Verifikasyon: Genel Yorum Kuralları, tarife notları, özel uygulamalar (gözetim, kota, TAREKS, izin belgesi)

Her kalem için GTİP güven seviyesi belirt: YÜKSEK (%90+), ORTA (%70-89), DÜŞÜK (<%70).

VERGİ HESAPLAMA:
- Gümrük Vergisi: CIF değer üzerinden, menşeye göre tercihli oran uygula
- KDV: (CIF + GV + ÖTV) üzerinden, genel oran %20
- ÖTV: ilgili liste ve oran (varsa)
- KKDF: vadeli ithalatta %3
- Antidümping/telafi edici: ilgili tebliği belirt

KRİTİK UYARI üret şu durumlarda: GTİP güveni DÜŞÜK, gözetim tebliğine tabi eşya, TAREKS zorunluluğu, CE/TSE/TÜRKAK belgesi gerektiren ürün, antidümping kapsamı, kota, kıymet şüphesi.

ÇIKTI FORMATI - Her analizde hem JSON hem XML üret:

JSON:
{
  "beyanname": {
    "analiz_tarihi": "",
    "belge_turu": "",
    "ithalatci": { "unvan": "", "vergi_no": "", "adres": "" },
    "ihracatci": { "unvan": "", "ulke": "", "adres": "" },
    "tasima": { "mod": "", "cikis_ulke": "", "cikis_liman": "", "varis_liman": "", "konsimento_no": "", "konteyner_no": "" },
    "kiymet": { "doviz": "", "fob_deger": 0, "navlun": 0, "sigorta": 0, "cif_deger": 0 },
    "kalemler": [
      {
        "kalem_no": 1,
        "aciklama": "",
        "gtip": "",
        "gtip_guven": "",
        "gtip_gerekcesi": "",
        "alternatif_gtip": "",
        "miktar": 0,
        "birim": "",
        "brut_agirlik": 0,
        "net_agirlik": 0,
        "birim_fiyat": 0,
        "toplam_fiyat": 0,
        "mense_ulke": "",
        "tercihli_tarife": false,
        "vergiler": {
          "gumruk_vergisi_orani": 0,
          "gumruk_vergisi_tutari": 0,
          "kdv_orani": 20,
          "kdv_tutari": 0,
          "otv_orani": 0,
          "otv_tutari": 0,
          "kkdf_orani": 0,
          "kkdf_tutari": 0,
          "antidumping": 0,
          "toplam_vergi": 0
        },
        "ozel_uygulamalar": {
          "gozetime_tabi": false,
          "gozetime_teblig": "",
          "tareks_gerekli": false,
          "izin_belgesi": "",
          "kota_tabi": false
        },
        "uyarilar": []
      }
    ],
    "ozet": {
      "toplam_cif": 0,
      "toplam_gumruk_vergisi": 0,
      "toplam_kdv": 0,
      "toplam_otv": 0,
      "toplam_vergi_yuku": 0,
      "eksik_bilgiler": [],
      "kritik_uyarilar": []
    }
  }
}

XML (Evrim/Mavi/Bilge uyumlu):
<?xml version="1.0" encoding="UTF-8"?>
<BEYANNAME>
  <BASLIK>
    <BEYAN_TARIHI></BEYAN_TARIHI>
    <ITHALATCI_UNVAN></ITHALATCI_UNVAN>
    <ITHALATCI_VERGINO></ITHALATCI_VERGINO>
    <IHRACATCI_UNVAN></IHRACATCI_UNVAN>
    <MENSE_ULKE></MENSE_ULKE>
    <TASIMA_MODU></TASIMA_MODU>
    <CIKIS_ULKE></CIKIS_ULKE>
    <VARIS_LIMAN></VARIS_LIMAN>
    <KONSIMENTO_NO></KONSIMENTO_NO>
    <DOVIZ_CINSI></DOVIZ_CINSI>
    <TOPLAM_CIF></TOPLAM_CIF>
  </BASLIK>
  <KALEMLER>
    <KALEM SIRA="1">
      <GTIP></GTIP>
      <ESYA_TANIMI></ESYA_TANIMI>
      <MENSE_ULKE></MENSE_ULKE>
      <MIKTAR></MIKTAR>
      <MIKTAR_BIRIMI></MIKTAR_BIRIMI>
      <BRUT_AGIRLIK></BRUT_AGIRLIK>
      <NET_AGIRLIK></NET_AGIRLIK>
      <ISTATISTIK_KIYMET></ISTATISTIK_KIYMET>
      <FATURA_BEDELI></FATURA_BEDELI>
      <TERCIHLI_TARIFE></TERCIHLI_TARIFE>
      <GV_ORANI></GV_ORANI>
      <GV_TUTARI></GV_TUTARI>
      <KDV_ORANI></KDV_ORANI>
      <KDV_TUTARI></KDV_TUTARI>
      <OTV_ORANI></OTV_ORANI>
      <OTV_TUTARI></OTV_TUTARI>
    </KALEM>
  </KALEMLER>
</BEYANNAME>

Eksik bilgi varsa alanı boş bırak, eksik_bilgiler dizisine açıklama ekle, yine de mümkün olan en iyi tahmini üret.
Türkçe yanıt ver, gümrük terminolojisini doğru kullan.
Son not: "Bu analiz bilgilendirme amaçlıdır. Kesin beyanname sorumluluğu yetkili gümrük müşavirine aittir."`;

export async function POST(request: NextRequest) {
    try {
        await trackHit('api/analyze');

        // --- Rate Limit ---
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        const limiter = rateLimit(ip, 10, 60 * 1000); // 10 requests per minute per IP
        if (!limiter.success) {
            return NextResponse.json({ error: 'Çok fazla istek. Lütfen bir dakika sonra deneyin.' }, { status: 429 });
        }

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

        const apiKey = await getConfig('CLAUDE_API_KEY');
        if (!apiKey) {
            await logSystem('ERROR', 'API', 'Claude API Key missing');
            return NextResponse.json({ error: 'API anahtarı bulunamadı (CLAUDE_API_KEY).' }, { status: 500 });
        }

        // 3. Prepare files for Claude Messages API
        const contentParts: Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }> = [];

        await Promise.all(
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

                        workbook.SheetNames.forEach(name => {
                            const sheet = workbook.Sheets[name];
                            const csv = XLSX.utils.sheet_to_csv(sheet);
                            fullContent += `[SAYFA: ${name}]\n${csv}\n`;
                        });

                        fullContent += `--- EXCEL SONU ---\n`;
                        contentParts.push({ type: 'text', text: fullContent });
                    } catch (e) {
                        console.error('Excel parsing error:', e);
                        // Fallback: send as text description
                        contentParts.push({ type: 'text', text: `[Excel dosyası okunamadı: ${file.name}]` });
                    }
                } else if (file.type.startsWith('image/')) {
                    // Images: Claude supports base64 image content
                    contentParts.push({
                        type: 'image',
                        source: {
                            type: 'base64',
                            media_type: file.type,
                            data: buffer.toString('base64'),
                        },
                    });
                } else if (file.type === 'application/pdf') {
                    // PDF: Claude supports PDF via base64 document type
                    contentParts.push({
                        type: 'document' as string,
                        source: {
                            type: 'base64',
                            media_type: 'application/pdf',
                            data: buffer.toString('base64'),
                        },
                    });
                } else {
                    // Other file types: try to send as text
                    try {
                        const textContent = buffer.toString('utf-8');
                        contentParts.push({ type: 'text', text: `--- DOSYA: ${file.name} ---\n${textContent}\n--- DOSYA SONU ---` });
                    } catch {
                        contentParts.push({ type: 'text', text: `[Dosya okunamadı: ${file.name}]` });
                    }
                }
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

        const userMessage = `
          DİKKAT: Ekte sunulan ticari belgeleri 4458 sayılı Gümrük Kanunu'na göre analiz et.
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

        // 4. Claude API Call
        const claudeRequestBody = {
            model: MODEL_NAME,
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: [
                {
                    role: 'user',
                    content: [
                        ...contentParts,
                        { type: 'text', text: userMessage },
                    ],
                },
            ],
        };

        const claudeResponse = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(claudeRequestBody),
        });

        if (!claudeResponse.ok) {
            const errorBody = await claudeResponse.text();
            console.error('Claude API Error:', claudeResponse.status, errorBody);
            throw new Error(`Claude API hatası: ${claudeResponse.status} - ${errorBody}`);
        }

        const claudeData = await claudeResponse.json();
        const responseText = claudeData.content
            ?.filter((block: any) => block.type === 'text')
            .map((block: any) => block.text)
            .join('') || '';

        // Track Usage
        const usage = claudeData.usage;
        if (usage) {
            const cost = (usage.input_tokens * PRICING.input) + (usage.output_tokens * PRICING.output);
            await prisma.apiUsage.create({
                data: {
                    userId: user.id,
                    model: MODEL_NAME,
                    inputTokens: usage.input_tokens || 0,
                    outputTokens: usage.output_tokens || 0,
                    totalTokens: (usage.input_tokens || 0) + (usage.output_tokens || 0),
                    cost,
                    endpoint: 'analyze',
                },
            });
        }

        // 5. Post-Process (Credits, Taxes, Audit)
        let cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        let parsedResult = JSON.parse(cleanJson);

        // Fetch Live Exchange Rate
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

        // Auditor
        try {
            const { auditDeclaration } = await import('@/lib/agents/auditor');
            parsedResult.denetmen_raporu = await auditDeclaration(parsedResult, regimeInstructions);
        } catch (e) { console.error("Auditor error", e); }

        // 6. DB Deduction & History
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
