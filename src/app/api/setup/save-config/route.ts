import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { databaseUrl, googleClientId, googleClientSecret, claudeApiKey, paytrMerchantId, paytrSecretKey, appUrl } = body;

        // 1. Prepare .env content
        const envContent = `
DATABASE_URL="${databaseUrl}"
GOOGLE_CLIENT_ID="${googleClientId}"
GOOGLE_CLIENT_SECRET="${googleClientSecret}"
CLAUDE_API_KEY="${claudeApiKey}"
PAYTR_MERCHANT_ID="${paytrMerchantId}"
PAYTR_SECRET_KEY="${paytrSecretKey}"
NEXTAUTH_URL="${appUrl}"
NEXTAUTH_SECRET="${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}"
    `.trim();

        // 2. Write to .env
        const envPath = path.join(process.cwd(), '.env');
        fs.writeFileSync(envPath, envContent);

        // 3. Run Prisma Migration/Push
        // Note: In production (Plesk), we might not have 'npx' in path or sufficient permissions/RAM.
        // It's safer to rely on 'prisma migrate deploy' if migrations exist, or 'db push' for prototyping.
        // We will try to run db push for sqlite/dev or migrate deploy for postgres.

        // For this environment, we assume we can run npx. If not, this step might fail.
        // We can try to use the local node_modules binary.
        try {
            const prismaBin = path.join(process.cwd(), 'node_modules', '.bin', 'prisma');
            // Use 'db push' to sync schema without migrations for easier setup
            await execPromise(`"${prismaBin}" db push --accept-data-loss`, {
                env: { ...process.env, DATABASE_URL: databaseUrl }
            });
        } catch (dbError: any) {
            console.error('Migration failed:', dbError);
            // Continue anyway, maybe the user can run migrations manually or it's already done.
            return NextResponse.json({ success: true, warning: 'Env saved but DB migration failed: ' + dbError.message });
        }

        // 4. Restart Server (Plesk specific)
        // Touching tmp/restart.txt usually triggers a restart in Passenger/Node.js apps on Plesk
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }
        fs.closeSync(fs.openSync(path.join(tmpDir, 'restart.txt'), 'w'));

        return NextResponse.json({ success: true, message: 'Configuration saved and server restarting...' });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
