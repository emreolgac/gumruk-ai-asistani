import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Check ---');
    const users = await prisma.user.findMany();
    console.log('Count:', users.length);
    for (const u of users) {
        console.log(`JSON: ${JSON.stringify({ email: u.email, role: u.role, hasPass: !!u.password })}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
