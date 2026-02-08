import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from '@/components/Providers';
import { Metadata } from 'next';
import HitTracker from '@/components/HitTracker';

export const metadata: Metadata = {
    title: {
        default: 'Gümrük AI Asistanı | Akıllı Beyanname Analizi',
        template: '%s | Gümrük AI'
    },
    description: 'Yapay zeka destekli gümrük beyannamesi analiz platformu. Belgelerinizi saniyeler içinde analiz edin, hataları azaltın ve operasyonel verimliliğinizi artırın.',
    keywords: ['gümrük', 'ai', 'yapay zeka', 'beyanname analizi', 'dış ticaret', 'gümrük müşavirliği', 'lojistik'],
    authors: [{ name: 'Gümrük AI Ekibi' }],
    viewport: 'width=device-width, initial-scale=1',
    robots: 'index, follow',
    openGraph: {
        type: 'website',
        locale: 'tr_TR',
        url: 'https://gumruk.ai',
        siteName: 'Gümrük AI Asistanı',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Gümrük AI Asistanı',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@gumrukai',
        creator: '@gumrukai',
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GSC_VERIFICATION, // Google Search Console
    }
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale}>
            <head>
                {/* Google Tag Manager (GTM) */}
                {process.env.NEXT_PUBLIC_GTM_ID && (
                    <script dangerouslySetInnerHTML={{
                        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`
                    }} />
                )}
            </head>
            <body className="antialiased">
                {process.env.NEXT_PUBLIC_GTM_ID && (
                    <noscript dangerouslySetInnerHTML={{
                        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}"
                        height="0" width="0" style="display:none;visibility:hidden"></iframe>`
                    }} />
                )}
                <Providers>
                    <NextIntlClientProvider messages={messages}>
                        {children}
                    </NextIntlClientProvider>
                </Providers>
            </body>
        </html>
    );
}
