'use client';

import { useState, useEffect } from 'react';
import { FileSearch, Clock, ChevronRight, BookOpen, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function BlogsListPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/admin/blogs?active=true')
            .then(res => res.json())
            .then(data => {
                setBlogs(data);
                setLoading(false);
            });
    }, []);

    const filteredBlogs = blogs.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/tr" className="text-sm font-bold text-gray-400 hover:text-white transition-all">Anasayfa</Link>
                        <Link href="/tr/contact" className="text-sm font-bold text-gray-400 hover:text-white transition-all">İletişim</Link>
                    </div>
                </div>
            </nav>

            <main className="py-24">
                <div className="container mx-auto px-6">
                    <header className="mb-24 text-center space-y-8">
                        <h1 className="text-6xl lg:text-8xl font-black tracking-tighter">Blog & Haberler</h1>
                        <p className="text-gray-400 text-xl max-w-2xl mx-auto font-medium">
                            Gümrük sektöründeki dijitalleşme rehberleri, mevzuat analizleri ve teknoloji haberleri.
                        </p>

                        <div className="max-w-2xl mx-auto pt-8">
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="İçeriklerde ara..."
                                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </header>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-[500px] bg-white/5 rounded-[3rem] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {filteredBlogs.map((blog) => (
                                <Link key={blog.id} href={`/tr/blog/${blog.slug}`} className="group bg-[#0a0f1d] border border-white/5 rounded-[3rem] overflow-hidden hover:border-blue-500/20 hover:-translate-y-2 transition-all duration-300 shadow-2xl flex flex-col h-full">
                                    <div className="h-64 bg-gray-900 border-b border-white/5 overflow-hidden">
                                        {blog.image ? (
                                            <img src={blog.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="w-12 h-12 text-white/10" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-10 flex flex-col flex-1">
                                        <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-blue-500 uppercase mb-6">
                                            <Clock className="w-4 h-4" />
                                            {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                                        </div>
                                        <h3 className="text-2xl font-black mb-6 leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">{blog.title}</h3>
                                        <p className="text-gray-400 font-medium text-sm leading-relaxed mb-10 line-clamp-3 italic">"{blog.excerpt}"</p>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-xs font-black tracking-widest text-gray-500 uppercase">DEVAMINI OKU</span>
                                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                                <ChevronRight className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {filteredBlogs.length === 0 && (
                                <div className="col-span-full py-32 text-center text-gray-500 font-bold italic text-2xl">Aradığınız kriterlere uygun içerik bulunamadı.</div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <footer className="py-12 border-t border-white/5 text-center text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">
                GÜMRÜK AI BLOG ARŞİVİ - BİLGİ GÜÇTÜR
            </footer>
        </div>
    );
}
