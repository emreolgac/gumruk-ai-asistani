'use client';

import { useState, useEffect } from 'react';
import {
    FileSearch,
    History,
    CreditCard,
    User,
    Settings,
    HelpCircle,
    LogOut,
    Upload,
    Download,
    Search,
    Bell,
    Plus,
    FileText,
    TrendingUp,
    ShieldCheck,
    Zap,
    ArrowRight,
    ExternalLink,
    ChevronRight,
    Clock,
    MoreHorizontal,
    Mail,
    Smartphone,
    CheckCircle2,
    XCircle,
    Link as LinkIcon,
    RefreshCw
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardData {
    user: any;
    history: any[];
    payments: any[];
    banners: { horizontal: any[]; vertical: any[] };
    stats: { totalUploads: number; totalSpend: number };
}

export default function UserDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/user/dashboard-data').catch(() => {
                    throw new Error('NETWORK_ERROR');
                });

                if (res.status === 401) {
                    router.push('/tr/login');
                    return;
                }

                if (!res.ok) {
                    throw new Error(`SERVER_ERROR_${res.status}`);
                }

                const resData = await res.json();
                setData(resData);
            } catch (err: any) {
                console.error('Dash error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    if (loading || !data || !data.user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Veriler Getiriliyor...</p>
            </div>
        );
    }

    const handleLogout = () => signOut({ callbackUrl: '/tr' });

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex overflow-hidden">

            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-slate-100 flex flex-col shrink-0 hidden lg:flex">
                <div className="p-8 border-b border-slate-50">
                    <Link href="/tr" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <FileSearch className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-800">GÜMRÜK.AI</span>
                    </Link>
                </div>

                <div className="p-6 flex-1 space-y-2">
                    <SidebarLink icon={<FileSearch className="w-5 h-5" />} label="Genel Bakış" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarLink icon={<History className="w-5 h-5" />} label="İşlem Geçmişi" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                    <SidebarLink icon={<CreditCard className="w-5 h-5" />} label="Ödemelerim" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
                    <SidebarLink icon={<Settings className="w-5 h-5" />} label="Profil Ayarları" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />

                    <div className="pt-8 pb-4">
                        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Destek Merkezi</p>
                        <SidebarLink icon={<HelpCircle className="w-5 h-5" />} label="Yardım Al" onClick={() => router.push('/tr/contact')} />
                        <SidebarLink icon={<Mail className="w-5 h-5" />} label="Bize Yazın" onClick={() => router.push('/tr/contact')} />
                    </div>
                </div>

                <div className="p-6 border-t border-slate-50">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-2xl font-bold transition-all">
                        <LogOut className="w-5 h-5" />
                        Oturumu Kapat
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen custom-scrollbar">

                {/* Top Header */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 lg:hidden">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <FileSearch className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 max-w-lg flex-1 mx-8 hidden sm:flex">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="İşlem numarası veya dosya adı ara..." className="bg-transparent border-none outline-none text-xs font-bold w-full" />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end hidden md:flex">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kredi Bakiyesi</span>
                            <span className="text-sm font-black text-blue-600 flex items-center gap-2">
                                <Zap className="w-4 h-4 fill-blue-600" />
                                {data.user.credits} KREDİ
                            </span>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                            {data.user.image ? <img src={data.user.image} alt="" /> : <div className="w-full h-full flex items-center justify-center font-black text-slate-400">{data.user.name[0]}</div>}
                        </div>
                    </div>
                </header>

                {/* Dashboard Body */}
                <div className="p-8 space-y-10">

                    {/* Horizontal Ads / Banners */}
                    {data.banners.horizontal.length > 0 && (
                        <div className="space-y-4">
                            {data.banners.horizontal.map((banner: any) => (
                                <a key={banner.id} href={banner.link || '#'} className="block group relative h-32 lg:h-48 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100">
                                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-12">
                                        <h3 className="text-white text-2xl font-black mb-2">{banner.title}</h3>
                                        {banner.link && <span className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">Şimdi İncele <ArrowRight className="w-4 h-4" /></span>}
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 space-y-10">

                                {/* Stats Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <SimpleStat label="TOPLAM YÜKLEME" value={data.stats.totalUploads} icon={<Upload className="w-5 h-5 text-blue-600" />} />
                                    <SimpleStat label="KALAN KREDİ" value={data.user.credits} icon={<Zap className="w-5 h-5 text-orange-500" />} />
                                    <SimpleStat label="HARCANAN TUTAR" value={`${data.stats.totalSpend} ₺`} icon={<TrendingUp className="w-5 h-5 text-green-600" />} />
                                </div>

                                {/* Upload Area */}
                                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                                    <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-blue-600/[0.03] blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-8">
                                            <Upload className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-800 mb-2">Yeni Beyanname Oluştur</h2>
                                        <p className="text-slate-400 font-medium mb-12">Belgelerinizi yükleyin, yapay zeka sizin için saniyeler içinde analiz etsin.</p>
                                        <button onClick={() => router.push('/tr/dashboard/new')} className="px-12 py-5 bg-blue-600 hover:bg-black text-white rounded-[2rem] font-black transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-3">
                                            DOSYALARI SEÇİN
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Recent History */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-4">
                                        <h3 className="text-xl font-black text-slate-800">Son İşlemler</h3>
                                        <button onClick={() => setActiveTab('history')} className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">TÜMÜNÜ GÖR</button>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-sm">
                                        {data.history.length > 0 ? data.history.map((h: any) => (
                                            <HistoryRow key={h.id} declaration={h} />
                                        )) : <div className="p-12 text-center text-slate-400 font-bold">Henüz işlem yok.</div>}
                                    </div>
                                </div>

                            </div>

                            <div className="space-y-10">

                                {/* Vertical Ads Slots */}
                                <div className="space-y-8">
                                    {data.banners.vertical.map((banner: any) => (
                                        <a key={banner.id} href={banner.link || '#'} className="block h-96 group relative overflow-hidden rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                                            <img src={banner.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                                                <h4 className="text-white text-xl font-black mb-4">{banner.title}</h4>
                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                                                    <ChevronRight className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                    {data.banners.vertical.length === 0 && (
                                        <div className="bg-blue-600 text-white p-10 rounded-[3rem] shadow-xl shadow-blue-600/20 relative overflow-hidden group">
                                            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                                            <div className="relative z-10 flex flex-col items-start gap-8">
                                                <Zap className="w-12 h-12 fill-white/20 text-white" />
                                                <h3 className="text-2xl font-black">Paketinizi <br />Yükseltin</h3>
                                                <p className="text-blue-100/60 font-medium text-sm leading-relaxed">Daha fazla kredi ve öncelikli işlem hızı için Pro pakete geçin.</p>
                                                <button onClick={() => router.push('/tr#pricing')} className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase transition-all shadow-xl hover:scale-105 active:scale-95">İncele</button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Quick Links / Support Box */}
                                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Hızlı Erişim</h4>
                                    <div className="space-y-4">
                                        <QuickLink icon={<ShieldCheck className="w-5 h-5 text-green-500" />} label="Hesap Güvenliği" />
                                        <QuickLink icon={<LinkIcon className="w-5 h-5 text-blue-500" />} label="API Bağlantısı" />
                                        <QuickLink icon={<Mail className="w-5 h-5 text-purple-500" />} label="Özel Destek" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-slate-800">Tüm İşlem Geçmişi</h3>
                            <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-sm">
                                {data.history.map((h: any) => (
                                    <HistoryRow key={h.id} declaration={h} detailed />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-slate-800">Ödeme Kayıtları</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.payments.map((p: any) => (
                                    <PaymentCard key={p.id} payment={p} />
                                ))}
                                {data.payments.length === 0 && <div className="lg:col-span-3 p-24 text-center text-slate-400 font-bold border-4 border-dashed rounded-[3rem]">Henüz bir ödeme kaydı bulunmuyor.</div>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-3xl space-y-10">
                            <h3 className="text-2xl font-black text-slate-800">Profil Ayarları</h3>
                            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 space-y-10">
                                <div className="flex items-center gap-10">
                                    <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
                                        {data.user.image ? <img src={data.user.image} alt="" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-slate-300" />}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-2xl font-black text-slate-800">{data.user.name}</p>
                                        <p className="text-slate-400 font-bold flex items-center gap-2"><Mail className="w-4 h-4" /> {data.user.email}</p>
                                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black uppercase tracking-widest">{data.user.role}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-50">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ad Soyad</label>
                                        <input type="text" defaultValue={data.user.name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-posta</label>
                                        <input type="email" disabled defaultValue={data.user.email} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-400 font-bold" />
                                    </div>
                                </div>
                                <button className="px-12 py-5 bg-slate-900 hover:bg-black text-white rounded-[2rem] font-black transition-all">DEĞİŞİKLİKLERİ KAYDET</button>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

function SidebarLink({ icon, label, active, onClick }: any) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm tracking-tight transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 translate-x-1' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}>
            {icon}
            {label}
        </button>
    );
}

function SimpleStat({ label, value, icon }: any) {
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-xl font-black text-slate-800">{value}</p>
            </div>
        </div>
    );
}

function HistoryRow({ declaration, detailed }: any) {
    const isCompleted = declaration.status === 'COMPLETED';
    return (
        <div className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
            <div className="flex items-center gap-6 min-w-0">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                    <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-black text-slate-800 truncate mb-1">
                        {declaration.type || 'Bilinmeyen Belge'}
                        <span className="text-[10px] text-slate-300 font-bold ml-3">#{declaration.id.slice(-6)}</span>
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(declaration.createdAt).toLocaleDateString()}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${isCompleted ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                            {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <RefreshCw className="w-3 h-3 animate-spin" />}
                            {declaration.status === 'COMPLETED' ? 'TAMAMLANDI' : 'İŞLENİYOR'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {isCompleted && (
                    <button title="Çıktı Al" className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm">
                        <Download className="w-5 h-5" />
                    </button>
                )}
                <button className="p-3 text-slate-300 hover:text-slate-600 transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

function PaymentCard({ payment }: any) {
    const isFailed = payment.status !== 'COMPLETED';
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-4 right-4 h-2 w-2 rounded-full animate-pulse bg-green-500" />
            <div className="flex items-center justify-between mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl">
                    <CreditCard className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-2xl font-black text-slate-800">{payment.amount} ₺</p>
            </div>
            <div className="space-y-1 mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">İŞLEM NUMARASI</p>
                <p className="text-xs font-bold text-slate-800 font-mono">{payment.id}</p>
            </div>
            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">{new Date(payment.createdAt).toLocaleDateString()}</span>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${isFailed ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                    {payment.status}
                </span>
            </div>
        </div>
    );
}

function QuickLink({ icon, label }: any) {
    return (
        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-4">
                {icon}
                <span className="text-sm font-bold text-slate-600">{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-all" />
        </button>
    );
}
