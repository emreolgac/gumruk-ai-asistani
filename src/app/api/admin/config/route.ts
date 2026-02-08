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
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const configs = await (prisma as any).systemConfig.findMany();

        // Return merge of ENV and DB configs (for display)
        const displayConfigs = [
            { key: 'GEMINI_API_KEY', value: process.env.GEMINI_API_KEY ? '********' : '', group: 'API' },
            { key: 'NEXT_PUBLIC_GTM_ID', value: process.env.NEXT_PUBLIC_GTM_ID || '', group: 'SEO' },
            { key: 'NEXT_PUBLIC_GSC_VERIFICATION', value: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '', group: 'SEO' },
            ...configs.map((c: any) => ({ ...c, isDb: true }))
        ];

        return NextResponse.json(displayConfigs);
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const { key, value, group } = await request.json();

        const config = await (prisma as any).systemConfig.upsert({
            where: { key },
            update: { value, group },
            create: { key, value, group }
        });

        return NextResponse.json(config);
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
