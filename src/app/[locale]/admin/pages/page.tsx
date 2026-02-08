'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Edit2, Search, X, Check, Eye } from 'lucide-react';

export default function PagesManagement() {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        isActive: true
    });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await fetch('/api/admin/pages');
            const data = await res.json();
            setPages(data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingPage ? 'PATCH' : 'POST';
        const body = editingPage ? { ...formData, id: editingPage.id } : formData;

        try {
            const res = await fetch('/api/admin/pages', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingPage(null);
                setFormData({ title: '', slug: '', content: '', isActive: true });
                fetchPages();
            }
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu sayfayı silmek istediğinize emin misiniz?')) return;
        try {
            await fetch('/api/admin/pages', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            fetchPages();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const filteredPages = pages.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sayfa Yönetimi</h1>
                    <p className="text-slate-500 mt-2 text-lg">Hukuki metinler, hakkımızda ve diğer statik sayfaları yönetin.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingPage(null);
                        setFormData({ title: '', slug: '', content: '', isActive: true });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Sayfa Ekle
                </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Sayfalarda ara..."
                            className="w-full bg-slate-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">SAYFA BAŞLIĞI</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">SLUG (URL)</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">DURUM</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">İŞLEMLER</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-8 py-6 h-20"></td>
                                    </tr>
                                ))
                            ) : filteredPages.map((page) => (
                                <tr key={page.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-6 font-bold text-slate-700">{page.title}</td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-500 font-mono">/p/{page.slug}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${page.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {page.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                            {page.isActive ? 'AKTİF' : 'PASİF'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingPage(page);
                                                    setFormData({ title: page.title, slug: page.slug, content: page.content, isActive: page.isActive });
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(page.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && filteredPages.length === 0 && (
                        <div className="py-20 text-center text-slate-400 italic">Eşleşen sayfa bulunamadı.</div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1e2b4d]/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <Plus className="w-7 h-7 text-blue-600" />
                            {editingPage ? 'Sayfayı Düzenle' : 'Yeni Sayfa Oluştur'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">SAYFA BAŞLIĞI</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">SLUG (URL KEY)</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="ornek-sayfa-url"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">SAYFA İÇERİĞİ (HTML DESTEKLER)</label>
                                <textarea
                                    required
                                    rows={12}
                                    className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium font-mono text-sm"
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
                                <label htmlFor="isActive" className="text-sm font-bold text-slate-600">Bu sayfa yayında olsun</label>
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
                                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all"
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
