'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (nextLocale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <div className="flex gap-2">
            <button
                disabled={isPending || locale === 'tr'}
                onClick={() => onSelectChange('tr')}
                className={`px-3 py-1 rounded ${locale === 'tr' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
                TR
            </button>
            <button
                disabled={isPending || locale === 'en'}
                onClick={() => onSelectChange('en')}
                className={`px-3 py-1 rounded ${locale === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
                EN
            </button>
        </div>
    );
}
