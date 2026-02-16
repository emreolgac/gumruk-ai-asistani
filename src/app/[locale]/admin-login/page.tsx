'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, Mail, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // First, verify admin role via API
            const verifyRes = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
                setError(verifyData.error || 'Giriş reddedildi');
                setLoading(false);
                return;
            }

            // If admin verified, sign in via NextAuth
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Kimlik doğrulama başarısız');
            } else {
                router.push('/tr/admin');
            }
        } catch (err) {
            setError('Bağlantı hatası');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050a15]">
            {/* Dark Security Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-900/10 rounded-full blur-[120px]"></div>
                {/* Grid overlay */}
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            <div className="max-w-md w-full z-10 p-4">
                {/* Security Badge */}
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-600/30 relative">
                        <ShieldAlert className="w-10 h-10 text-white" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#050a15] animate-pulse"></div>
                    </div>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] p-8 rounded-[2.5rem] shadow-2xl space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            Yönetici Girişi
                        </h1>
                        <p className="text-red-200/40 font-bold text-sm uppercase tracking-widest">
                            Yetkili Personel Erişimi
                        </p>
                    </div>

                    {/* Warning Banner */}
                    <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-red-200/60 leading-relaxed font-medium">
                            Bu alan yalnızca yetkili sistem yöneticilerine açıktır. Tüm giriş denemeleri kayıt altına alınmaktadır.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in slide-in-from-left-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-red-200/40 uppercase tracking-widest px-1">
                                ADMİN EMAIL
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-200/20 group-focus-within:text-red-400 transition-colors" />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-12 pr-4 text-white placeholder-white/15 outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all font-bold"
                                    placeholder="admin@gumruk.ai"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-red-200/40 uppercase tracking-widest px-1">
                                ŞİFRE
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-200/20 group-focus-within:text-red-400 transition-colors" />
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-14 bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-12 pr-4 text-white placeholder-white/15 outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all font-bold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-red-600/20 disabled:opacity-50 uppercase tracking-wider text-sm"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    GÜVENLİ GİRİŞ
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-8 flex items-center justify-center gap-6 text-[9px] font-black text-red-200/15 uppercase tracking-[0.3em] text-center">
                    <span>🔒 ŞİFRELİ BAĞLANTI</span>
                    <span>•</span>
                    <span>LOG KAYDI AKTİF</span>
                </div>
            </div>
        </div>
    );
}
