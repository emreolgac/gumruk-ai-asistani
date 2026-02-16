import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// Helper to check admin and return admin user info
async function getAdminUser() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, email: true, role: true },
    });

    if (user?.role !== 'ADMIN') return null;
    return user;
}

// Whitelisted fields for user update
const ALLOWED_UPDATE_FIELDS = ['role', 'credits', 'isPremium', 'name', 'subscriptionPlan'];

// GET - List all users
export async function GET() {
    try {
        const admin = await getAdminUser();
        if (!admin) {
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

// PATCH - Update user (whitelisted fields only)
export async function PATCH(request: Request) {
    try {
        const admin = await getAdminUser();
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { userId, ...rawData } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Only allow whitelisted fields
        const safeData: Record<string, any> = {};
        for (const key of ALLOWED_UPDATE_FIELDS) {
            if (key in rawData) {
                safeData[key] = rawData[key];
            }
        }

        if (Object.keys(safeData).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: safeData,
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error('User update error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

// DELETE - Delete user (with self-delete protection)
export async function DELETE(request: Request) {
    try {
        const admin = await getAdminUser();
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Prevent admin from deleting themselves
        if (userId === admin.id) {
            return NextResponse.json({ error: 'Kendi hesabınızı silemezsiniz' }, { status: 400 });
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

// POST - Create user manually
export async function POST(request: Request) {
    try {
        const admin = await getAdminUser();
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { name, email, password, role, credits, isPremium } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const userData: any = {
            name,
            email,
            role: role || 'USER',
            credits: parseInt(credits) || 5,
            isPremium: !!isPremium,
        };

        if (password) {
            const bcrypt = require('bcryptjs');
            userData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.create({
            data: userData,
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error('User creation error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

