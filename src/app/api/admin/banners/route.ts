import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

async function isAdmin() {
    const session = await auth();
    if (!session?.user?.email) return false;
    const user = await (prisma.user as any).findUnique({
        where: { email: session.user.email },
        select: { role: true },
    });
    return user?.role === 'ADMIN';
}

export async function GET() {
    try {
        const banners = await (prisma as any).banner.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(banners);
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const body = await request.json();
        const banner = await (prisma as any).banner.create({ data: body });
        return NextResponse.json(banner);
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const { id, ...data } = await request.json();
        const banner = await (prisma as any).banner.update({ where: { id }, data });
        return NextResponse.json(banner);
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const { id } = await request.json();
        await (prisma as any).banner.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
