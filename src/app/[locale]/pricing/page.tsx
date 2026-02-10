'use client';

import { Check, Zap, Shield, Crown, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
    const handlePayment = async (plan: string, provider: 'paytr' | 'iyzico') => {
        alert(`${plan} paketi için ${provider} ödeme sayfasına yönlendiriliyorsunuz...`);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-24 px-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] translate-y-1/2" />

            <div className="relative z-10 text-center mb-20 space-y-6">
                <span className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">Fiyatlandırma</span>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">İhtiyacınıza Uygun <span className="text-blue-600">Planlar</span></h1>
                <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                    Gümrük süreçlerinizi yapay zeka ile hızlandırın. Şeffaf fiyatlandırma ile ölçeğinize en uygun paketi seçin.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-5xl relative z-10 px-4">
                {/* Startup Plan */}
                <div className="bg-white rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-12 flex flex-col hover:-translate-y-2 transition-all duration-500 group">
                    <div className="flex items-start justify-between mb-10">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">KOBİ Paketi</h3>
                            <p className="text-slate-400 font-bold text-sm">Küçük ekipler için ideal</p>
                        </div>
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <Zap className="w-7 h-7" />
                        </div>
                    </div>

                    <div className="mb-10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-900 tracking-tighter">₺499</span>
                            <span className="text-slate-400 font-bold text-lg">/ay + KDV</span>
                        </div>
                    </div>

                    <div className="space-y-5 mb-12 flex-1">
                        <PricingFeature label="100 Belge Analizi" />
                        <PricingFeature label="PDF & Görsel Desteği" />
                        <PricingFeature label="Standart Excel Çıktısı" />
                        <PricingFeature label="Email Desteği" />
                        <PricingFeature label="Bulut Arşivleme" />
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ödeme Yöntemi</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => handlePayment('startup', 'paytr')} className="py-4 px-6 border-2 border-slate-100 rounded-2xl font-black text-sm hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                                PayTR
                            </button>
                            <button onClick={() => handlePayment('startup', 'iyzico')} className="py-4 px-6 border-2 border-slate-100 rounded-2xl font-black text-sm hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                                iyzico
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pro Plan */}
                <div className="bg-[#0f172a] rounded-[3.5rem] shadow-2xl shadow-blue-900/20 p-12 flex flex-col relative overflow-hidden border border-slate-800 hover:-translate-y-2 transition-all duration-500 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                    <div className="absolute top-8 right-12 bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20">
                        <Star className="w-3.5 h-3.5 fill-white" /> POPÜLER
                    </div>

                    <div className="flex items-start justify-between mb-10 relative z-10">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white tracking-tight">Kurumsal Pro</h3>
                            <p className="text-slate-400 font-bold text-sm">Yüksek hacimli operasyonlar</p>
                        </div>
                        <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <Crown className="w-7 h-7" />
                        </div>
                    </div>

                    <div className="mb-10 relative z-10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white tracking-tighter">₺1299</span>
                            <span className="text-slate-400 font-bold text-lg">/ay + KDV</span>
                        </div>
                    </div>

                    <div className="space-y-5 mb-12 flex-1 relative z-10">
                        <PricingFeature dark label="Sınırsız Belge Analizi" />
                        <PricingFeature dark label="Öncelikli İşleme Hızı" />
                        <PricingFeature dark label="Gelişmiş Excel & XML Çıktısı" />
                        <PricingFeature dark label="Lojistik Yazılım Entegrasyonu" />
                        <PricingFeature dark label="Telefon & VIP Destek hattı" />
                        <PricingFeature dark label="API Erişimi" />
                    </div>

                    <div className="space-y-4 relative z-10">
                        <button onClick={() => handlePayment('pro', 'paytr')} className="w-full py-5 bg-blue-600 hover:bg-white hover:text-blue-600 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group">
                            ŞİMDİ ABONE OL
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-20 text-center space-y-4">
                <p className="text-slate-500 font-medium">Büyük ölçekli projeler veya özel entegrasyonlar mı gerekiyor?</p>
                <Link href="/tr/contact" className="text-blue-600 font-black hover:underline flex items-center justify-center gap-2 group">
                    Bize ulaşın <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}

function PricingFeature({ label, dark }: { label: string, dark?: boolean }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${dark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                }`}>
                <Check className="w-3.5 h-3.5" />
            </div>
            <span className={`font-bold text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
        </div>
    );
}

