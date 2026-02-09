import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await (prisma.user as any).findUnique({
            where: { email: session.user.email }
        });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Fetch relations separately to avoid "include" issues if client is out of sync
        const declarations = await (prisma as any).declaration.findMany({
            where: { userId: user.id },
            take: 10,
            orderBy: { createdAt: 'desc' }
        }).catch((e: any) => { console.error("Prisma history error:", e); return []; });

        const payments = await (prisma as any).payment.findMany({
            where: { userId: user.id },
            take: 5,
            orderBy: { createdAt: 'desc' }
        }).catch((e: any) => { console.error("Prisma payments error:", e); return []; });

        const banners = await (prisma as any).banner.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        }).catch((e: any) => { console.error("Prisma banners error:", e); return []; });

        const totalUploads = await (prisma as any).declaration.count({
            where: { userId: user.id }
        }).catch(() => 0);

        return NextResponse.json({
            user: {
                name: user.name,
                email: user.email,
                credits: user.credits,
                isPremium: user.isPremium,
                role: user.role,
                image: user.image
            },
            history: declarations,
            payments: payments,
            banners: {
                horizontal: banners.filter((b: any) => b.type === 'HORIZONTAL'),
                vertical: banners.filter((b: any) => b.type === 'VERTICAL')
            },
            stats: {
                totalUploads,
                totalSpend: payments
                    .filter((p: any) => p.status === 'COMPLETED')
                    .reduce((sum: number, p: any) => sum + p.amount, 0)
            }
        });
    } catch (error: any) {
        console.error('User Dashboard Data 500 ERROR:', error.message, error.stack);
        return NextResponse.json({ error: 'Internal error', details: error.message }, { status: 500 });
    }
}
