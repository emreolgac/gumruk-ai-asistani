'use client';

import { useState, useEffect } from 'react';
import { Share2, Plus, Trash2, Globe, Link2, Check, X } from 'lucide-react';

export default function SocialLinksManagement() {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ platform: 'linkedin', url: '', isActive: true });

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const res = await fetch('/api/admin/social');
            const data = await res.json();
            setLinks(data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/social', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ platform: 'linkedin', url: '', isActive: true });
                fetchLinks();
            }
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch('/api/admin/social', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            fetchLinks();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sosyal Medya</h1>
                    <p className="text-slate-500 mt-2 text-lg">Web sitesi footer bölümündeki ikonları ve linkleri yönetin.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Link Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(2).fill(0).map((_, i) => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border border-gray-100" />)
                ) : links.map((link) => (
                    <div key={link.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-blue-500/20 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 bg-slate-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                                <Link2 className="w-6 h-6" />
                            </div>
                            <button
                                onClick={() => handleDelete(link.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{link.platform}</h4>
                            <p className="text-sm font-bold text-slate-800 truncate">{link.url}</p>
                        </div>
                    </div>
                ))}
                {!loading && links.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-400 font-bold italic">Henüz sosyal medya linki eklenmemiş.</div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1e2b4d]/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <Share2 className="w-6 h-6 text-blue-600" />
                            Sosyal Medya Linki Ekle
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PLATFORM</label>
                                <select
                                    className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-slate-800 outline-none font-bold"
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                >
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="twitter">Twitter / X</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="youtube">YouTube</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">URL ADRESİ</label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://linkedin.com/in/..."
                                    className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all"
                            >
                                Link Ekle
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
