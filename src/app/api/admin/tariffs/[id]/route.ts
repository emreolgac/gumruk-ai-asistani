
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';


export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
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

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
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
