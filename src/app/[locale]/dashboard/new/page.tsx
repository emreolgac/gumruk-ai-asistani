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
    Search,
    Zap,
    ArrowLeft,
    Mail,
    AlertCircle
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UploadZone from '@/components/UploadZone';
import DeclarationViewer from '@/components/DeclarationViewer';

interface DashboardData {
    user: any;
    banners: { horizontal: any[]; vertical: any[] };
}

export default function NewDeclarationPage() {
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    // Error states
    const [error, setError] = useState<string | null>(null);
    const [errorDetails, setErrorDetails] = useState<string | null>(null);
    const [errorHint, setErrorHint] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/user/dashboard-data');
                if (res.status === 401) {
                    router.push('/tr/login');
                    return;
                }
                const resData = await res.json();
                setData(resData);
            } catch (err) {
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
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Yükleniyor...</p>
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
                    <SidebarLink icon={<FileSearch className="w-5 h-5" />} label="Genel Bakış" onClick={() => router.push('/tr/dashboard')} />
                    <SidebarLink icon={<History className="w-5 h-5" />} label="İşlem Geçmişi" onClick={() => router.push('/tr/dashboard')} />
                    <SidebarLink icon={<CreditCard className="w-5 h-5" />} label="Ödemelerim" onClick={() => router.push('/tr/dashboard')} />
                    <SidebarLink icon={<Settings className="w-5 h-5" />} label="Profil Ayarları" onClick={() => router.push('/tr/dashboard')} />
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
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors font-bold text-sm">
                        <ArrowLeft className="w-5 h-5" />
                        Geri Dön
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end hidden md:flex">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kredi Bakiyesi</span>
                            <span className="text-sm font-black text-blue-600 flex items-center gap-2">
                                <Zap className="w-4 h-4 fill-blue-600" />
                                {data.user.credits} KREDİ
                            </span>
                        </div>
                    </div>
                </header>

                <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Yeni Beyanname Analizi</h1>
                        <p className="text-slate-500 font-medium">Belgelerinizi yükleyerek yapay zeka destekli analizi başlatın.</p>
                    </div>

                    <div className="bg-white p-8 lg:p-12 rounded-[3.5rem] shadow-sm border border-slate-100">
                        {error && (
                            <div className="mb-8 space-y-4">
                                <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                                            <AlertCircle className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-black text-lg leading-tight">{error}</p>
                                            {errorDetails && <p className="text-sm font-medium opacity-80">{errorDetails}</p>}
                                        </div>
                                    </div>
                                    {errorHint && (
                                        <div className="mt-4 p-4 bg-white/50 rounded-2xl border border-red-200/50 text-[13px] font-bold text-red-800 flex items-center gap-3">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                            {errorHint}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {!analysisResult ? (
                            <UploadZone
                                onAnalysisStart={() => {
                                    setLoading(true);
                                    setError(null);
                                    setErrorDetails(null);
                                    setErrorHint(null);
                                }}
                                onAnalysisComplete={(result) => {
                                    setAnalysisResult(result);
                                    setLoading(false);
                                }}
                                onError={(err, details, hint) => {
                                    setError(err);
                                    setErrorDetails(details || null);
                                    setErrorHint(hint || null);
                                    setLoading(false);
                                }}
                            />
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <DeclarationViewer data={analysisResult} />
                                <div className="mt-8 text-center">
                                    <button onClick={() => setAnalysisResult(null)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all">
                                        Yeni Analiz Yap
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ icon, label, onClick }: any) {
    return (
        <button onClick={onClick} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm tracking-tight transition-all text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            {icon}
            {label}
        </button>
    );
}
