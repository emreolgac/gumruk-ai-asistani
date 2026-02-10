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
            <aside className="w-80 bg-[#0f172a] flex flex-col shrink-0 hidden lg:flex border-r border-slate-800">
                <div className="p-8 border-b border-white/5">
                    <Link href="/tr" className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 transform hover:rotate-6 transition-transform">
                            <FileSearch className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter text-white leading-none">GÜMRÜK.AI</span>
                            <span className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest mt-1">Smart Logistics</span>
                        </div>
                    </Link>
                </div>

                <div className="p-6 flex-1 space-y-3">
                    <SidebarLink icon={<FileSearch className="w-5 h-5" />} label="Genel Bakış" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarLink icon={<History className="w-5 h-5" />} label="İşlem Geçmişi" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                    <SidebarLink icon={<CreditCard className="w-5 h-5" />} label="Ödemelerim" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
                    <SidebarLink icon={<Settings className="w-5 h-5" />} label="Profil Ayarları" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />

                    <div className="pt-8 pb-4">
                        <p className="px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 px-4">Destek Merkezi</p>
                        <SidebarLink icon={<HelpCircle className="w-5 h-5" />} label="Yardım Al" onClick={() => router.push('/tr/contact')} />
                        <SidebarLink icon={<Mail className="w-5 h-5" />} label="Bize Yazın" onClick={() => router.push('/tr/contact')} />
                    </div>
                </div>

                <div className="p-6 border-t border-white/5">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-2xl font-black transition-all group">
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Oturumu Kapat
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen custom-scrollbar">

                {/* Top Header */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3 bg-slate-100/50 px-6 py-3 rounded-2xl border border-slate-200/50 max-w-lg flex-1 hidden sm:flex focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-500/50 transition-all">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="İşlem veya dosya ara..." className="bg-transparent border-none outline-none text-sm font-bold w-full text-slate-700 placeholder:text-slate-400" />
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex flex-col items-end hidden md:flex">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Kullanılabilir Bakiye</span>
                            <span className="text-lg font-black text-slate-900 flex items-center gap-2 leading-none">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                {data.user.credits} <span className="text-blue-600">KREDİ</span>
                            </span>
                        </div>
                        <div className="w-12 h-12 bg-white border-2 border-slate-100 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 flex items-center justify-center group cursor-pointer hover:border-blue-500 transition-all">
                            {data.user.image ? (
                                <img src={data.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-slate-400 bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all uppercase">
                                    {data.user.name?.[0]}
                                </div>
                            )}
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
                                    <SimpleStat label="KALAN KREDİ" value={data.user.credits} icon={<Zap className="w-5 h-5 text-indigo-500" />} />
                                    <SimpleStat label="HARCANAN TUTAR" value={`${data.stats.totalSpend} ₺`} icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} />
                                </div>

                                {/* Upload Area */}
                                <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-blue-600/10 transition-all duration-1000" />
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full -ml-32 -mb-32 blur-3xl group-hover:bg-indigo-600/10 transition-all duration-1000" />

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                            <Upload className="w-10 h-10 text-blue-600" />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Yeni Analiz <span className="text-blue-600">Başlat</span></h2>
                                        <p className="text-slate-500 font-medium mb-12 max-w-lg text-lg">Belgelerinizi yükleyin, yapay zeka motorumuz saniyeler içinde GTİP ve beyanname taslağınızı hazırlasın.</p>
                                        <button onClick={() => router.push('/tr/dashboard/new')} className="px-14 py-6 bg-slate-900 hover:bg-blue-600 text-white rounded-[2rem] font-black transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-4 text-lg">
                                            İşlemi Başlat
                                            <ArrowRight className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Recent History */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-6">
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Son İşlemler</h3>
                                        <button onClick={() => setActiveTab('history')} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline px-4 py-2 bg-blue-50 rounded-xl transition-all">Tümünü Gör</button>
                                    </div>
                                    <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-sm hover:shadow-xl transition-shadow">
                                        {data.history.length > 0 ? data.history.map((h: any) => (
                                            <HistoryRow key={h.id} declaration={h} />
                                        )) : (
                                            <div className="p-20 text-center">
                                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                                                    <History className="w-10 h-10" />
                                                </div>
                                                <p className="text-slate-400 font-black text-sm uppercase tracking-widest">Henüz bir işleminiz bulunmuyor.</p>
                                            </div>
                                        )}
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
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Tüm İşlem <span className="text-blue-600">Geçmişi</span></h3>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 text-sm font-bold text-slate-500 cursor-pointer hover:bg-slate-50 transition-all">
                                        <Clock className="w-4 h-4" />
                                        Filtrele
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-sm hover:shadow-xl transition-all">
                                {data.history.length > 0 ? data.history.map((h: any) => (
                                    <HistoryRow key={h.id} declaration={h} detailed />
                                )) : (
                                    <div className="p-32 text-center">
                                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-200">
                                            <History className="w-12 h-12" />
                                        </div>
                                        <p className="text-slate-400 font-black text-sm uppercase tracking-widest">Henüz bir işlem kaydınız bulunmuyor.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Ödeme <span className="text-blue-600">Kayıtları</span></h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {data.payments.map((p: any) => (
                                    <PaymentCard key={p.id} payment={p} />
                                ))}
                                {data.payments.length === 0 && (
                                    <div className="lg:col-span-3 p-32 text-center text-slate-300 font-black border-4 border-dashed rounded-[3.5rem] border-slate-100 uppercase tracking-widest text-sm bg-slate-50/30">
                                        Henüz bir ödeme kaydı bulunmuyor.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Profil <span className="text-blue-600">Ayarları</span></h3>
                            </div>

                            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

                                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                                    <div className="relative group">
                                        <div className="w-40 h-40 bg-slate-50 rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center p-1">
                                            {data.user.image ? (
                                                <img src={data.user.image} alt="" className="w-full h-full object-cover rounded-[2.5rem]" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-black text-slate-300 text-4xl bg-white rounded-[2.5rem]">
                                                    {data.user.name?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/40 hover:scale-110 active:scale-95 transition-all">
                                            <Settings className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="text-center md:text-left space-y-3">
                                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{data.user.name}</p>
                                        <p className="text-slate-500 font-bold flex items-center justify-center md:justify-start gap-2 max-md:text-sm">
                                            <Mail className="w-4 h-4 text-blue-500" /> {data.user.email}
                                        </p>
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <span className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">{data.user.role}</span>
                                            {data.user.isPremium && <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">PREMIUM</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-12 border-t border-slate-50">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Ad Soyad</label>
                                        <input type="text" defaultValue={data.user.name} className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-5 outline-none font-bold text-slate-700 focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">E-posta Adresi</label>
                                        <input type="email" disabled defaultValue={data.user.email} className="w-full bg-slate-100/50 border-2 border-slate-100 rounded-[2rem] px-8 py-5 text-slate-400 font-bold cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Telefon</label>
                                        <input type="text" placeholder="+90 (___) ___ __ __" className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-5 outline-none font-bold text-slate-700 focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Şirket Adı</label>
                                        <input type="text" placeholder="Gümrük Müşavirliği Ltd. Şti." className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-5 outline-none font-bold text-slate-700 focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button className="px-14 py-6 bg-slate-900 hover:bg-black text-white rounded-[2rem] font-black transition-all shadow-xl shadow-slate-900/10 active:scale-95 text-sm uppercase tracking-widest">
                                        Değişiklikleri Uygula
                                    </button>
                                </div>
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
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm tracking-tight transition-all ${active
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 translate-x-1'
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function SimpleStat({ label, value, icon }: any) {
    return (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-8 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
            <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-500">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">{label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
            </div>
        </div>
    );
}

function HistoryRow({ declaration, detailed }: any) {
    const isCompleted = declaration.status === 'COMPLETED';
    return (
        <div className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
            <div className="flex items-center gap-8 min-w-0">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50/50 transition-all">
                    <FileText className="w-7 h-7 text-slate-400 group-hover:text-blue-500" />
                </div>
                <div className="min-w-0">
                    <p className="text-lg font-black text-slate-800 truncate mb-1.5 tracking-tight group-hover:text-blue-600 transition-colors">
                        {declaration.fileName?.split(',')[0] || 'İsimsiz Analiz'}
                        <span className="text-xs text-slate-300 font-bold ml-4 opacity-50 font-mono">#{declaration.id.slice(-6).toUpperCase()}</span>
                    </p>
                    <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(declaration.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                            {declaration.status === 'COMPLETED' ? 'TAMAMLANDI' : 'İŞLENİYOR'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {isCompleted && (
                    <button title="Çıktı Al" className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-2xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                        <Download className="w-5 h-5" />
                    </button>
                )}
                <button className="w-12 h-12 flex items-center justify-center text-slate-200 hover:text-slate-600 transition-all">
                    <MoreHorizontal className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

function PaymentCard({ payment }: any) {
    const isFailed = payment.status !== 'COMPLETED';
    return (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
            <div className={`absolute top-0 right-0 w-2 h-full ${isFailed ? 'bg-red-500' : 'bg-emerald-500'} opacity-50`} />
            <div className="flex items-center justify-between mb-10">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-blue-50 transition-all duration-500">
                    <CreditCard className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-all" />
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">TUTAR</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{payment.amount} ₺</p>
                </div>
            </div>
            <div className="space-y-4 mb-10 relative z-10">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-50">İŞLEM NO</p>
                    <p className="text-xs font-bold text-slate-600 font-mono tracking-tighter truncate bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">{payment.id}</p>
                </div>
            </div>
            <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 flex items-center gap-2 group-hover:text-slate-600 transition-colors">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(payment.createdAt).toLocaleDateString()}
                </span>
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl shadow-sm ${isFailed ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {payment.status === 'COMPLETED' ? 'BAŞARILI' : 'BAŞARISIZ'}
                </span>
            </div>
        </div>
    );
}

function QuickLink({ icon, label }: any) {
    return (
        <button className="w-full flex items-center justify-between p-6 hover:bg-blue-50/50 rounded-[2rem] transition-all group border-2 border-transparent hover:border-blue-100/50">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all">
                    {icon}
                </div>
                <span className="text-sm font-black text-slate-700 group-hover:text-blue-600 transition-all uppercase tracking-tight">{label}</span>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                <ChevronRight className="w-5 h-5" />
            </div>
        </button>
    );
}
