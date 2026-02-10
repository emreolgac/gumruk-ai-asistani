'use client';

import { useState, useEffect } from 'react';
import {
    FileSearch,
    History,
    CreditCard,
    Settings,
    LogOut,
    Zap,
    ArrowLeft,
    AlertCircle,
    Send,
    FileText,
    Sparkles,
    CheckCircle2
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
    const [loadingData, setLoadingData] = useState(true);

    // Analysis State
    const [files, setFiles] = useState<File[]>([]);
    const [regime, setRegime] = useState<'ithalat' | 'ihracat' | 'transit'>('ithalat');
    const [userInstructions, setUserInstructions] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
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
                setLoadingData(false);
            }
        };
        fetchData();
    }, [router]);

    const handleAnalyze = async () => {
        if (files.length === 0) return;

        setIsAnalyzing(true);
        setError(null);
        setErrorDetails(null);
        setErrorHint(null);

        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append('regime', regime);
        if (userInstructions.trim()) {
            formData.append('userInstructions', userInstructions);
        }

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            const resData = await response.json();

            if (!response.ok) {
                setError(resData.error || 'Analiz hatası');
                setErrorDetails(resData.details);
                setErrorHint(resData.hint);
                setIsAnalyzing(false);
                return;
            }

            // Success simulation for UX
            setTimeout(() => {
                setAnalysisResult(resData.result);
                setIsAnalyzing(false);
                setFiles([]);
                setUserInstructions('');
            }, 1000);

        } catch (err) {
            console.error(err);
            setError('Bağlantı hatası oluştu.');
            setIsAnalyzing(false);
        }
    };

    const handleLogout = () => signOut({ callbackUrl: '/tr' });

    if (loadingData || !data || !data.user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex overflow-hidden font-sans">
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
                    <SidebarLink icon={<FileSearch className="w-5 h-5" />} label="Genel Bakış" onClick={() => router.push('/tr/dashboard')} active />
                    <SidebarLink icon={<History className="w-5 h-5" />} label="İşlem Geçmişi" onClick={() => router.push('/tr/dashboard')} />
                    <SidebarLink icon={<CreditCard className="w-5 h-5" />} label="Ödemelerim" onClick={() => router.push('/tr/dashboard')} />
                    <SidebarLink icon={<Settings className="w-5 h-5" />} label="Profil Ayarları" onClick={() => router.push('/tr/dashboard')} />
                </div>

                <div className="p-6 border-t border-white/5">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-2xl font-black transition-all group">
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Oturumu Kapat
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen custom-scrollbar bg-[#f8fafc]">
                {/* Top Header */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex items-center justify-between shadow-sm">
                    <button onClick={() => router.back()} className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest">
                        <ArrowLeft className="w-5 h-5" />
                        Geri Dön
                    </button>

                    <div className="flex items-center gap-8">
                        <div className="flex flex-col items-end hidden md:flex">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kullanılabilir Bakiye</span>
                            <span className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                {data.user.credits} <span className="text-blue-600">KREDİ</span>
                            </span>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                            {data.user.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="p-8 lg:p-12 max-w-7xl mx-auto">
                    {!analysisResult ? (
                        <>
                            <div className="mb-12">
                                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
                                    Yeni Analiz <span className="text-blue-600">Başlat</span>
                                </h1>
                                <p className="text-lg text-slate-500 font-medium max-w-2xl">
                                    Dokümanlarınızı yükleyin ve yapay zeka destekli analiz motorumuzun saniyeler içinde GTİP ve beyanname taslağını oluşturmasını izleyin.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Left Column: Steps */}
                                <div className="lg:col-span-8 space-y-10">
                                    {/* Step 0 */}
                                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative group transition-all hover:shadow-xl hover:shadow-slate-200/50">
                                        <div className="absolute top-10 left-10 bg-blue-600 text-white font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                            Adım 0: İşlem Türü
                                        </div>

                                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            <RegimeButton
                                                active={regime === 'ithalat'}
                                                onClick={() => setRegime('ithalat')}
                                                icon={<div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📥</div>}
                                                label="İthalat"
                                                description="Giriş İşlemleri"
                                            />
                                            <RegimeButton
                                                active={regime === 'ihracat'}
                                                onClick={() => setRegime('ihracat')}
                                                icon={<div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl">📤</div>}
                                                label="İhracat"
                                                description="Çıkış İşlemleri"
                                            />
                                            <RegimeButton
                                                active={regime === 'transit'}
                                                onClick={() => setRegime('transit')}
                                                icon={<div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl">🚛</div>}
                                                label="Transit"
                                                description="Aktarma İşlemleri"
                                            />
                                        </div>
                                    </div>

                                    {/* Step 1 */}
                                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative group transition-all hover:shadow-xl hover:shadow-slate-200/50">
                                        <div className="absolute top-10 left-10 bg-indigo-600 text-white font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest">
                                            Adım 1: Belge Kontrolü
                                        </div>

                                        <div className="mt-16">
                                            <UploadZone
                                                files={files}
                                                onFilesChange={setFiles}
                                            />
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative group transition-all hover:shadow-xl hover:shadow-slate-200/50">
                                        <div className="absolute top-10 left-10 bg-purple-600 text-white font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest">
                                            Adım 2: Teknik Talimatlar
                                        </div>

                                        <div className="mt-16 space-y-4">
                                            <label className="block text-slate-800 font-black text-sm ml-2 uppercase tracking-wide">
                                                Özel Notlar veya GTİP Tercihleri
                                            </label>
                                            <div className="relative group">
                                                <textarea
                                                    value={userInstructions}
                                                    onChange={(e) => setUserInstructions(e.target.value)}
                                                    placeholder="Örn: 'Bu ürün için 84. fasıl kuralları uygulansın' veya 'A.TR belgesi mevcuttur.'"
                                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-[2rem] p-8 h-48 resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 text-lg shadow-inner"
                                                />
                                                <div className="absolute bottom-6 right-8 bg-blue-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                                    AI Modu Aktif
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Summary */}
                                <div className="lg:col-span-4">
                                    <div className="sticky top-32">
                                        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                                            {/* Decorative circles */}
                                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
                                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl transition-all duration-1000 group-hover:bg-indigo-600/20" />

                                            <div className="relative z-10">
                                                <h3 className="text-3xl font-black mb-8 tracking-tight">Analiz <span className="text-blue-400">Raporu</span></h3>

                                                <div className="space-y-6 mb-10">
                                                    <SummaryItem label="İşlem Türü" value={regime} highlight />
                                                    <SummaryItem label="Belge Sayısı" value={`${files.length} Dosya`} icon={<FileText className="w-4 h-4 text-blue-400" />} />
                                                    <SummaryItem label="Özel Talimat" value={userInstructions ? 'Aktif' : 'Yok'} />
                                                    <SummaryItem label="İşlem Hızı" value="Ultra / ~30sn" icon={<Zap className="w-4 h-4 text-yellow-400 animate-pulse" />} />
                                                </div>

                                                <button
                                                    onClick={handleAnalyze}
                                                    disabled={files.length === 0 || isAnalyzing}
                                                    className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-500/20 active:scale-95 group"
                                                >
                                                    {isAnalyzing ? (
                                                        <>
                                                            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                                            İŞLENİYOR...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                                            ANALİZİ BAŞLAT
                                                        </>
                                                    )}
                                                </button>

                                                {error && (
                                                    <div className="mt-8 p-5 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 text-sm font-bold flex items-start gap-4">
                                                        <AlertCircle className="w-6 h-6 shrink-0" />
                                                        <div>
                                                            <p className="uppercase text-[10px] tracking-widest mb-1 opacity-50">Sistem Hatası</p>
                                                            <p className="leading-tight">{error}</p>
                                                            {errorHint && <p className="text-xs mt-2 text-white/40 font-normal leading-relaxed">{errorHint}</p>}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-8 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100/50 text-blue-900/60 text-xs font-bold leading-relaxed flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">💡</div>
                                            <p>Analiz başlatılmadan önce belgelerin net bir şekilde okunaklı olduğundan emin olun.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">Rapor <span className="text-blue-600">Hazır!</span></h2>
                                    <p className="text-slate-500 font-medium text-lg">Yapay zeka gümrük beyanname taslağını başarıyla oluşturdu.</p>
                                </div>
                                <button
                                    onClick={() => setAnalysisResult(null)}
                                    className="px-10 py-5 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-[2rem] font-black transition-all text-sm uppercase tracking-widest hover:scale-105 active:scale-95 shadow-lg shadow-slate-200"
                                >
                                    Yeni Analiz Başlat
                                </button>
                            </div>

                            <DeclarationViewer data={analysisResult} />
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

function SummaryItem({ label, value, icon, highlight = false }: any) {
    return (
        <div className="flex items-center justify-between border-b border-white/5 pb-5">
            <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">{label}</span>
            <span className={`font-black flex items-center gap-2 ${highlight ? 'text-blue-400' : 'text-slate-100'}`}>
                {icon}
                {value}
            </span>
        </div>
    );
}

function RegimeButton({ active, onClick, icon, label, description }: any) {
    return (
        <button
            onClick={onClick}
            className={`p-8 rounded-[2.5rem] border-2 transition-all text-left space-y-4 relative overflow-hidden group ${active
                ? 'border-blue-500 bg-blue-50/50 shadow-xl shadow-blue-500/10'
                : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-lg'
                }`}
        >
            {active && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12" />
            )}
            {icon}
            <div>
                <p className={`text-xl font-black tracking-tighter ${active ? 'text-blue-700' : 'text-slate-800'}`}>{label}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{description}</p>
            </div>
            {active && (
                <div className="absolute bottom-6 right-8">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
            )}
        </button>
    );
}

function SidebarLink({ icon, label, onClick, active = false }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm tracking-tight transition-all ${active
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
        >
            {icon}
            {label}
        </button>
    );
}
