'use client';

import { useState, useEffect } from 'react';
import {
    Settings,
    Save,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Search,
    Globe,
    Mail,
    ShieldCheck,
    Code,
    Zap,
    Layout,
    MousePointer2
} from 'lucide-react';

export default function SiteSettingsPage() {
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
                setStatus({ type: 'success', msg: `${key} ayarı kaydedildi.` });
                fetchConfigs();
            } else {
                setStatus({ type: 'error', msg: 'Kayıt hatası.' });
            }
        } catch (error) {
            setStatus({ type: 'error', msg: 'Bağlantı hatası.' });
        } finally {
            setSaving(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-slate-400 font-bold tracking-widest uppercase text-xs">Ayarlar Yükleniyor...</span>
        </div>
    );

    const groups = [
        {
            id: 'SEO',
            title: 'Arama Motoru (SEO) Ayarları',
            icon: <Globe className="w-6 h-6 text-blue-500" />,
            desc: 'Google Tag Manager, Meta etiketleri ve Site haritası ayarlarını yönetin.',
            keys: ['SITE_TITLE', 'SITE_DESCRIPTION', 'NEXT_PUBLIC_GTM_ID', 'NEXT_PUBLIC_GSC_VERIFICATION']
        },
        {
            id: 'MAIL',
            title: 'E-Posta (SMTP) Ayarları',
            icon: <Mail className="w-6 h-6 text-purple-500" />,
            desc: 'Sistem tarafından gönderilen bildirim ve iletişim mailleri için sunucu ayarları.',
            keys: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_FROM']
        },
        {
            id: 'API',
            title: 'API Entegrasyonları',
            icon: <Code className="w-6 h-6 text-orange-500" />,
            desc: 'Yapay zeka modelleri ve dış servisler için anahtar yönetimi.',
            keys: ['CLAUDE_API_KEY']
        }
    ];

    return (
        <div className="max-w-6xl space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Site Ayarları</h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">Sistemin çekirdek yapılandırmasını buradan düzenleyin.</p>
                </div>
                {status && (
                    <div className={`px-6 py-4 rounded-2xl flex items-center gap-3 border shadow-xl animate-in fade-in slide-in-from-right-4 ${status.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                        }`}>
                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-bold text-sm">{status.msg}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-12">
                {groups.map((group) => (
                    <div key={group.id} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden border-l-8 border-l-blue-600/50">
                        <div className="p-10 border-b border-gray-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center gap-8">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center shrink-0 border border-gray-50">
                                {group.icon}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 mb-1">{group.title}</h2>
                                <p className="text-slate-500 font-medium text-sm">{group.desc}</p>
                            </div>
                        </div>

                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {group.keys.map(key => {
                                const config = configs.find(c => c.key === key);
                                return (
                                    <SettingItem
                                        key={key}
                                        configKey={key}
                                        initialValue={config?.value || ''}
                                        onSave={(val: string) => handleSave(key, val, group.id)}
                                        isSaving={saving === key}
                                    />
                                )
                            })}
                        </div>

                        <div className="px-10 py-4 bg-slate-50 border-t border-gray-50 flex items-center gap-3">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GÜVENLİ VERİTABANI ERİŞİMİ AKTİF</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#1e2b4d] text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col items-center text-center gap-8">
                <div className="absolute left-[-5%] top-[-10%] w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />
                <div className="absolute right-[-5%] bottom-[-10%] w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full" />

                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                    <Zap className="w-8 h-8 text-orange-400" />
                </div>
                <div className="max-w-xl space-y-4">
                    <h3 className="text-3xl font-black">Değişiklikleri Kaydet</h3>
                    <p className="text-blue-100/60 leading-relaxed font-medium">Bu ekrandaki ayarlar kaydedildiği anda tüm sistem üzerinde aktif olur. Yanlış yapılandırma sistemin çalışmasını etkileyebilir.</p>
                </div>
            </div>
        </div>
    );
}

function SettingItem({ configKey, initialValue, onSave, isSaving }: any) {
    const [val, setVal] = useState(initialValue);
    const label = configKey.replace('NEXT_PUBLIC_', '').replace(/_/g, ' ');

    return (
        <div className="space-y-3 group">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
                <span className="text-[9px] font-black text-slate-200 uppercase group-focus-within:text-blue-200 transition-colors">{configKey}</span>
            </div>
            <div className="relative">
                <input
                    type={configKey.includes('KEY') || configKey.includes('SECRET') || configKey.includes('PASS') ? 'password' : 'text'}
                    className="w-full bg-slate-50 border border-gray-100 rounded-2xl px-6 py-4 text-slate-800 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder={`${label} girin...`}
                />
                <button
                    onClick={() => onSave(val)}
                    disabled={isSaving}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 hover:bg-black text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
                >
                    {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
