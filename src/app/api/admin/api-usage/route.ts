import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

interface ModelUsage {
    model: string;
    _count: number;
    _sum: { totalTokens: number | null };
}

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

        // Get recent usages
        const usages = await prisma.apiUsage.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });

        // Get summary stats
        const aggregateStats = await prisma.apiUsage.aggregate({
            _sum: {
                totalTokens: true,
                cost: true,
            },
            _count: true,
        });

        // Get usage by model
        const byModel = await prisma.apiUsage.groupBy({
            by: ['model'],
            _count: true,
            _sum: {
                totalTokens: true,
            },
        });

        return NextResponse.json({
            usages,
            summary: {
                totalRequests: aggregateStats._count,
                totalTokens: aggregateStats._sum.totalTokens || 0,
                totalCost: aggregateStats._sum.cost || 0,
                byModel: byModel.map((item: ModelUsage) => ({
                    model: item.model,
                    count: item._count,
                    tokens: item._sum.totalTokens || 0,
                })),
            },
        });
    } catch (error) {
        console.error('API usage error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
