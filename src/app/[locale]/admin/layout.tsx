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
    ShieldCheck,
    FileText,
    BookOpen,
    Link2,
    Menu,
    X,
    CreditCard as POSIcon,
    Trash2,
    Image as ImageIcon
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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-900/10 border-t-blue-900 rounded-full animate-spin" />
                    <ShieldCheck className="w-6 h-6 text-blue-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
            </div>
        );
    }

    const menuItems = [
        { href: '/tr/admin', label: 'Genel Bakış', icon: <LayoutDashboard className="w-5 h-5" /> },
        { href: '/tr/admin/users', label: 'Kullanıcılar', icon: <Users className="w-5 h-5" /> },
        { href: '/tr/admin/payments', label: 'Ödemeler', icon: <CreditCard className="w-5 h-5" /> },
        { href: '/tr/admin/pos-settings', label: 'Sanal POS Ayarları', icon: <POSIcon className="w-5 h-5" /> },
        { href: '/tr/admin/api-usage', label: 'API Kullanımı', icon: <Bot className="w-5 h-5" /> },
        { href: '/tr/admin/pages', label: 'Sayfalar', icon: <FileText className="w-5 h-5" /> },
        { href: '/tr/admin/banners', label: 'Banner Yönetimi', icon: <ImageIcon className="w-5 h-5" /> },
        { href: '/tr/admin/social', label: 'Sosyal Medya', icon: <Link2 className="w-5 h-5" /> },
        { href: '/tr/admin/blogs', label: 'Blog Yönetimi', icon: <BookOpen className="w-5 h-5" /> },
        { href: '/tr/admin/logs', label: 'Sistem Logları', icon: <Terminal className="w-5 h-5" /> },
        { href: '/tr/admin/pricing', label: 'Fiyatlandırma', icon: <CreditCard className="w-5 h-5" /> },
        { href: '/tr/admin/settings', label: 'Sistem Ayarları', icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen bg-[#f0f2f5] text-[#334155] flex font-sans overflow-hidden">
            {/* Sidebar - Matching the Image */}
            <aside className={`fixed lg:relative z-50 transition-all duration-300 ease-in-out bg-[#1e2b4d] ${isSidebarOpen ? 'w-80' : 'w-0 lg:w-20'} h-screen flex flex-col shadow-2xl`}>
                <div className="p-8 flex flex-col items-center">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full border-4 border-[#2c3e66] bg-[#2c3e66] flex items-center justify-center overflow-hidden shadow-xl ring-4 ring-blue-500/10">
                            <div className="w-full h-full flex items-center justify-center bg-white/20">
                                <Users className="w-12 h-12 text-white opacity-80" />
                            </div>
                            {session?.user?.image && <img src={session.user.image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
                        </div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-[#1e2b4d] rounded-full"></div>
                    </div>

                    {isSidebarOpen && (
                        <div className="text-center animate-in fade-in duration-500">
                            <h2 className="text-xl font-bold text-white uppercase tracking-wider">{session?.user?.name || 'ADMIN NAME'}</h2>
                            <p className="text-blue-400/60 text-xs font-medium mt-1">{session?.user?.email}</p>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-6 mt-4 space-y-1 overflow-y-auto custom-scrollbar pb-8">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-blue-600/10 text-white font-bold border-l-4 border-blue-500'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className={`transition-transform duration-200 ${isActive ? 'scale-110 text-blue-400' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </div>
                                {isSidebarOpen && <span className="text-sm tracking-wide">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className={`p-6 border-t border-white/5 ${isSidebarOpen ? '' : 'hidden lg:block'}`}>
                    <Link
                        href="/tr/dashboard"
                        className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group mb-2"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        {isSidebarOpen && <span className="font-bold text-sm leading-none">Siteye Git</span>}
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/tr/login' })}
                        className="w-full flex items-center gap-4 px-4 py-3 text-red-400/60 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all font-bold text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span>Çıkış Yap</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        <h3 className="text-lg font-bold text-slate-800 hidden md:block">
                            {menuItems.find(i => pathname === i.href)?.label || 'Yönetim Paneli'}
                        </h3>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="sm:flex items-center gap-3 pr-4 border-r border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Bot className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:block">Sistem Durumu: Aktif</span>
                        </div>
                        <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                            <ShieldCheck className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-[#f0f2f5] custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
        </div>
    );
}
