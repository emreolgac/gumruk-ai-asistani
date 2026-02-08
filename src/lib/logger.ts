import prisma from './prisma';

export async function logSystem(level: 'INFO' | 'WARN' | 'ERROR', source: string, message: string, details?: any) {
    try {
        await (prisma as any).systemLog.create({
            data: {
                level,
                source,
                message,
                details: details ? JSON.stringify(details) : null
            }
        });
    } catch (error) {
        console.error('Logging failed:', error);
    }
}
