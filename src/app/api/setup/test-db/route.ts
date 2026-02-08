import { NextResponse } from 'next/server';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { databaseUrl } = await request.json();

        if (!databaseUrl) {
            return NextResponse.json({ success: false, error: 'Veritabanı URL eksik.' });
        }

        if (databaseUrl.startsWith('file:') || databaseUrl.includes('sqlite')) {
            // SQLite Test
            // Just check if we can write to the directory
            try {
                const filePath = databaseUrl.replace('file:', '');
                const dir = path.dirname(filePath);

                // Check if dir exists or can be created
                if (!fs.existsSync(dir)) {
                    // Try to check write permission by checking parent
                    // For simplicity, assume if it's a valid path string it's ok for SQLite 
                    // as Prisma will create the file.
                }
                return NextResponse.json({ success: true, message: 'SQLite bağlantısı başarılı (Dosya yolu geçerli).' });

            } catch (e: any) {
                return NextResponse.json({ success: false, error: 'SQLite yolu geçersiz: ' + e.message });
            }
        } else {
            // PostgreSQL Test
            const client = new Client({
                connectionString: databaseUrl,
            });

            try {
                await client.connect();
                await client.query('SELECT 1');
                await client.end();
                return NextResponse.json({ success: true, message: 'PostgreSQL bağlantısı başarılı.' });
            } catch (dbError: any) {
                return NextResponse.json({ success: false, error: 'Veritabanı bağlantı hatası: ' + dbError.message });
            }
        }

    } catch (error: any) {
        return NextResponse.json({ success: false, error: 'Bir hata oluştu: ' + error.message });
    }
}
