import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email ve şifre gerekli' }, { status: 400 });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, role: true, password: true },
        });

        if (!user || !user.password) {
            // Log failed attempt
            await logAttempt(email, 'FAILED', 'Kullanıcı bulunamadı');
            return NextResponse.json({ error: 'Geçersiz kimlik bilgileri' }, { status: 401 });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            await logAttempt(email, 'FAILED', 'Yanlış şifre');
            return NextResponse.json({ error: 'Geçersiz kimlik bilgileri' }, { status: 401 });
        }

        // Check admin role
        if (user.role !== 'ADMIN') {
            await logAttempt(email, 'DENIED', 'Admin yetkisi yok');
            return NextResponse.json({ error: 'Bu alana erişim yetkiniz yok. Sadece yöneticiler giriş yapabilir.' }, { status: 403 });
        }

        // Success
        await logAttempt(email, 'SUCCESS', 'Admin girişi başarılı');

        return NextResponse.json({
            success: true,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

async function logAttempt(email: string, status: string, message: string) {
    try {
        await prisma.systemLog.create({
            data: {
                level: status === 'SUCCESS' ? 'INFO' : 'WARN',
                source: 'ADMIN_AUTH',
                message: `Admin login ${status}: ${email} - ${message}`,
            }
        });
    } catch (e) {
        console.error('Log error:', e);
    }
}
