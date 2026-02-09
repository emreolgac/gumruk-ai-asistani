const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const banners = [
        {
            title: 'Yapay Zeka ile Gümrük Müşavirliği 2.0',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=400',
            link: '/tr/blog/ai-customs',
            type: 'HORIZONTAL',
            isActive: true,
        },
        {
            title: 'Geleceğin Lojistik Çözümlerini Keşfedin',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200&h=400',
            link: '/tr/blog/future-logistics',
            type: 'HORIZONTAL',
            isActive: true,
        },
        {
            title: 'Limitsiz Analiz Arşivi',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400&h=800',
            link: '/tr#pricing',
            type: 'VERTICAL',
            isActive: true,
        }
    ];

    console.log('Seeding banners...');
    for (const b of banners) {
        await prisma.banner.create({ data: b });
    }
    console.log('Done!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
