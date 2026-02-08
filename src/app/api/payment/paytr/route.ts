import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { plan } = await request.json();

        // 1. Get User Session (Mocked for now)
        const user = { email: 'user@example.com', name: 'Test User' };

        // 2. Prepare PayTR Parameters
        const merchant_id = process.env.PAYTR_MERCHANT_ID;
        const merchant_key = process.env.PAYTR_SECRET_KEY; // Using secret for both key/salt for simplicity in mock
        const merchant_salt = process.env.PAYTR_SECRET_KEY;

        // In real implementation: 
        // - Calculate token
        // - Prepare user_basket
        // - Request PayTR IFRAME token

        // Mock Response
        return NextResponse.json({
            status: 'success',
            iframeUrl: 'https://www.paytr.com/odeme/guvenli/mock-token',
            message: 'PayTR entegrasyonu (Mock) başarılı.'
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
