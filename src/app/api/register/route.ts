import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { name, email, password, phone, company } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Eksik bilgi girdiniz.' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Bu email zaten kullanımda.' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                company,
                credits: 5, // Free credits
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Kullanıcı başarıyla oluşturuldu.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
    }
}
