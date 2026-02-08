'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/tr/login');
            return;
        }

        // Check if user is admin
        const checkAdmin = async () => {
            const res = await fetch('/api/admin/check');
            if (!res.ok) {
                router.push('/tr/dashboard');
                return;
            }
            setIsAuthorized(true);
        };

        checkAdmin();
    }, [session, status, router]);

    if (status === 'loading' || !isAuthorized) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const menuItems = [
        { href: '/tr/admin', label: 'Dashboard', icon: '📊' },
        { href: '/tr/admin/users', label: 'Kullanıcılar', icon: '👥' },
        { href: '/tr/admin/payments', label: 'Ödemeler', icon: '💰' },
        { href: '/tr/admin/api-usage', label: 'API Kullanımı', icon: '🤖' },
        { href: '/tr/admin/settings', label: 'Ayarlar', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        🛃 Admin Panel
                    </h1>
                </div>
                <nav className="mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${isActive
                                        ? 'bg-blue-600 text-white border-r-2 border-blue-400'
                                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Back to site */}
                <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-700">
                    <Link
                        href="/tr/dashboard"
                        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
                    >
                        ← Siteye Dön
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
