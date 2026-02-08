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

        // Return merge of ENV and DB configs
        const envKeys = [
            { key: 'GEMINI_API_KEY', group: 'API' },
            { key: 'NEXT_PUBLIC_GTM_ID', group: 'SEO' },
            { key: 'NEXT_PUBLIC_GSC_VERIFICATION', group: 'SEO' },
            { key: 'SITE_TITLE', group: 'SEO' },
            { key: 'SITE_DESCRIPTION', group: 'SEO' },
            { key: 'SMTP_HOST', group: 'MAIL' },
            { key: 'SMTP_PORT', group: 'MAIL' },
            { key: 'SMTP_USER', group: 'MAIL' },
            { key: 'SMTP_FROM', group: 'MAIL' }
        ];

        const displayConfigs = envKeys.map(env => {
            const dbVal = configs.find((c: any) => c.key === env.key);
            return {
                key: env.key,
                value: dbVal ? dbVal.value : (process.env[env.key] || ''),
                group: env.group,
                isDb: !!dbVal
            };
        });

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
