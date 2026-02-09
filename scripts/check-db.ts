import { PrismaClient } from '@prisma/client'

async function main() {
    console.log("Checking database connection...");
    console.log("DATABASE_URL from process.env:", process.env.DATABASE_URL);

    const prisma = new PrismaClient();

    try {
        await prisma.$connect();
        console.log("Successfully connected to the database.");

        const count = await prisma.systemLog.count();
        console.log(`Total system logs: ${count}`);

        const latestLogs = await prisma.systemLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        console.log("Latest 5 system logs:");
        console.dir(latestLogs, { depth: null });

        const userCount = await prisma.user.count();
        console.log(`Total users: ${userCount}`);

        const declarationCount = await prisma.declaration.count();
        console.log(`Total declarations: ${declarationCount}`);

        const pageHitCount = await prisma.pageHit.count();
        console.log(`Total page hits: ${pageHitCount}`);

        const users = await prisma.user.findMany();
        console.log("Users:");
        console.dir(users, { depth: null });

    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
