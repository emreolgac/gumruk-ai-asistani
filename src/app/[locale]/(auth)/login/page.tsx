'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const t = useTranslations('Auth');
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await signIn('google', { callbackUrl: '/dashboard' });
        } catch (err) {
            setError('Google login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Email veya şifre hatalı');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0f1e]">
            {/* Premium Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full z-10 p-4"
            >
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl space-y-8">
                    <div className="text-center space-y-2">
                        <motion.h1
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="text-4xl font-black text-white tracking-tight"
                        >
                            {t('login')}
                        </motion.h1>
                        <p className="text-blue-200/60 font-medium">Gümrük AI dünyasına tekrar hoş geldiniz.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-2xl text-sm font-medium flex items-center gap-3"
                        >
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-white/5 group"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
                            Google ile Giriş Yap
                        </button>
                    </div>

                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink mx-4 text-xs font-black text-blue-200/30 uppercase tracking-[0.2em]">Veya Email</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <form onSubmit={handleCredentialsLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest px-1">EMAIL ADRESİ</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200/30 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-bold"
                                    placeholder="deneme@gumruk.ai"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest px-1">ŞİFRE</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200/30 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-bold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    GİRİŞ YAP
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm font-bold text-blue-200/40">
                        Hesabınız yok mu?{' '}
                        <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                            {t('register')}
                        </Link>
                    </p>
                </div>

                {/* Footer Info */}
                <div className="mt-8 flex items-center justify-center gap-8 text-[10px] font-black text-blue-200/20 uppercase tracking-[0.2em] text-center">
                    <span>GÜVENLİ GİRİŞ</span>
                    <span>•</span>
                    <span>HIZLI ERİŞİM</span>
                </div>
            </motion.div>
        </div>
    );
}
