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
        const plans = await (prisma as any).pricingPlan.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(plans);
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const body = await request.json();
        const plan = await (prisma as any).pricingPlan.create({ data: body });
        return NextResponse.json(plan);
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const body = await request.json();
        const { id, ...data } = body;
        const plan = await (prisma as any).pricingPlan.update({ where: { id }, data });
        return NextResponse.json(plan);
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const { id } = await request.json();
        await (prisma as any).pricingPlan.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
