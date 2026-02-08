import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Default admin credentials
    const adminEmail = 'admin@gumruk.ai';
    const adminPassword = 'Admin123!';

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create or update admin user
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            name: 'Admin',
        },
        create: {
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
            name: 'Admin',
            credits: 999,
            isPremium: true,
        },
    });

    console.log('✅ Admin kullanıcı oluşturuldu!');
    console.log('');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Şifre:', adminPassword);
    console.log('');
    console.log('Bu bilgilerle giriş yapabilirsiniz.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
