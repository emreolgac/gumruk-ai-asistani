import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// POST - Give/remove credits to/from a user
export async function POST(request: Request) {
    try {
        // Verify admin
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true, name: true },
        });

        if (adminUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { userId, amount, description } = body;

        if (!userId || !amount || typeof amount !== 'number') {
            return NextResponse.json({ error: 'userId ve amount gerekli' }, { status: 400 });
        }

        // Update user credits
        const user = await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: amount } },
            select: { id: true, name: true, email: true, credits: true },
        });

        // Record transaction
        await prisma.creditTransaction.create({
            data: {
                userId,
                amount,
                type: 'ADMIN_GIFT',
                description: description || `Admin (${adminUser.name}) tarafından ${amount > 0 ? '+' : ''}${amount} kredi`,
            }
        });

        // Log it
        await prisma.systemLog.create({
            data: {
                level: 'INFO',
                source: 'ADMIN',
                message: `Kredi işlemi: ${user.email} → ${amount > 0 ? '+' : ''}${amount} kredi (Toplam: ${user.credits})`,
            }
        });

        return NextResponse.json({
            success: true,
            user,
            newBalance: user.credits,
        });

    } catch (error) {
        console.error('Credit operation error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

// GET - Get credit history for a user
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true },
        });

        if (adminUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId gerekli' }, { status: 400 });
        }

        const transactions = await prisma.creditTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return NextResponse.json({ transactions });

    } catch (error) {
        console.error('Credit history error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
