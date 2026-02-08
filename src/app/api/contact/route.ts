import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logSystem } from '@/lib/logger';

export async function POST(request: Request) {
    try {
        const { name, email, subject, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const newMessage = await (prisma as any).contactMessage.create({
            data: { name, email, subject, message }
        });

        await logSystem('INFO', 'CONTACT', `New message from ${email}`);

        return NextResponse.json({ success: true, id: newMessage.id });
    } catch (error) {
        console.error('Contact error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
