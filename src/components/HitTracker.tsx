'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function HitTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Avoid tracking admin or internal routes if desired
        if (pathname.startsWith('/api') || pathname.includes('_next')) return;

        fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: pathname }),
        }).catch(() => { });
    }, [pathname]);

    return null;
}
