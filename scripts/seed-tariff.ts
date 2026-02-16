
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Tariff Codes (GTİP)...');

    const tariffCodes = [
        {
            code: '8504.40.30.00.00',
            description: 'Statik konvertörler; telekomünikasyon cihazları için',
            gvRate: 0,
            kdvRate: 20,
            otvRate: 0,
            kkdfRate: 6, // Vadeli ise
            damgaRate: 348.50, // Sabit (varsayılan beyanname damga vergisi)
        },
        {
            code: '8703.23.19.00.00',
            description: 'Binek Otomobiller (Benzinli, 1500cc-3000cc)',
            gvRate: 10,
            kdvRate: 20,
            otvRate: 80, // Örnek yüksek ÖTV
            kkdfRate: 0,
            damgaRate: 348.50,
        },
        {
            code: '3304.99.00.00.00',
            description: 'Makyaj veya cilt bakımı müstahzarları',
            gvRate: 0, // AB menşeli varsayımı
            igvRate: 20, // İlave GV
            kdvRate: 20,
            otvRate: 20,
            kkdfRate: 0,
            damgaRate: 0,
        }
    ];

    for (const tc of tariffCodes) {
        const existing = await prisma.tariffCode.findUnique({
            where: { code: tc.code },
        });

        if (!existing) {
            await prisma.tariffCode.create({
                data: tc,
            });
            console.log(`Created: ${tc.code}`);
        } else {
            console.log(`Skipped (Exists): ${tc.code}`);
        }
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
