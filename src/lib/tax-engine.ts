
import { TariffCode } from '@prisma/client';

export interface TaxCalculationResult {
    cif: number;
    exchangeRate: number;
    baseAmountTry: number; // Matrah (CIF * Kur)

    // Tax Amounts
    gvAmount: number;
    kdvAmount: number;
    otvAmount: number;
    damgaAmount: number;
    kkdfAmount: number;
    igvAmount: number;

    totalTax: number;
    grandTotal: number; // Matrah + Total Tax

    details: {
        gvRate: number;
        kdvRate: number;
        otvRate: number;
        damgaRate: number;
        kkdfRate: number;
        igvRate: number;
    };
}

/**
 * Calculates customs taxes based on the Tariff Code and CIF amount.
 * 
 * @param cifAmount - The CIF value of the goods (Cost, Insurance, Freight) in foreign currency
 * @param exchangeRate - The exchange rate to convert CIF to local currency (TRY)
 * @param tariff - The TariffCode object containing tax rates
 * @returns TaxCalculationResult
 */
export function calculateTaxes(
    cifAmount: number,
    exchangeRate: number,
    tariff: TariffCode
): TaxCalculationResult {
    // 1. Matrah (CIF Bedeli * Kur)
    const baseAmountTry = cifAmount * exchangeRate;

    // 2. Gümrük Vergisi (GV)
    // GV Matrahı = CIF Bedeli (TL)
    const gvAmount = baseAmountTry * (tariff.gvRate / 100);

    // 3. İlave Gümrük Vergisi (İGV)
    // İGV Matrahı = CIF Bedeli (TL) + GV (Genellikle GV matrahına eklenir ama uygulamada matrah CIF'tir)
    // Note: İGV uygulaması ürüne göre değişir, basitleştirilmiş haliyle CIF üzerinden hesaplıyoruz.
    const igvAmount = baseAmountTry * (tariff.igvRate / 100);

    // 4. Özel Tüketim Vergisi (ÖTV)
    // ÖTV Matrahı = CIF + GV + İGV + Diğer Vergiler (KDV Hariç)
    // Basitlik için sadece GV ve İGV ekliyoruz.
    const otvBase = baseAmountTry + gvAmount + igvAmount;
    const otvAmount = otvBase * (tariff.otvRate / 100);

    // 5. KKDF (Kaynak Kullanımını Destekleme Fonu)
    // Genelde vadeli ithalatta %6. Peşin ödemede 0.
    // Varsayılan olarak tarifeden gelen oranı kullanıyoruz.
    const kkdfAmount = baseAmountTry * (tariff.kkdfRate / 100);

    // 6. Damga Vergisi
    // Beyanname başına maktu veya oranlı olabilir. Burada tarifedeki oranı kullanıyoruz (Varsa).
    // Genelde CIF üzerinden binde X şeklindedir veya sabit tutardır.
    // Eğer oran < 1 ise (örn 0.00948) oran olarak, > 1 ise sabit tutar olarak kabul edebiliriz.
    let damgaAmount = 0;
    if (tariff.damgaRate > 1) {
        damgaAmount = tariff.damgaRate; // Sabit Tutar
    } else {
        damgaAmount = baseAmountTry * tariff.damgaRate; // Oran
    }

    // 7. KDV (Katma Değer Vergisi)
    // KDV Matrahı = CIF + GV + İGV + ÖTV + KKDF + Damga + Diğer harcamalar
    const kdvBase = baseAmountTry + gvAmount + igvAmount + otvAmount + kkdfAmount + damgaAmount;
    const kdvAmount = kdvBase * (tariff.kdvRate / 100);

    // Toplam Vergi
    const totalTax = gvAmount + igvAmount + otvAmount + kkdfAmount + damgaAmount + kdvAmount;

    // Genel Toplam (Maliyet)
    const grandTotal = baseAmountTry + totalTax;

    return {
        cif: cifAmount,
        exchangeRate,
        baseAmountTry,
        gvAmount,
        kdvAmount,
        otvAmount,
        damgaAmount,
        kkdfAmount,
        igvAmount,
        totalTax,
        grandTotal,
        details: {
            gvRate: tariff.gvRate,
            kdvRate: tariff.kdvRate,
            otvRate: tariff.otvRate,
            damgaRate: tariff.damgaRate,
            kkdfRate: tariff.kkdfRate,
            igvRate: tariff.igvRate,
        },
    };
}
