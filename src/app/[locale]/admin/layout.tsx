'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Users,
    CreditCard,
    Bot,
    Settings,
    Terminal,
    LogOut,
    LayoutDashboard,
    ArrowLeft,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/tr/login');
            return;
        }

        const checkAdmin = async () => {
            try {
                const res = await fetch('/api/admin/check');
                if (!res.ok) {
                    router.push('/tr/dashboard');
                    return;
                }
                setIsAuthorized(true);
            } catch {
                router.push('/tr/dashboard');
            }
        };

        checkAdmin();
    }, [session, status, router]);

    if (status === 'loading' || !isAuthorized) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                    <ShieldCheck className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
            </div>
        );
    }

    const menuItems = [
        { href: '/tr/admin', label: 'Genel Bakış', icon: <LayoutDashboard className="w-5 h-5" /> },
        { href: '/tr/admin/users', label: 'Kullanıcılar', icon: <Users className="w-5 h-5" /> },
        { href: '/tr/admin/payments', label: 'Ödemeler', icon: <CreditCard className="w-5 h-5" /> },
        { href: '/tr/admin/api-usage', label: 'API Kullanımı', icon: <Bot className="w-5 h-5" /> },
        { href: '/tr/admin/logs', label: 'Sistem Logları', icon: <Terminal className="w-5 h-5" /> },
        { href: '/tr/admin/settings', label: 'Ayarlar', icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen bg-[#030712] text-gray-100 flex font-sans">
            {/* Sidebar */}
            <aside className={`fixed lg:relative z-50 transition-all duration-500 ease-in-out border-r border-white/5 bg-[#0a0f1d] ${isSidebarOpen ? 'w-80' : 'w-20'} overflow-hidden h-screen flex flex-col`}>
                <div className="p-8 pb-12 flex items-center justify-between">
                    {isSidebarOpen && (
                        <Link href="/tr/admin" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-black text-white tracking-tight">ADMIN PANEL</span>
                        </Link>
                    )}
                    {!isSidebarOpen && (
                        <div className="w-10 h-10 mx-auto bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 relative ${isActive
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </div>
                                {isSidebarOpen && <span className="font-bold text-sm tracking-wide">{item.label}</span>}
                                {isActive && isSidebarOpen && (
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-2">
                    <Link
                        href="/tr/dashboard"
                        className="flex items-center gap-4 px-4 py-4 text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        {isSidebarOpen && <span className="font-bold text-sm">Siteye Dön</span>}
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/tr/login' })}
                        className="w-full flex items-center gap-4 px-4 py-4 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-2xl transition-all font-bold text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span>Güvenli Çıkış</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0f1d]/50 backdrop-blur-xl sticky top-0 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-xl text-gray-400 transition-colors"
                    >
                        <BarChart3 className="w-6 h-6 rotate-90" />
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-black text-white tracking-wide uppercase">{session?.user?.name || 'Sistem Yöneticisi'}</span>
                            <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">Full Access Admin</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-black text-white shadow-lg border border-white/10">
                            {session?.user?.name?.[0] || 'A'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
