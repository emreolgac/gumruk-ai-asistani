
const rates = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(ip: string, limit: number = 60, windowMs: number = 60 * 1000): { success: boolean; remaining: number } {
    const now = Date.now();
    const rate = rates.get(ip) || { count: 0, lastReset: now };

    if (now - rate.lastReset > windowMs) {
        rate.count = 0;
        rate.lastReset = now;
    }

    rate.count++;
    rates.set(ip, rate);

    return {
        success: rate.count <= limit,
        remaining: Math.max(0, limit - rate.count)
    };
}
