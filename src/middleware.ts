import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    // Check if DATABASE_URL is set (Installation check)
    const isInstalled = !!process.env.DATABASE_URL;

    const { pathname } = request.nextUrl;

    const isInstallPage = pathname.startsWith('/install') || pathname.startsWith('/api/setup');
    const isApi = pathname.startsWith('/api');
    const isPublicAsset = pathname.startsWith('/_next') || pathname.includes('.');

    // Redirect to install if not installed
    if (!isInstalled && !isInstallPage && !isPublicAsset) {
        return NextResponse.redirect(new URL('/install', request.url));
    }

    // Skip i18n for API and Install pages (unless we want i18n there too, but let's keep it simple for now)
    if (isInstallPage || isApi || isPublicAsset) {
        return NextResponse.next();
    }

    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(tr|en)/:path*', '/install', '/((?!api|_next|_vercel|.*\\..*).*)']
};
