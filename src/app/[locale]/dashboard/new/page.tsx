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

                <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-8">

                    {!analysisResult ? (
                        <>
                            <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
                                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                                    Yeni Beyanname Analizi
                                </h1>
                                <p className="text-lg text-slate-500 font-medium">
                                    Belgelerinizi yükleyin, açıklamalarınızı ekleyin ve yapay zeka destekli Gümrük Müşaviriniz analiz etsin.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Column: Upload & Input */}
                                <div className="lg:col-span-8 space-y-6">
                                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">

                                        {/* Step 1 Badge */}
                                        <div className="absolute top-8 left-8 bg-blue-50 text-blue-700 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wide">Adım 1: Belge Yükle</div>

                                        <div className="mt-8">
                                            <UploadZone
                                                files={files}
                                                onFilesChange={setFiles}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
                                        {/* Step 2 Badge */}
                                        <div className="absolute top-8 left-8 bg-purple-50 text-purple-700 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wide">Adım 2: Müşteri Talimatları</div>

                                        <div className="mt-10 space-y-4">
                                            <label className="block text-slate-700 font-bold ml-2">
                                                Ek Açıklamalar / GTİP Talimatları <span className="text-slate-400 font-normal">(Opsiyonel)</span>
                                            </label>
                                            <div className="relative">
                                                <textarea
                                                    value={userInstructions}
                                                    onChange={(e) => setUserInstructions(e.target.value)}
                                                    placeholder="Örn: 'Bu ürün için 8481.80.99.00.00 GTİP kodunu kullanın.' veya 'Özel matrah uygulansın.'"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 h-40 resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                                />
                                                <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full border border-slate-100 text-xs font-bold text-slate-400 pointer-events-none">
                                                    AI Talimatı
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Summary & Action */}
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/10 sticky top-32">
                                        <h3 className="text-2xl font-black mb-6">Analiz Özeti</h3>

                                        <div className="space-y-6 mb-8">
                                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                                <span className="text-slate-400 font-medium">Yüklenen Belge</span>
                                                <span className="font-bold flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-blue-400" />
                                                    {files.length} Adet
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                                <span className="text-slate-400 font-medium">Talimat</span>
                                                <span className="font-bold">
                                                    {userInstructions ? 'Eklendi' : '-'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                                <span className="text-slate-400 font-medium">Tahmini Süre</span>
                                                <span className="font-bold flex items-center gap-2">
                                                    <Zap className="w-4 h-4 text-yellow-400" />
                                                    ~30 Saniye
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleAnalyze}
                                            disabled={files.length === 0 || isAnalyzing}
                                            className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ANALİZ EDİLİYOR...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    ANALİZİ BAŞLAT
                                                </>
                                            )}
                                        </button>

                                        {error && (
                                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 shrink-0" />
                                                <div>
                                                    <p>{error}</p>
                                                    {errorHint && <p className="text-xs mt-1 opacity-70 font-normal">{errorHint}</p>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800">Analiz Sonucu</h2>
                                    <p className="text-slate-500 font-medium">Yapay zeka tarafından oluşturulan beyanname taslağı.</p>
                                </div>
                                <button onClick={() => setAnalysisResult(null)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all text-sm">
                                    Yeni Analiz
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

function SidebarLink({ icon, label, onClick }: any) {
    return (
        <button onClick={onClick} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm tracking-tight transition-all text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            {icon}
            {label}
        </button>
    );
}
