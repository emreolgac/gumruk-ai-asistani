import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// Helper to check admin
async function isAdmin() {
    const session = await auth();
    if (!session?.user?.email) return false;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
    });

    return user?.role === 'ADMIN';
}

// GET - List all users
export async function GET() {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                credits: true,
                isPremium: true,
                createdAt: true,
                _count: {
                    select: { declarations: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Users list error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

// PATCH - Update user
export async function PATCH(request: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { userId, ...updateData } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error('User update error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

// DELETE - Delete user
export async function DELETE(request: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('User delete error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
