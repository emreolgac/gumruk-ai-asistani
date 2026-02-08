import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

async function isAdmin() {
    const session = await auth();
    if (!session?.user?.email) return false;
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
    });
    return user?.role === 'ADMIN';
}

export async function GET() {
    try {
        const links = await (prisma as any).socialLink.findMany({
            where: { isActive: true }
        });
        return NextResponse.json(links);
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const body = await request.json();
        const link = await (prisma as any).socialLink.create({ data: body });
        return NextResponse.json(link);
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const { id } = await request.json();
        await (prisma as any).socialLink.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
