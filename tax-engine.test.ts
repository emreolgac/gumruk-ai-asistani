
import { describe, it, expect } from 'vitest';
import { calculateTaxes } from './src/lib/tax-engine';

describe('Tax Engine', () => {
    it('should calculate basic KDV and GV correctly', () => {
        const tariff: any = {
            gvRate: 10,
            kdvRate: 20,
            otvRate: 0,
            damgaRate: 0,
            kkdfRate: 0,
            igvRate: 0
        };

        const result = calculateTaxes(100, 1, tariff);

        // Matrah = 100
        // GV = 10% of 100 = 10
        // KDV Base = 100 + 10 = 110
        // KDV = 20% of 110 = 22
        // Total Tax = 10 + 22 = 32

        expect(result.gvAmount).toBe(10);
        expect(result.kdvAmount).toBe(22);
        expect(result.totalTax).toBe(32);
        expect(result.grandTotal).toBe(132);
    });

    it('should handle fixed Damga Vergisi', () => {
        const tariff: any = {
            gvRate: 0,
            kdvRate: 0,
            otvRate: 0,
            damgaRate: 15.5, // Fixed amount
            kkdfRate: 0,
            igvRate: 0
        };

        const result = calculateTaxes(100, 30, tariff); // 3000 TRY
        expect(result.damgaAmount).toBe(15.5);
    });
});
