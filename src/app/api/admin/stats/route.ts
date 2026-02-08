import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { startOfDay, startOfWeek, startOfMonth, subDays } from 'date-fns';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const now = new Date();
        const today = startOfDay(now);
        const thisWeek = startOfWeek(now);
        const thisMonth = startOfMonth(now);

        const [
            totalUsers,
            todayUsers,
            weekUsers,
            totalPayments,
            allPayments,
            totalHits,
            todayHits,
            weekHits,
            monthHits,
            apiUsageStats,
            activeSessions,
            recentLogs,
            totalMessages,
            unreadMessages,
            recentBlogs,
            latestUsers
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { createdAt: { gte: today } } }),
            prisma.user.count({ where: { createdAt: { gte: thisWeek } } }),
            prisma.payment.count({ where: { status: 'COMPLETED' } }),
            prisma.payment.findMany({
                where: { status: 'COMPLETED' },
                select: { amount: true, createdAt: true },
            }),
            (prisma as any).pageHit.count(),
            (prisma as any).pageHit.count({ where: { createdAt: { gte: today } } }),
            (prisma as any).pageHit.count({ where: { createdAt: { gte: thisWeek } } }),
            (prisma as any).pageHit.count({ where: { createdAt: { gte: thisMonth } } }),
            prisma.apiUsage.aggregate({
                _sum: { totalTokens: true, cost: true },
                _count: true,
            }),
            prisma.session.count({ where: { expires: { gte: now } } }),
            (prisma as any).systemLog.findMany({
                take: 15,
                orderBy: { createdAt: 'desc' },
            }),
            (prisma as any).contactMessage.count(),
            (prisma as any).contactMessage.count({ where: { isRead: false } }),
            (prisma as any).blogPost.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, title: true, createdAt: true, isActive: true }
            }),
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, email: true, createdAt: true, role: true }
            })
        ]);

        // Calculate Revenues
        const stats = {
            revenue: {
                today: allPayments.filter(p => p.createdAt >= today).reduce((sum, p) => sum + p.amount, 0),
                week: allPayments.filter(p => p.createdAt >= thisWeek).reduce((sum, p) => sum + p.amount, 0),
                month: allPayments.filter(p => p.createdAt >= thisMonth).reduce((sum, p) => sum + p.amount, 0),
                total: allPayments.reduce((sum, p) => sum + p.amount, 0),
            },
            users: {
                total: totalUsers,
                today: todayUsers,
                week: weekUsers,
                online: activeSessions,
                latest: latestUsers
            },
            hits: {
                total: totalHits,
                today: todayHits,
                week: weekHits,
                month: monthHits,
            },
            api: {
                requests: apiUsageStats._count,
                tokens: apiUsageStats._sum.totalTokens || 0,
                cost: apiUsageStats._sum.cost || 0,
            },
            messages: {
                total: totalMessages,
                unread: unreadMessages
            },
            blogs: recentBlogs,
            recentLogs
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
