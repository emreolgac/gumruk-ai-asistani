
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Check if params needs to be awaited (Next.js 15+ change, though we are on 14/15 transition usually safe to await)
        // For safety in diverse environments:
        const { id } = params;

        const body = await request.json();
        const tariff = await prisma.tariffCode.update({
            where: { id },
            data: {
                code: body.code,
                description: body.description,
                gvRate: parseFloat(body.gvRate),
                kdvRate: parseFloat(body.kdvRate),
                otvRate: parseFloat(body.otvRate),
                damgaRate: parseFloat(body.damgaRate),
                kkdfRate: parseFloat(body.kkdfRate),
                igvRate: parseFloat(body.igvRate),
                isProhibited: body.isProhibited,
                isPermissionRequired: body.isPermissionRequired,
            }
        });

        return NextResponse.json(tariff);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update tariff' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = params;
        await prisma.tariffCode.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete tariff' }, { status: 500 });
    }
}
