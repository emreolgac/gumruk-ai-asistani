
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    try {
        const tariffs = await prisma.tariffCode.findMany({
            where: q ? {
                OR: [
                    { code: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                ]
            } : {},
            orderBy: { code: 'asc' },
            take: 50
        });
        return NextResponse.json(tariffs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tariffs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const tariff = await prisma.tariffCode.create({
            data: {
                code: body.code,
                description: body.description,
                gvRate: parseFloat(body.gvRate) || 0,
                kdvRate: parseFloat(body.kdvRate) || 0,
                otvRate: parseFloat(body.otvRate) || 0,
                damgaRate: parseFloat(body.damgaRate) || 0,
                kkdfRate: parseFloat(body.kkdfRate) || 0,
                igvRate: parseFloat(body.igvRate) || 0,
                isProhibited: body.isProhibited || false,
                isPermissionRequired: body.isPermissionRequired || false,
            }
        });

        return NextResponse.json(tariff);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create tariff' }, { status: 500 });
    }
}
