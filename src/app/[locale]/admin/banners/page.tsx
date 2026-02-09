'use client';

import { useState, useEffect } from 'react';
import {
    Image as ImageIcon,
    Plus,
    Trash2,
    Save,
    Layout,
    Columns,
    ExternalLink,
    RefreshCw,
    ToggleLeft,
    ToggleRight,
    Monitor,
    Settings
} from 'lucide-react';

interface Banner {
    id?: string;
    title: string;
    image: string;
    link?: string;
    type: 'HORIZONTAL' | 'VERTICAL';
    isActive: boolean;
}

export default function AdminBannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await fetch('/api/admin/banners');
            const data = await res.json();
            setBanners(data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const method = editingBanner?.id ? 'PATCH' : 'POST';
        try {
            const res = await fetch('/api/admin/banners', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingBanner),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchBanners();
            }
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Silmek istediğinize emin misiniz?')) return;
        try {
            await fetch('/api/admin/banners', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            fetchBanners();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const toggleStatus = async (banner: Banner) => {
        try {
            await fetch('/api/admin/banners', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: banner.id, isActive: !banner.isActive }),
            });
            fetchBanners();
        } catch (error) {
            console.error('Toggle error:', error);
        }
    };

    const openModal = (banner: Banner | null = null) => {
        setEditingBanner(banner || { title: '', image: '', link: '', type: 'HORIZONTAL', isActive: true });
        setIsModalOpen(true);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Bannerlar Yükleniyor...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-700">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute right-[-5%] top-[-10%] w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                        <ImageIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Banner Yönetimi</h1>
                        <p className="text-slate-500 mt-1 font-medium text-lg">Kullanıcı dashboard alanındaki reklam ve duyuru alanlarını yönetin.</p>
                    </div>
                </div>
                <button
                    onClick={() => openModal()}
                    className="relative z-10 px-8 py-5 bg-blue-600 hover:bg-black text-white rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/10"
                >
                    <Plus className="w-6 h-6" />
                    YENİ BANNER EKLE
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Horizontal Banners */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 px-4">
                        <Layout className="w-6 h-6 text-blue-600" />
                        Yatay Bannerlar (Geniş)
                    </h3>
                    <div className="space-y-4">
                        {banners.filter(b => b.type === 'HORIZONTAL').map(banner => (
                            <BannerRow key={banner.id} banner={banner} onEdit={() => openModal(banner)} onDelete={() => handleDelete(banner.id!)} onToggle={() => toggleStatus(banner)} />
                        ))}
                        {banners.filter(b => b.type === 'HORIZONTAL').length === 0 && (
                            <div className="bg-white border-2 border-dashed border-gray-100 p-12 rounded-[2.5rem] text-center text-slate-400 font-bold">Yatay banner yok.</div>
                        )}
                    </div>
                </div>

                {/* Vertical Banners */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 px-4">
                        <Columns className="w-6 h-6 text-purple-600" />
                        Dikey Bannerlar (Yan Panel)
                    </h3>
                    <div className="space-y-4">
                        {banners.filter(b => b.type === 'VERTICAL').map(banner => (
                            <BannerRow key={banner.id} banner={banner} onEdit={() => openModal(banner)} onDelete={() => handleDelete(banner.id!)} onToggle={() => toggleStatus(banner)} />
                        ))}
                        {banners.filter(b => b.type === 'VERTICAL').length === 0 && (
                            <div className="bg-white border-2 border-dashed border-gray-100 p-12 rounded-[2.5rem] text-center text-slate-400 font-bold">Dikey banner yok.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 bg-slate-50 border-b border-gray-100 relative overflow-hidden">
                            <div className="absolute right-[-10%] top-[-10%] w-48 h-48 bg-blue-600/5 blur-[80px] rounded-full" />
                            <h2 className="text-2xl font-black text-slate-800 relative z-10">Banner Yapılandır</h2>
                        </div>
                        <form onSubmit={handleSave} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BANNER BAŞLIĞI</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 font-bold"
                                    value={editingBanner?.title}
                                    onChange={e => setEditingBanner({ ...editingBanner!, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GÖRSEL URL</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 font-bold"
                                    value={editingBanner?.image}
                                    onChange={e => setEditingBanner({ ...editingBanner!, image: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TIP</label>
                                    <select
                                        className="w-full bg-slate-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none font-bold"
                                        value={editingBanner?.type}
                                        onChange={e => setEditingBanner({ ...editingBanner!, type: e.target.value as any })}
                                    >
                                        <option value="HORIZONTAL">Yatay (Geniş)</option>
                                        <option value="VERTICAL">Dikey (Yan)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LINK (OPSİYONEL)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none font-bold"
                                        value={editingBanner?.link}
                                        onChange={e => setEditingBanner({ ...editingBanner!, link: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase transition-all">İPTAL</button>
                                <button type="submit" disabled={saving} className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-600/10 flex items-center justify-center gap-2">
                                    {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    KAYDET
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function BannerRow({ banner, onEdit, onDelete, onToggle }: any) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-6 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
            <div className="w-24 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-gray-50 relative group-hover:scale-110 transition-transform">
                <img src={banner.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-slate-800 truncate">{banner.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 truncate opacity-60">{banner.link || 'Bağlantı yok'}</p>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onToggle} className={`p-3 rounded-xl transition-all ${banner.isActive ? 'text-green-500 bg-green-50' : 'text-slate-300 bg-slate-50'}`}>
                    {banner.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
                <button onClick={onEdit} className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all">
                    <Settings className="w-5 h-5" />
                </button>
                <button onClick={onDelete} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
