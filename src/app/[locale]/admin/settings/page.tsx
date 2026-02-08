'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Key, Globe, Layout, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
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
                setStatus({ type: 'success', msg: `${key} başarıyla güncellendi.` });
                fetchConfigs();
            } else {
                setStatus({ type: 'error', msg: 'Güncelleme sırasında bir hata oluştu.' });
            }
        } catch (error) {
            setStatus({ type: 'error', msg: 'Bağlantı hatası.' });
        } finally {
            setSaving(null);
        }
    };

    const groups = ['API', 'SEO', 'UI', 'PAYMENT'];

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 text-white">
            <div>
                <h1 className="text-4xl font-black tracking-tight">Sistem Ayarları</h1>
                <p className="text-gray-400 mt-2 text-lg">API anahtarlarını, SEO ayarlarını ve sistem parametrelerini yönetin.</p>
            </div>

            {status && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 border ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-medium">{status.msg}</span>
                </div>
            )}

            <div className="space-y-8">
                {groups.map((group) => {
                    const groupConfigs = configs.filter(c => c.group === group || (!c.group && group === 'API'));
                    if (groupConfigs.length === 0 && group !== 'API') return null;

                    return (
                        <div key={group} className="bg-gray-800/50 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
                            <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center gap-3">
                                {group === 'API' && <Key className="w-5 h-5 text-blue-400" />}
                                {group === 'SEO' && <Globe className="w-5 h-5 text-purple-400" />}
                                {group === 'UI' && <Layout className="w-5 h-5 text-amber-400" />}
                                {group === 'PAYMENT' && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                                <h2 className="text-xl font-bold tracking-wide uppercase text-gray-300">{group} Yapılandırması</h2>
                            </div>

                            <div className="p-8 space-y-6">
                                {groupConfigs.map((config) => (
                                    <ConfigItem
                                        key={config.key}
                                        config={config}
                                        onSave={(val) => handleSave(config.key, val, group)}
                                        isSaving={saving === config.key}
                                    />
                                ))}
                                {groupConfigs.length === 0 && (
                                    <div className="text-gray-500 italic text-sm">Bu grupta henüz bir ayar bulunmuyor.</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2rem] flex items-center gap-4">
                <RefreshCw className="w-8 h-8 text-blue-400" />
                <div>
                    <h4 className="font-bold text-blue-100 uppercase text-xs tracking-widest mb-1">Önemli Not</h4>
                    <p className="text-sm text-blue-100/60">
                        Yapılan değişikliklerin bir kısmı sunucu tarafında (`server-side`) önbelleğe alınıyor olabilir.
                        Değişikliklerin anında yansıması için uygulamayı yeniden başlatmanız gerekebilir.
                    </p>
                </div>
            </div>
        </div>
    );
}

function ConfigItem({ config, onSave, isSaving }: any) {
    const [val, setVal] = useState(config.value);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-400 font-mono">{config.key}</label>
                {config.isDb && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase">DB Override</span>}
            </div>
            <div className="flex gap-3">
                <input
                    type={config.key.includes('KEY') || config.key.includes('SECRET') ? 'password' : 'text'}
                    className="flex-1 bg-gray-900 border border-white/10 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder={`${config.key} değerini girin...`}
                />
                <button
                    onClick={() => onSave(val)}
                    disabled={isSaving}
                    className="px-6 py-3 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Kaydet
                </button>
            </div>
        </div>
    );
}
