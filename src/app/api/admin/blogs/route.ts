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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const isActive = searchParams.get('active');

        const blogs = await (prisma as any).blogPost.findMany({
            where: isActive ? { isActive: true } : {},
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(blogs);
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const body = await request.json();
        const blog = await (prisma as any).blogPost.create({ data: body });
        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const body = await request.json();
        const { id, ...data } = body;
        const blog = await (prisma as any).blogPost.update({ where: { id }, data });
        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const { id } = await request.json();
        await (prisma as any).blogPost.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
