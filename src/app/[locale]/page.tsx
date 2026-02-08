'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSearch,
  ShieldCheck,
  Zap,
  ChevronRight,
  CheckCircle2,
  Globe,
  ArrowRight,
  Menu,
  X,
  FileText,
  Star,
  Quote,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Send
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/blogs?active=true').then(res => res.json()).then(data => setBlogs(data.slice(0, 3)));
    fetch('/api/admin/pages?active=true').then(res => res.json()).then(data => setPages(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden selection:bg-blue-500/30">

      {/* Moving Beta Bar */}
      <div className="bg-blue-600/10 border-b border-blue-500/20 py-2 relative overflow-hidden h-10 flex items-center">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-12 font-bold text-[10px] tracking-[0.2em] text-blue-400 uppercase">
          <span>⚡ Gümrük AI Asistanı BETA VERSİYON - Deneyiminizi iyileştirmemize yardımcı olun ⚡</span>
          <span>⚡ Yapay Zeka ile Gümrük Belgesi Analizi Şimdi Aktif ⚡</span>
          <span>⚡ Gümrük AI Asistanı BETA VERSİYON - Deneyiminizi iyileştirmemize yardımcı olun ⚡</span>
          <span>⚡ Yapay Zeka ile Gümrük Belgesi Analizi Şimdi Aktif ⚡</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-[100] bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/tr" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">GÜMRÜK AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/tr" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Anasayfa</Link>
            <Link href="#features" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Özellikler</Link>
            <Link href="#blogs" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Bloglarımız</Link>
            <Link href="/tr/contact" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">İletişim</Link>
            <Link href="/tr/login" className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">Giriş Yap</Link>
            <Link href="/tr/login" className="px-6 py-2.5 bg-blue-600 rounded-xl text-sm font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all active:scale-95">Ücretsiz Başla</Link>
          </div>

          <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full opacity-30 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs font-black text-blue-400 tracking-widest uppercase">GELECEĞİN GÜMRÜKLEME SİSTEMİ</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tighter"
          >
            Gümrük Belgeleri <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Yapay Zeka ile Analiz Edilsin</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Fatura, Ordino, Çeki Listesi ve ATR belgelerinizi saniyeler içinde analiz edin.
            GTİP kodlarını çıkarın, kalem verilerini dijitalleştirin ve hataları minimize edin.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/tr/login" className="group w-full sm:w-auto px-10 py-5 bg-blue-600 rounded-[2rem] text-lg font-black flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 active:scale-95">
              Hemen Dene
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <div className="flex items-center gap-4 px-6 text-gray-500 font-bold">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#030712] bg-gray-800" />
                ))}
              </div>
              <span className="text-sm">500+ Müşavir Kullanıyor</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="py-32 bg-white/5 relative">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-16 gap-4">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black mb-4">Bloglarımız</h2>
              <p className="text-gray-400 font-medium">Sektördeki yenilikleri ve gümrük dünyasını takip edin.</p>
            </div>
            <Link href="/tr/blogs" className="hidden sm:flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Tümünü Gör <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
              <Link key={idx} href={`/tr/blog/${blog.slug}`} className="group relative bg-[#0a0f1d] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all h-full flex flex-col">
                <div className="h-56 bg-gray-800 overflow-hidden relative">
                  {blog.image ? (
                    <img src={blog.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpenIcon className="w-12 h-12 text-white/10" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl">
                    SEKTÖR HABERİ
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h4 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors leading-snug">{blog.title}</h4>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-3">{blog.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-xs text-gray-500 font-bold">{new Date().toLocaleDateString('tr-TR')}</span>
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                      OKU <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {blogs.length === 0 && (
              <div className="col-span-3 text-center py-20 text-gray-600 font-bold italic tracking-wide">Henüz blog yazısı eklenmemiş.</div>
            )}
          </div>
        </div>
      </section>

      {/* Footer - Professional Implementation */}
      <footer className="pt-32 pb-12 bg-[#020617] relative border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">

            {/* Brand Col */}
            <div className="lg:col-span-2 space-y-8">
              <Link href="/tr" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/20">
                  <FileSearch className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">GÜMRÜK AI</span>
              </Link>
              <p className="text-gray-400 leading-relaxed max-w-sm font-medium">
                Gümrük müşavirliği süreçlerini yapay zeka ile dijitalleştiriyoruz.
                Verimliliğinizi artırın, hataları sıfırlayın.
              </p>
              <div className="flex items-center gap-4">
                <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
                <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="#" />
                <SocialIcon icon={<Facebook className="w-5 h-5" />} href="#" />
                <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
              </div>
            </div>

            {/* Links Col 1 - Sayfalar */}
            <div className="space-y-8">
              <h4 className="text-sm font-black text-white tracking-widest uppercase">KURUMSAL</h4>
              <ul className="space-y-4">
                <li><Link href="/tr" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Anasayfa</Link></li>
                <li><Link href="/tr/blogs" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Bloglarımız</Link></li>
                <li><Link href="/tr/contact" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">İletişim</Link></li>
              </ul>
            </div>

            {/* Links Col 2 - Hukuki */}
            <div className="space-y-8">
              <h4 className="text-sm font-black text-white tracking-widest uppercase">HUKUKİ</h4>
              <ul className="space-y-4">
                {pages.map((p, idx) => (
                  <li key={idx}><Link href={`/tr/p/${p.slug}`} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{p.title}</Link></li>
                ))}
                {pages.length === 0 && (
                  <>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Gizlilik Politikası</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">KVKK Aydınlatma Metni</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Kullanım Şartları</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Links Col 3 - Abone */}
            <div className="space-y-8">
              <h4 className="text-sm font-black text-white tracking-widest uppercase">BÜLTEN</h4>
              <p className="text-gray-400 text-xs font-medium leading-relaxed">Yeni güncellemelerden anında haberdar olun.</p>
              <div className="relative">
                <input type="email" placeholder="E-posta" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-gray-600 font-bold tracking-widest">© 2026 GÜMRÜK AI ASİSTANI. TÜM HAKLARI SAKLIDIR.</p>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-gray-400">SERVER STATUS: OPTIMAL</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

function SocialIcon({ icon, href }: { icon: any, href: string }) {
  return (
    <Link href={href} className="w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all">
      {icon}
    </Link>
  );
}

function BookOpenIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
