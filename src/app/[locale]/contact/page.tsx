'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, ShieldCheck, FileSearch, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) setSubmitted(true);
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center">
            {/* Nav */}
            <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                    <Link href="/tr" className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <FileSearch className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900">GÜMRÜK.AI</span>
                    </Link>
                    <Link href="/tr" className="text-sm font-black text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2">
                        Ana Sayfa <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </nav>

            <main className="w-full py-24 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none -ml-32 -mb-32" />

                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">

                        {/* Left Side: Content */}
                        <div className="space-y-16">
                            <div className="space-y-6">
                                <span className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">İletişim</span>
                                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">Size Nasıl <br /><span className="text-blue-600">Yardımcı</span> Olabiliriz?</h1>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">
                                    Sorularınız, teknik destek talepleriniz veya iş birliği fırsatları için ekibimiz sizinle tanışmayı bekliyor.
                                </p>
                            </div>

                            <div className="space-y-10">
                                <ContactItem
                                    icon={<Mail className="w-6 h-6 text-blue-600" />}
                                    label="E-posta"
                                    value="destek@gumrukai.com"
                                    desc="7/24 Teknik Destek Hattı"
                                />
                                <ContactItem
                                    icon={<Phone className="w-6 h-6 text-indigo-600" />}
                                    label="Telefon"
                                    value="+90 (212) 123 45 67"
                                    desc="Hafta içi 09:00 - 18:00"
                                />
                                <ContactItem
                                    icon={<MapPin className="w-6 h-6 text-slate-600" />}
                                    label="Adres"
                                    value="Maslak Plazalar, No:123"
                                    desc="Sarıyer / İstanbul"
                                />
                            </div>

                            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-slate-900/20 flex items-center gap-8 group">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-9 h-9 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-black text-white text-xs tracking-widest uppercase mb-1">Veri Güvenliği</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium">İletişiminiz KVKK kapsamında %100 uçtan uca şifrelenir ve korunur.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="bg-white p-12 lg:p-16 rounded-[4rem] shadow-2xl shadow-slate-300/50 border border-slate-100/50 relative">
                            {submitted ? (
                                <div className="text-center py-20 animate-in zoom-in-95 duration-500">
                                    <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Mesajınız Ulaştı!</h2>
                                    <p className="text-slate-500 font-medium text-lg">Ekibimiz başvurunuzu aldı. En kısa sürede size geri dönüş yapacağız.</p>
                                    <button onClick={() => setSubmitted(false)} className="mt-12 text-blue-600 font-black flex items-center gap-2 mx-auto hover:underline uppercase text-xs tracking-widest">
                                        Yeni Mesaj Gönder <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-4">Adınız Soyadınız</label>
                                            <input required name="name" type="text" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] py-5 px-8 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 shadow-inner" placeholder="Örn: Mehmet Yılmaz" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-4">E-posta</label>
                                            <input required name="email" type="email" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] py-5 px-8 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 shadow-inner" placeholder="mehmet@sirket.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-4">Konu Başlığı</label>
                                        <input required name="subject" type="text" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] py-5 px-8 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 shadow-inner" placeholder="Destek, Fiyatlandırma, Geri Bildirim vb." />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-4">Mesajınız</label>
                                        <textarea required name="message" rows={5} className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] py-5 px-8 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 shadow-inner resize-none" placeholder="Size nasıl yardımcı olabiliriz?"></textarea>
                                    </div>
                                    <button type="submit" className="w-full py-6 bg-blue-600 hover:bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-4 group">
                                        Mesajı Gönder
                                        <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-slate-100 w-full text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">© 2026 GÜMRÜK.AI - TÜM HAKLARI SAKLIDIR</p>
            </footer>
        </div>
    );
}

function ContactItem({ icon, label, value, desc }: any) {
    return (
        <div className="flex items-start gap-8 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-slate-200/50 border border-slate-50 group-hover:border-blue-500 transition-all duration-500">
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-xl font-black text-slate-800">{value}</p>
                <p className="text-sm font-medium text-slate-500">{desc}</p>
            </div>
        </div>
    );
}

