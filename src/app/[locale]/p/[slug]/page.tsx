'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FileSearch, ChevronLeft, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function GenericPage() {
    const params = useParams();
    const slug = params.slug;
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/admin/pages?active=true`)
            .then(res => res.json())
            .then(data => {
                const found = data.find((p: any) => p.slug === slug);
                setPage(found);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
    );

    if (!page) return (
        <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-9xl font-black text-white/5 absolute select-none">404</h1>
            <h2 className="text-4xl font-black mb-4">Sayfa Bulunamadı</h2>
            <p className="text-gray-400 mb-8 max-w-md">Talep ettiğiniz sayfa silinmiş veya taşınmış olabilir.</p>
            <Link href="/tr" className="px-8 py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-500 transition-all">Anasayfaya Dön</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030712] text-white selection:bg-blue-600/30">
            <nav className="border-b border-white/5 bg-[#030712]/50 backdrop-blur-xl sticky top-0 z-50 h-20 flex items-center">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link href="/tr" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <FileSearch className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight">GÜMRÜK AI</span>
                    </Link>
                    <Link href="/tr" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-all">
                        <ChevronLeft className="w-4 h-4" />
                        Geri Dön
                    </Link>
                </div>
            </nav>

            <main className="py-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="space-y-6 mb-16">
                        <div className="flex items-center gap-4 text-xs font-black tracking-widest text-blue-400 uppercase">
                            <span>DOKÜMANTASYON</span>
                            <div className="w-1 h-1 bg-gray-700 rounded-full" />
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(page.updatedAt).toLocaleDateString('tr-TR')}
                            </div>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1]">{page.title}</h1>
                    </div>

                    <div className="prose prose-invert prose-blue max-w-none">
                        <div
                            className="text-gray-300 text-lg leading-[1.8] font-medium space-y-8"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>

                    <div className="mt-24 p-12 bg-white/5 border border-white/5 rounded-[3rem] text-center space-y-8">
                        <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                            <ShieldCheck className="w-10 h-10 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black mb-3">Güvenliğiniz Önceliğimizdir</h3>
                            <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                                Bu sayfadaki bilgiler yasal zorunluluklar gereği paylaşılmıştır ve düzenli olarak güncellenmektedir.
                            </p>
                        </div>
                        <Link href="/tr/contact" className="inline-block px-10 py-5 bg-white text-black rounded-[2rem] font-black hover:bg-gray-200 transition-all">
                            Hukuki Destek Talebi
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-white/5 text-center text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">
                GÜMRÜK AI ASİSTANI - KURUMSAL VE HUKUKİ BİLGİLENDİRME
            </footer>
        </div>
    );
}
