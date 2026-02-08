import { NextResponse } from 'next/server';
import { trackHit } from '@/lib/analytics';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { path } = await request.json();
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';
        const ua = headersList.get('user-agent') || 'unknown';

        await trackHit(path, ip, ua);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
