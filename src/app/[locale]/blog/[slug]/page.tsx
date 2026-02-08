'use client';

import { useState, useEffect } from 'react';
import { FileSearch, ChevronLeft, Clock, Share2, BookOpen, MessageSquare, Linkedin, Twitter, Facebook } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BlogDetailPage() {
    const params = useParams();
    const slug = params.slug;
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/admin/blogs?active=true`)
            .then(res => res.json())
            .then(data => {
                const found = data.find((b: any) => b.slug === slug);
                setBlog(found);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
    );

    if (!blog) return (
        <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-black mb-4">İçerik Bulunamadı</h2>
            <Link href="/tr/blogs" className="text-blue-400 font-bold underline">Blog Listesine Dön</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030712] text-white">
            <nav className="border-b border-white/5 bg-[#030712]/50 backdrop-blur-xl sticky top-0 z-50 h-20 flex items-center">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link href="/tr" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <FileSearch className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight">GÜMRÜK AI</span>
                    </Link>
                    <Link href="/tr/blogs" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-all">
                        <ChevronLeft className="w-4 h-4" />
                        Bloglara Dön
                    </Link>
                </div>
            </nav>

            <main className="py-20 lg:py-32">
                <article className="container mx-auto px-6 max-w-4xl">
                    <header className="space-y-12 mb-20 text-center">
                        <div className="flex items-center justify-center gap-4 text-xs font-black tracking-widest text-blue-400 uppercase">
                            <span>Haber & Analiz</span>
                            <div className="w-1 h-1 bg-gray-700 rounded-full" />
                            <div className="flex items-center gap-1.5 font-bold tracking-[0.2em]">
                                <Clock className="w-4 h-4" />
                                {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                        </div>

                        <h1 className="text-4xl lg:text-7xl font-black tracking-tighter leading-tight lg:leading-[1.1] text-balance">
                            {blog.title}
                        </h1>

                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-800 rounded-full border border-white/10" />
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white">Gümrük AI Editör</p>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Sektör Analisti</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShareButton icon={<Twitter className="w-4 h-4" />} />
                                <ShareButton icon={<Linkedin className="w-4 h-4" />} />
                                <ShareButton icon={<Facebook className="w-4 h-4" />} />
                            </div>
                        </div>
                    </header>

                    {blog.image && (
                        <div className="aspect-video rounded-[3rem] overflow-hidden mb-20 bg-gray-900 shadow-2xl ring-1 ring-white/10">
                            <img src={blog.image} alt="" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="prose prose-invert prose-blue max-w-none">
                        <div
                            className="text-gray-300 text-lg lg:text-xl leading-[1.8] font-medium space-y-10"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </div>

                    <div className="mt-32 pt-16 border-t border-white/5">
                        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[3rem] p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 border border-white/5 relative overflow-hidden">
                            <div className="absolute right-[-10%] top-[-10%] w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full" />
                            <div className="max-w-md text-center lg:text-left space-y-4">
                                <h3 className="text-3xl font-black">Süreçlerinizi Dönüştürün</h3>
                                <p className="text-gray-400 font-medium">Bu analizlerin ötesine geçin. Yapay zeka gücüyle kendi belgelerinizi hemen incelemeye başlayın.</p>
                            </div>
                            <Link href="/tr/login" className="px-12 py-6 bg-white text-black font-black rounded-[2rem] hover:bg-gray-200 transition-all shadow-2xl active:scale-95 whitespace-nowrap">
                                Ücretsiz Deneyin
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

            <footer className="py-12 border-t border-white/5 text-center text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">
                © 2026 GÜMRÜK AI BLOG - SEKTÖREL BİLGİ VE ANALİZ
            </footer>
        </div>
    );
}

function ShareButton({ icon }: any) {
    return (
        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all">
            {icon}
        </button>
    );
}
