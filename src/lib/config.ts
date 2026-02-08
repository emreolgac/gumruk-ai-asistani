import prisma from '@/lib/prisma';

export async function getConfig(key: string, defaultValue?: string): Promise<string | undefined> {
    try {
        const config = await (prisma as any).systemConfig.findUnique({
            where: { key }
        });

        if (config) return config.value;
        return process.env[key] || defaultValue;
    } catch (error) {
        return process.env[key] || defaultValue;
    }
}
