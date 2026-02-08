'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, ShieldCheck, FileSearch } from 'lucide-react';
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
        <div className="min-h-screen bg-[#030712] text-white">
            {/* Small Header for pages */}
            <nav className="border-b border-white/5 bg-[#030712]/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/tr" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <FileSearch className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight">GÜMRÜK AI</span>
                    </Link>
                    <Link href="/tr" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Ana Sayfaya Dön</Link>
                </div>
            </nav>

            <main className="py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                            {/* Contact Info */}
                            <div className="space-y-12">
                                <div>
                                    <h1 className="text-5xl lg:text-6xl font-black mb-6 tracking-tighter">Bize Ulaşın</h1>
                                    <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                        Sorularınız, iş birliği talepleriniz veya teknik destek için ekibimizle iletişime geçebilirsiniz.
                                        En geç 24 saat içinde dönüş sağlıyoruz.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <ContactItem
                                        icon={<Mail className="w-6 h-6 text-blue-400" />}
                                        label="E-Posta"
                                        value="destek@gumrukai.com"
                                        sub="7/24 Teknik Destek"
                                    />
                                    <ContactItem
                                        icon={<Phone className="w-6 h-6 text-purple-400" />}
                                        label="Telefon"
                                        value="+90 (212) 123 45 67"
                                        sub="Hafta içi 09:00 - 18:00"
                                    />
                                    <ContactItem
                                        icon={<MapPin className="w-6 h-6 text-pink-400" />}
                                        label="Adres"
                                        value="Maslak Plazalar, No:123 İç Kapı:4 Kat:12 Sarıyer/İstanbul"
                                        sub="Genel Merkez"
                                    />
                                </div>

                                <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] flex items-center gap-6">
                                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white uppercase text-xs tracking-widest mb-1">Güvenilir İletişim</h4>
                                        <p className="text-gray-400 text-sm">Verileriniz KVKK kapsamında korunmakta ve şifrelenmektedir.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="bg-[#0a0f1d] border border-white/5 p-10 lg:p-16 rounded-[3rem] shadow-2xl relative">
                                {submitted ? (
                                    <div className="text-center py-20 animate-in zoom-in-95 duration-500">
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h2 className="text-3xl font-black mb-4">Mesajınız Alındı!</h2>
                                        <p className="text-gray-400 font-medium">Ekibimiz en kısa sürede sizinle iletişime geçecektir. İlginiz için teşekkür ederiz.</p>
                                        <button onClick={() => setSubmitted(false)} className="mt-10 text-blue-400 font-bold underline hover:text-blue-300">Yeni Mesaj Gönder</button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">ADINIZ SOYADINIZ</label>
                                                <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="John Doe" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">E-POSTA ADRESİNİZ</label>
                                                <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="john@example.com" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">KONU</label>
                                            <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Destek talebi, İş birliği vb." />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">MESAJINIZ</label>
                                            <textarea required rows={6} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none" placeholder="Size nasıl yardımcı olabiliriz?"></textarea>
                                        </div>
                                        <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-4">
                                            Mesajı Gönder
                                            <Send className="w-6 h-6" />
                                        </button>
                                    </form>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Copy */}
            <footer className="py-12 border-t border-white/5 text-center text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">
                © 2026 GÜMRÜK AI ASİSTANI - GÜVENLİ İLETİŞİM PLATFORMU
            </footer>
        </div>
    );
}

function ContactItem({ icon, label, value, sub }: any) {
    return (
        <div className="flex items-start gap-6 group">
            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:border-blue-600">
                {icon}
            </div>
            <div>
                <h5 className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-1">{label}</h5>
                <p className="text-xl font-bold text-white mb-1">{value}</p>
                <p className="text-sm text-gray-500 font-medium">{sub}</p>
            </div>
        </div>
    );
}
