'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Search, X, Check, Image as ImageIcon } from 'lucide-react';

export default function BlogsManagement() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        isActive: true
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('/api/admin/blogs');
            const data = await res.json();
            setBlogs(data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingBlog ? 'PATCH' : 'POST';
        const body = editingBlog ? { ...formData, id: editingBlog.id } : formData;

        try {
            const res = await fetch('/api/admin/blogs', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingBlog(null);
                setFormData({ title: '', slug: '', excerpt: '', content: '', image: '', isActive: true });
                fetchBlogs();
            }
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
        try {
            await fetch('/api/admin/blogs', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            fetchBlogs();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const filteredBlogs = blogs.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Blog Yönetimi</h1>
                    <p className="text-slate-500 mt-2 text-lg">Haberler, rehberler ve sektör içeriklerini yönetin.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingBlog(null);
                        setFormData({ title: '', slug: '', excerpt: '', content: '', image: '', isActive: true });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Yazı Ekle
                </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Yazılarda ara..."
                            className="w-full bg-slate-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-64 bg-slate-50 rounded-[2rem] animate-pulse"></div>
                        ))
                    ) : filteredBlogs.map((blog) => (
                        <div key={blog.id} className="bg-slate-50/50 border border-gray-50 rounded-[2rem] overflow-hidden group hover:border-blue-500/20 transition-all shadow-sm flex flex-col">
                            <div className="h-40 bg-slate-200 relative overflow-hidden">
                                {blog.image ? (
                                    <img src={blog.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <ImageIcon className="w-10 h-10" />
                                    </div>
                                )}
                                <div className={`absolute top-4 right-4 px-2 py-1 rounded-lg text-[8px] font-black tracking-widest uppercase ${blog.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                    }`}>
                                    {blog.isActive ? 'YAYINDA' : 'TASLAK'}
                                </div>
                            </div>
                            <div className="p-6 space-y-3 flex-1">
                                <h4 className="font-bold text-slate-800 line-clamp-1">{blog.title}</h4>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                                <div className="text-[10px] text-slate-400 font-mono">/blog/{blog.slug}</div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
                                <button
                                    onClick={() => {
                                        setEditingBlog(blog);
                                        setFormData({ title: blog.title, slug: blog.slug, excerpt: blog.excerpt || '', content: blog.content, image: blog.image || '', isActive: blog.isActive });
                                        setIsModalOpen(true);
                                    }}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(blog.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {!loading && filteredBlogs.length === 0 && (
                    <div className="py-20 text-center text-slate-400 italic">Hiç blog yazısı bulunamadı.</div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1e2b4d]/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <BookOpen className="w-7 h-7 text-blue-600" />
                            {editingBlog ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BAŞLIK</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">URL SLUG</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GÖRSEL URL (UNSPLASH VB.)</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KISA ÖZET (EXCERPT)</label>
                                <textarea
                                    rows={2}
                                    className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YAZI İÇERİĞİ (HTML)</label>
                                <textarea
                                    required
                                    rows={10}
                                    className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium font-mono"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    className="w-5 h-5 rounded border-gray-200 text-blue-600 focus:ring-blue-500"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <label htmlFor="isActive" className="text-sm font-bold text-slate-600">Bu yazı yayında olsun</label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-[#1e2b4d] text-white rounded-2xl font-bold hover:bg-blue-900 shadow-xl shadow-blue-900/20 transition-all"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
