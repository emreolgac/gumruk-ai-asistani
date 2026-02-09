'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Save, RefreshCw, CheckCircle2, AlertCircle, ShieldCheck, Zap } from 'lucide-react';

export default function PosSettingsPage() {
    const [configs, setConfigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const res = await fetch('/api/admin/config');
            const data = await res.json();
            setConfigs(data);
        } catch (error) {
            console.error('Fetch config error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (key: string, value: string, group: string) => {
        setSaving(key);
        setStatus(null);
        try {
            const res = await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value, group }),
            });
            if (res.ok) {
                setStatus({ type: 'success', msg: `${key} başarıyla kaydedildi.` });
                fetchConfigs();
            } else {
                setStatus({ type: 'error', msg: 'Kayıt sırasında hata oluştu.' });
            }
        } catch (error) {
            setStatus({ type: 'error', msg: 'Bağlantı hatası.' });
        } finally {
            setSaving(null);
        }
    };

    const posGroups = [
        {
            id: 'IYZICO',
            title: 'iyzico Entegrasyonu',
            logo: 'https://www.iyzico.com/assets/images/logo/iyzico-logo.svg',
            keys: ['IYZICO_API_KEY', 'IYZICO_SECRET_KEY', 'IYZICO_BASE_URL']
        },
        {
            id: 'PAYTR',
            title: 'PayTR Entegrasyonu',
            logo: 'https://www.paytr.com/img/paytr-logo.svg',
            keys: ['PAYTR_MERCHANT_ID', 'PAYTR_MERCHANT_KEY', 'PAYTR_MERCHANT_SALT']
        }
    ];

    if (loading) return <div className="flex h-96 items-center justify-center animate-pulse text-slate-400 font-bold">YÜKLENİYOR...</div>;

    return (
        <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sanal POS Ayarları</h1>
                <p className="text-slate-500 mt-2 text-lg font-medium">Ödeme sistemlerini (iyzico / PayTR) buradan yapılandırın.</p>
            </div>

            {status && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 border shadow-sm ${status.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                    }`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-bold text-sm tracking-wide">{status.msg}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {posGroups.map((group) => (
                    <div key={group.id} className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-gray-50 bg-slate-50/50 flex flex-col items-center justify-center gap-6">
                            <div className="h-12 flex items-center justify-center grayscale opacity-80 group-hover:grayscale-0 transition-all">
                                <span className="text-2xl font-black text-slate-800 tracking-tighter uppercase">{group.id}</span>
                            </div>
                            <h2 className="text-lg font-bold text-slate-700">{group.title}</h2>
                        </div>

                        <div className="p-8 space-y-8 flex-1">
                            {group.keys.map((key) => {
                                const config = configs.find(c => c.key === key);
                                return (
                                    <POSConfigItem
                                        key={key}
                                        label={key.replace(group.id + '_', '').replace(/_/g, ' ')}
                                        configKey={key}
                                        initialValue={config?.value || ''}
                                        onSave={(val: string) => handleSave(key, val, 'PAYMENT')}
                                        isSaving={saving === key}
                                    />
                                );
                            })}
                        </div>

                        <div className="px-8 py-4 bg-slate-50 border-t border-gray-50 flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">256-BIT SSL SECURE ENCRYPTION</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#1e2b4d] text-white p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute right-[-5%] top-[-10%] w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />
                <div className="p-4 bg-white/10 rounded-2xl">
                    <Zap className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                    <h4 className="text-xl font-bold mb-2">Aktif Ödeme Yöntemi</h4>
                    <p className="text-blue-100/70 text-sm max-w-xl">
                        Sistem şu an yapılandırılan ilk aktif POS üzerinden ödeme alır. Hem iyzico hem PayTR doluysa varsayılan olarak iyzico tercih edilir.
                        Ayarları değiştirdiğinizde veritabanı anında güncellenir.
                    </p>
                </div>
            </div>
        </div>
    );
}

function POSConfigItem({ label, configKey, initialValue, onSave, isSaving }: any) {
    const [val, setVal] = useState(initialValue);

    return (
        <div className="space-y-2 group">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
            </div>
            <div className="flex gap-2">
                <input
                    type={configKey.includes('SECRET') || configKey.includes('KEY') || configKey.includes('SALT') ? 'password' : 'text'}
                    className="flex-1 bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder={`${label} girin...`}
                />
                <button
                    onClick={() => onSave(val)}
                    disabled={isSaving}
                    className="px-4 py-3 bg-[#1e2b4d] text-white rounded-xl font-bold hover:bg-blue-900 transition-all flex items-center justify-center disabled:opacity-50"
                >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
