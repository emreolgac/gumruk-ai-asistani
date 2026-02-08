import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get all stats
        const [
            totalUsers,
            premiumUsers,
            totalDeclarations,
            totalPayments,
            payments,
            apiUsageStats,
            todayApiUsage,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { isPremium: true } }),
            prisma.declaration.count(),
            prisma.payment.count({ where: { status: 'COMPLETED' } }),
            prisma.payment.findMany({
                where: { status: 'COMPLETED' },
                select: { amount: true },
            }),
            prisma.apiUsage.aggregate({
                _sum: {
                    totalTokens: true,
                    cost: true,
                },
                _count: true,
            }),
            prisma.apiUsage.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
        ]);

        const totalRevenue = payments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);

        return NextResponse.json({
            totalUsers,
            premiumUsers,
            totalDeclarations,
            totalPayments,
            totalRevenue,
            apiUsage: {
                totalRequests: apiUsageStats._count,
                totalTokens: apiUsageStats._sum.totalTokens || 0,
                totalCost: apiUsageStats._sum.cost || 0,
                todayRequests: todayApiUsage,
            },
        });
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
