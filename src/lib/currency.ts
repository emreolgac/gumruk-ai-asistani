
import { getConfig } from './config';
import prisma from './prisma';

export async function getExchangeRate(currency: string = 'USD'): Promise<number> {
    try {
        // 1. Try to fetch from TCMB (Simplified logic)
        // In a real production app, we would use a library or a direct XML parse of:
        // https://www.tcmb.gov.tr/kurlar/today.xml

        // Mocking the fetch for now but using a dynamic fallback
        const response = await fetch('https://hasanadiguzel.com.tr/api/kurgetir'); // A common public proxy for TCMB
        if (response.ok) {
            const data = await response.json();
            const currencyData = data.TCMB_AnlikKurlar.find((k: any) => k.Isim === (currency === 'USD' ? 'ABD DOLARI' : currency));
            if (currencyData) {
                return parseFloat(currencyData.ForexSelling);
            }
        }
    } catch (e) {
        console.error('Failed to fetch live exchange rate, using fallback:', e);
    }

    // 2. Fallback to SystemConfig DB
    const dbRate = await getConfig('EXCHANGE_RATE_' + currency);
    if (dbRate) return parseFloat(dbRate);

    // 3. Ultimate hardcoded fallback (Better than nothing)
    return 36.45;
}
