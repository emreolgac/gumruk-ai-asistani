import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if current user is admin
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true },
        });

        if (!currentUser || currentUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Find and update user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        });

        return NextResponse.json({ success: true, message: `${email} is now an admin` });
    } catch (error) {
        console.error('Make admin error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
