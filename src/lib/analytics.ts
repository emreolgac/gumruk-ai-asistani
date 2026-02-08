import prisma from './prisma';

export async function trackHit(path: string, ip?: string, userAgent?: string) {
    try {
        // Basic rate limit or deduplication could go here
        await (prisma as any).pageHit.create({
            data: { path, ip, userAgent }
        });
    } catch (error) {
        // Silently fail hit tracking
    }
}
