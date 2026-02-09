'use client';

import { useState, useEffect } from 'react';
import {
    CreditCard,
    Plus,
    Trash2,
    Save,
    CheckCircle2,
    AlertCircle,
    GripVertical,
    Star,
    Settings,
    MoreVertical,
    ChevronRight,
    RefreshCw,
    Zap,
    Tag
} from 'lucide-react';

interface PricingPlan {
    id?: string;
    title: string;
    price: string;
    credits: string;
    features: string;
    isHighlighted: boolean;
    isActive: boolean;
    order: number;
}

export default function AdminPricingPage() {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/admin/pricing');
            const data = await res.json();
            setPlans(data);
        } catch (error) {
            console.error('Fetch plans error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const method = editingPlan?.id ? 'PATCH' : 'POST';
        try {
            const res = await fetch('/api/admin/pricing', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingPlan),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchPlans();
            }
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu planı silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch('/api/admin/pricing', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) fetchPlans();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const openModal = (plan: PricingPlan | null = null) => {
        setEditingPlan(plan || { title: '', price: '', credits: '', features: '', isHighlighted: false, isActive: true, order: 0 });
        setIsModalOpen(true);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-slate-400 font-bold tracking-widest uppercase text-xs">Planlar Yükleniyor...</span>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                    <Tag className="w-40 h-40 text-blue-600" />
                </div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Fiyatlandırma Yönetimi</h1>
                        <p className="text-slate-500 mt-1 font-medium text-lg">Platform paketlerini ve kredi fiyatlarını özelleştirin.</p>
                    </div>
                </div>
                <button
                    onClick={() => openModal()}
                    className="relative z-10 px-8 py-5 bg-blue-600 hover:bg-black text-white rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/10"
                >
                    <Plus className="w-6 h-6" />
                    YENİ PLAN EKLE
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div key={plan.id} className={`group bg-white p-8 rounded-[3rem] border-2 ${plan.isHighlighted ? 'border-blue-600/30' : 'border-gray-50'} shadow-sm relative overflow-hidden flex flex-col`}>
                        {plan.isHighlighted && (
                            <div className="absolute top-0 right-0 px-6 py-2 bg-blue-600 text-white text-[10px] font-black rounded-bl-3xl uppercase tracking-widest">
                                ÖNE ÇIKAN
                            </div>
                        )}

                        <div className="mb-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PLAN ADI</p>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{plan.title}</h3>
                        </div>

                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                            <span className="text-xs font-bold text-slate-400">/Paket</span>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl mb-8 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">KREDİ</p>
                                <p className="text-xl font-black text-slate-800">{plan.credits}</p>
                            </div>
                            <Zap className="w-6 h-6 text-orange-400" />
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ÖZELLİKLER</p>
                            <div className="flex flex-wrap gap-2">
                                {plan.features.split(',').map((f, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-lg border border-gray-100">
                                        {f.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => openModal(plan)}
                                className="flex-1 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                            >
                                DÜZENLE
                            </button>
                            <button
                                onClick={() => handleDelete(plan.id!)}
                                className="w-14 h-14 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {plans.length === 0 && (
                    <div className="lg:col-span-3 h-64 border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-gray-400 font-bold gap-4">
                        <CreditCard className="w-12 h-12 opacity-20" />
                        Henüz bir plan eklenmemiş. Yukarıdaki butonu kullanarak başlayın.
                    </div>
                )}
            </div>

            {/* Plan Editor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-12 bg-slate-50 border-b border-gray-100 relative overflow-hidden">
                            <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full" />
                            <h2 className="text-3xl font-black text-slate-800 relative z-10">Planı Yapılandır</h2>
                            <p className="text-slate-500 font-medium relative z-10">Müşterilerinize sunduğunuz paketin detaylarını düzenleyin.</p>
                        </div>
                        <form onSubmit={handleSave} className="p-12 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PLAN ADI</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-gray-100 rounded-3xl px-6 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold"
                                        value={editingPlan?.title}
                                        onChange={e => setEditingPlan({ ...editingPlan!, title: e.target.value })}
                                        placeholder="Örn: Profesyonel"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FİYAT (₺)</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-gray-100 rounded-3xl px-6 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold"
                                        value={editingPlan?.price}
                                        onChange={e => setEditingPlan({ ...editingPlan!, price: e.target.value })}
                                        placeholder="Örn: ₺1,499"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KREDİ MİKTARI</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-gray-100 rounded-3xl px-6 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold"
                                        value={editingPlan?.credits}
                                        onChange={e => setEditingPlan({ ...editingPlan!, credits: e.target.value })}
                                        placeholder="Örn: 100 Kredi"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SIRALAMA (ORDER)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-slate-50 border border-gray-100 rounded-3xl px-6 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold"
                                        value={editingPlan?.order}
                                        onChange={e => setEditingPlan({ ...editingPlan!, order: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ÖZELLİKLER (VİRGÜLLE AYIRIN)</label>
                                <textarea
                                    rows={3}
                                    required
                                    className="w-full bg-slate-50 border border-gray-100 rounded-3xl px-6 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold resize-none"
                                    value={editingPlan?.features}
                                    onChange={e => setEditingPlan({ ...editingPlan!, features: e.target.value })}
                                    placeholder="Örn: Sınırsız Dil, ERP Entegrasyonu, Öncelikli Destek"
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-8">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 border-2 border-gray-200 rounded-lg checked:bg-blue-600 transition-all"
                                        checked={editingPlan?.isHighlighted}
                                        onChange={e => setEditingPlan({ ...editingPlan!, isHighlighted: e.target.checked })}
                                    />
                                    <span className="text-sm font-black text-slate-600 uppercase tracking-widest">ÖNE ÇIKARILAN PLAN (POPÜLER)</span>
                                </label>
                            </div>

                            <div className="flex gap-4 pt-10">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-6 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all"
                                >
                                    İPTAL
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-[2] py-6 bg-blue-600 hover:bg-black text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    PLANLARI KAYDET
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
