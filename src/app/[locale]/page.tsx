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
  Github,
  Instagram,
  Send,
  Search,
  Check,
  ChevronDown,
  Mail,
  Smartphone,
  Server,
  Download,
  Terminal,
  Clock,
  Briefcase,
  RefreshCw,
  Bot,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/blogs?active=true').then(res => res.json()).then(data => setBlogs(data.slice(0, 3)));
    fetch('/api/admin/pricing').then(res => res.json()).then(data => setPlans(data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-blue-500/30">

      {/* Moving Beta Bar */}
      <div className="bg-[#0f172a] border-b border-blue-500/30 py-2 relative overflow-hidden h-10 flex items-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-12 font-bold text-[10px] tracking-[0.2em] text-blue-400 uppercase">
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> Gümrük AI Asistanı ENTERPRISE VERSİYON - Geleceğin Gümrükleme Teknolojisi</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> Yapay Zeka ile Gümrük Belgesi Analizi Şimdi Aktif</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> Gümrük AI Asistanı ENTERPRISE VERSİYON - Geleceğin Gümrükleme Teknolojisi</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> Yapay Zeka ile Gümrük Belgesi Analizi Şimdi Aktif</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-[100] bg-primary-dark/50 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/tr" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-accent-ai-blue rounded-xl flex items-center justify-center shadow-enterprise group-hover:scale-110 transition-transform duration-300">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white group-hover:text-accent-glow transition-colors">GÜMRÜK AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            <Link href="/" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all">Anasayfa</Link>
            <Link href="#features" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all">Yetenekler</Link>
            <Link href="#workflow" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all">Nasıl Çalışır?</Link>
            <Link href="#pricing" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all">Fiyatlandırma</Link>
            <Link href="/tr/blogs" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all">Haberler</Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/tr/login" className="px-6 py-2.5 bg-white/5 text-white rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Giriş</Link>
            <Link href="/tr/login" className="px-7 py-3 bg-accent-ai-blue text-white rounded-xl text-xs font-black uppercase tracking-widest hover:glow-blue hover:scale-105 active:scale-95 transition-all shadow-enterprise">Başla</Link>
          </div>

          <button className="lg:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-10 pb-4 lg:pt-16 lg:pb-8 overflow-hidden bg-grid-white min-h-[700px] flex flex-col justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-accent-ai-blue/10 blur-[130px] rounded-full opacity-60 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-ai-blue/10 border border-accent-ai-blue/20 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-accent-glow rounded-full animate-pulse shadow-[0_0_10px_rgba(0,174,239,0.8)]" />
              <span className="text-[10px] font-black text-accent-glow tracking-[0.2em] uppercase">GÜMRÜKLEMEDE OTONOM DÖNEM</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-5xl lg:text-[75px] font-black mb-6 leading-[0.95] tracking-tighter text-white"
            >
              Belgeleri Yükleyin. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-ai-blue via-accent-glow to-indigo-400 text-glow-blue">Yapay Zekâ Oluştursun.</span>
            </motion.h1>

            <p className="text-gray-400 text-base lg:text-lg max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
              Gümrük evraklarını saniyeler içinde analiz edin, <br className="hidden lg:block" />
              GTIP ve beyanname verilerini otomatik oluşturun.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/tr/login" className="group w-full sm:w-auto px-10 py-5 bg-accent-ai-blue text-white rounded-2xl text-base font-black flex items-center justify-center gap-3 hover:bg-accent-glow transition-all shadow-[0_20px_40px_-10px_rgba(0,174,239,0.4)] hover:glow-blue active:scale-95 uppercase tracking-widest">
                Şimdi Başla
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <button className="group w-full sm:w-auto px-10 py-5 glass rounded-2xl text-base font-black flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-white border-white/10 uppercase tracking-widest">
                Demo İzle
              </button>
            </div>
          </div>

          <div className="flex-1 w-full lg:w-auto relative scale-90 lg:scale-100">
            <AiDocumentPipelineVisual />
          </div>
        </div>

        <div className="container mx-auto px-6 mt-32 grid grid-cols-2 lg:grid-cols-4 gap-8 opacity-40">
          <PartnerLogo name="TIM" />
          <PartnerLogo name="UND" />
          <PartnerLogo name="MAERSK" />
          <PartnerLogo name="TÜRKLINE" />
        </div>
      </section>

      {/* Module 1: Trust Stats */}
      <section className="py-20 bg-slate-50 relative overflow-hidden border-y border-slate-200">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <TrustStat value="50M+" label="ANALİZ EDİLEN BELGE" />
            <TrustStat value="%99.8" label="DOĞRULUK ORANI" />
            <TrustStat value="2000+" label="KURUMSAL PARTNER" />
            <TrustStat value="24/7" label="OTONOM OPERASYON" />
          </div>
        </div>
      </section>

      {/* Module 2: Key Capabilities */}
      <section id="features" className="py-32 relative bg-slate-900/40">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-24 text-center lg:text-left mx-auto lg:mx-0">
            <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight tracking-tighter text-white">Öne Çıkan Özellikler</h2>
            <p className="text-gray-400 text-lg font-medium">Sadece belge tarama değil, akıllı bir veri işleme merkezi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bot className="w-8 h-8 text-blue-400" />}
              title="Akıllı GTİP Tespiti"
              desc="Ürün tanımlarından doğru GTİP kodlarını çıkarır ve gümrük birimi ile eşleştirir."
            />
            <FeatureCard
              icon={<Layers className="w-8 h-8 text-indigo-400" />}
              title="Çoklu Belge Analizi"
              desc="Fatura, Çeki Listesi ve ATR belgelerini aynı anda analiz ederek verileri çapraz doğrular."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-blue-300" />}
              title="Çok Dilli OCR"
              desc="Karmaşık dillerdeki faturaları dahi saniyeler içinde dijital tabloya dönüştürür."
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-blue-400" />}
              title="Toplu Beyanname Üretimi"
              desc="Yüzlerce kalemi tek seferde analiz ederek saniyeler içinde çıktı hazırlar."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8 text-blue-500" />}
              title="ERP Entegrasyonu"
              desc="Kullandığınız mevcut ERP ve Gümrük yazılımları ile tam entegre çalışabilir."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-emerald-400" />}
              title="Güvenli Veri İşleme"
              desc="256-bit şifreleme ve Cloud Security katmanları ile verileriniz %100 güvende."
            />
          </div>
        </div>
      </section>

      {/* Module 3: How it Works (Visual Steps) */}
      <section id="workflow" className="py-32 relative bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter text-slate-900">Nasıl Çalışır?</h2>
            <p className="text-slate-500 font-medium">Karmaşık süreçleri 3 basit adıma indirdik.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
            <div className="hidden lg:block absolute top-[48px] left-1/4 right-1/4 h-[1px] bg-slate-200" />

            <WorkflowStep
              number="01"
              title="Belge Yükle"
              desc="PDF, Image veya Scan dosyalarınızı sisteme sürükleyip bırakın."
              icon={<Download className="w-8 h-8" />}
            />
            <WorkflowStep
              number="02"
              title="AI OCR Analizi"
              desc="AI algoritmalarımız kalemleri, miktarları ve kodları saniyeler içinde ayrıştırır."
              icon={<RefreshCw className="w-8 h-8" />}
            />
            <WorkflowStep
              number="03"
              title="Beyanname Çıkışı"
              desc="Verileri Excel, XML veya PDF olarak dışa aktarın ya da ERP'nize gönderin."
              icon={<CheckCircle2 className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* Module 4: Pricing */}
      <section id="pricing" className="py-32 relative bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter text-slate-900">Fiyatlandırma</h2>
            <p className="text-slate-500 font-medium font-medium">Başlangıç maliyeti yok, sadece kullandığınız kredi kadar ödersiniz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <PriceCard title="Başlangıç" price="Ücretsiz" credits="5 Kredi" features={["AI Belge Analizi", "GTİP Belirleme", "E-Posta Desteği"]} cta="Hemen Başla" onClick={() => router.push('/tr/login')} />
            <PriceCard title="Profesyonel" price="₺2.450" credits="100 Kredi" features={["Toplu Belge İşleme", "XML/Bilge Çıktısı", "Öncelikli Destek"]} cta="Kredi Satın Al" highlight={true} onClick={() => router.push('/tr/login')} />
            <PriceCard title="Kurumsal" price="Özel" credits="Sınırsız" features={["Özel API Erişimi", "ERP Entegrasyonu", "7/24 Teknik Destek"]} cta="İletişime Geç" onClick={() => router.push('/tr/contact')} />
          </div>
        </div>
      </section>

      {/* Module 5: Testimonials */}
      <section className="py-24 relative overflow-hidden bg-slate-900">
        <div className="container mx-auto px-6 text-center z-10 relative">
          <Quote className="w-16 h-16 text-accent-ai-blue/20 mx-auto mb-12" />
          <p className="text-2xl lg:text-4xl font-bold italic leading-relaxed mb-12 text-slate-200 max-w-4xl mx-auto">
            "Gümrük AI sayesinde operasyon hızımız %400 arttı. Eskiden saatler süren büyük kalemli fatura girişleri artık sadece saniyeler alıyor."
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-accent-ai-blue/30" />
            <div className="text-left">
              <p className="font-black text-xl text-white">Ahmet Yılmaz</p>
              <p className="text-accent-ai-blue font-bold text-xs tracking-widest uppercase">Kıdemli Gümrük Müşaviri</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 6: FAQ */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl lg:text-5xl font-black mb-16 text-center tracking-tighter text-slate-900">Sıkça Sorulan Sorular</h2>
          <div className="space-y-4">
            <FaqItem id={0} active={activeFaq} setActive={setActiveFaq} question="Sistem hangi tür belgeleri destekliyor?" answer="PDF, JPG, PNG ve TIFF formatlarındaki tüm fatura, çeki listesi ve gümrük belgelerini analiz edebiliriz." />
            <FaqItem id={1} active={activeFaq} setActive={setActiveFaq} question="Veri güvenliğini nasıl sağlıyorsunuz?" answer="Tüm verileriniz 256-bit SSL şifreleme ile iletilir ve işleminiz bittikten sonra güvenli sunucularımızda saklanır." />
            <FaqItem id={2} active={activeFaq} setActive={setActiveFaq} question="Mevcut gümrük yazılımıma entegre olur mu?" answer="Evet, sistemimiz Bilge/V2 formatında XML çıktısı üretebilmektedir ve API üzerinden her türlü ERP ile konuşabilir." />
          </div>
        </div>
      </section>

      {/* Module 7: Blog Preview */}
      <section className="py-32 relative bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
              <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight tracking-tighter text-slate-900 uppercase">Teknoloji & Mevzuat</h2>
              <p className="text-slate-500 text-lg font-medium">Gümrük dünyasındaki son gelişmeler ve AI trendleri.</p>
            </div>
            <Link href="/tr/blogs" className="px-10 py-4 bg-white text-slate-900 text-sm font-black rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-all group shrink-0 mx-auto lg:mx-0 border border-slate-200 shadow-sm">
              TÜMÜNÜ GÖR <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-accent-ai-blue" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <Link key={blog.id} href={`/tr/blogs/${blog.slug}`} className="group bg-white rounded-[2.5rem] overflow-hidden hover:border-accent-ai-blue/50 hover:shadow-xl transition-all flex flex-col h-full border border-slate-100 shadow-sm">
                  <div className="h-56 bg-slate-50 flex items-center justify-center p-8 overflow-hidden">
                    <img src={blog.coverImage || "/blog-placeholder.jpg"} alt={blog.title} className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-bold mb-4 group-hover:text-accent-ai-blue transition-colors text-slate-900">{blog.title}</h4>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-3">{blog.excerpt}</p>
                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-bold">{new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span>
                      <div className="flex items-center gap-2 text-accent-ai-blue font-bold text-xs uppercase tracking-widest">
                        OKU <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <>
                <Link href="/tr/blogs" className="group bg-white rounded-[2.5rem] overflow-hidden hover:border-accent-ai-blue/50 hover:shadow-xl transition-all flex flex-col h-full border border-slate-100 shadow-sm">
                  <div className="h-56 bg-slate-50 flex items-center justify-center">
                    <FileSearch className="w-16 h-16 text-accent-ai-blue" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-bold mb-4 group-hover:text-accent-ai-blue transition-colors text-slate-900">2025 Gümrük Yönetmeliği Değişiklikleri</h4>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">Yeni yılda yürürlüğe giren gümrük mevzuatı değişikliklerini ve dijitalleşme adımlarını detaylı olarak inceleyin...</p>
                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-bold">15 Ocak 2025</span>
                      <div className="flex items-center gap-2 text-accent-ai-blue font-bold text-xs uppercase tracking-widest">
                        OKU <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
                <Link href="/tr/blogs" className="group bg-white rounded-[2.5rem] overflow-hidden hover:border-accent-ai-blue/50 hover:shadow-xl transition-all flex flex-col h-full border border-slate-100 shadow-sm">
                  <div className="h-56 bg-slate-50 flex items-center justify-center">
                    <Bot className="w-16 h-16 text-indigo-500" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-bold mb-4 group-hover:text-accent-ai-blue transition-colors text-slate-900">Yapay Zeka ile GTİP Belirleme</h4>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">AI algoritmaları ürün tanımlarından GTİP kodunu nasıl çıkarıyor? Teknik detaylar ve analizler...</p>
                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-bold">22 Ocak 2025</span>
                      <div className="flex items-center gap-2 text-accent-ai-blue font-bold text-xs uppercase tracking-widest">
                        OKU <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
                <Link href="/tr/blogs" className="group bg-white rounded-[2.5rem] overflow-hidden hover:border-accent-ai-blue/50 hover:shadow-xl transition-all flex flex-col h-full border border-slate-100 shadow-sm">
                  <div className="h-56 bg-slate-50 flex items-center justify-center">
                    <Briefcase className="w-16 h-16 text-blue-400" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-bold mb-4 group-hover:text-accent-ai-blue transition-colors text-slate-900">Manuel Veri Girişinde Zaman Kaybı</h4>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">Sektör araştırması: Gümrük operasyonlarında dijital dönüşümün önündeki engeller ve çözüm yolları...</p>
                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-bold">5 Şubat 2025</span>
                      <div className="flex items-center gap-2 text-accent-ai-blue font-bold text-xs uppercase tracking-widest">
                        OKU <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Module 8: Final CTA */}
      <section className="py-40 relative overflow-hidden bg-slate-900">
        {/* Glow Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-accent-ai-blue/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-5xl lg:text-[7rem] font-black tracking-tighter text-white leading-none">Dijital Dönüşüm İçin Beklemeyin.</h2>
            <p className="text-slate-300 text-xl font-medium">Hemen ücretsiz üyeliğinizi oluşturun ve otonom gümrükleme deneyimine başlayın.</p>

            <div className="pt-10 flex flex-col items-center justify-center gap-12">
              <Link href="/tr/login" className="px-16 py-8 bg-accent-ai-blue text-white text-xl font-black rounded-[2.5rem] hover:glow-blue hover:scale-105 transition-all active:scale-95 shadow-2xl uppercase tracking-wider">
                Hemen ÜCRETSİZ Başla
              </Link>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 opacity-60">
                <TrustBadge icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />} text="256-BIT ENCRYPTION" />
                <TrustBadge icon={<Globe className="w-4 h-4 text-accent-ai-blue" />} text="CLOUD SECURITY" />
                <TrustBadge icon={<CheckCircle2 className="w-4 h-4 text-accent-glow" />} text="ISO 27001 COMPLIANT" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-primary-dark border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-[500px] bg-accent-ai-blue/5 blur-[150px] -z-10" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
            <div className="col-span-2 lg:col-span-1 space-y-8">
              <Link href="/tr" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-ai-blue rounded-xl flex items-center justify-center shadow-enterprise">
                  <FileSearch className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter text-white">GÜMRÜK AI</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Yapay zeka gücüyle gümrükleme süreçlerini otonomlaştırıyoruz. Geleceğin dış ticaretini bugünden inşa edin.
              </p>
              <div className="flex gap-4">
                <SocialButton icon={<Github className="w-5 h-5" />} />
                <SocialButton icon={<Twitter className="w-5 h-5" />} />
                <SocialButton icon={<Linkedin className="w-5 h-5" />} />
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Şirket</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">Hakkımızda</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">Kariyer</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">Basın Kiti</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">İletişim</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Ürünler</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">AI Analiz</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">GTİP Sorgulama</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">ERP Entegrasyonu</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">Özel Çözümler</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Kaynaklar</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">Dökümantasyon</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">API Referansı</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">Topluluk</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Yasal</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">KVKK Aydınlatma</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">Kullanım Koşulları</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">Çerez Politikası</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-accent-glow text-sm transition-colors">Güvenlik</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-500 text-xs font-medium">
              © 2026 Gümrük AI. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                SİSTEMLER AKTİF
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                ISTANBUL, TR
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- ENTERPRISE COMPONENTS ---

function AiDocumentPipelineVisual() {
  const docs = [
    { name: 'Ticari_Fatura.pdf', icon: <FileText className="w-5 h-5" />, color: 'text-accent-glow', pos: 'top-0 left-0', delay: 0 },
    { name: 'Ceki_Listesi.xlsx', icon: <Layers className="w-5 h-5" />, color: 'text-indigo-400', pos: 'top-16 -left-12', delay: 1 },
    { name: 'A.TR_Belgesi.pdf', icon: <Zap className="w-5 h-5" />, color: 'text-amber-400', pos: 'bottom-40 -left-16', delay: 2 },
    { name: 'Ordino_Belgesi.pdf', icon: <FileSearch className="w-5 h-5" />, color: 'text-emerald-400', pos: 'bottom-10 left-0', delay: 3 },
  ];

  return (
    <div className="relative w-full max-w-xl aspect-square mx-auto">
      <div className="absolute inset-0 bg-accent-glow/5 blur-[150px] rounded-full animate-pulse" />

      {/* Central Processing Sphere */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 m-auto w-64 h-64 rounded-full border border-accent-ai-blue/30 flex items-center justify-center bg-white/5 shadow-[0_0_80px_rgba(56,189,248,0.2)] z-20"
      >
        <div className="w-48 h-48 rounded-full border-t-2 border-accent-glow animate-spin" />
        <Bot className="absolute w-16 h-16 text-accent-glow" />
      </motion.div>

      {/* Floating Document Cards & Arrows */}
      {docs.map((doc, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -10, 0],
            x: [0, 5, 0]
          }}
          transition={{
            duration: 4 + idx,
            repeat: Infinity,
            delay: doc.delay,
            opacity: { duration: 0.5, delay: doc.delay }
          }}
          className={`absolute ${doc.pos} glass p-4 rounded-xl shadow-enterprise border-accent-ai-blue/20 z-30 flex items-center gap-3`}
        >
          <div className={doc.color}>{doc.icon}</div>
          <span className="text-[10px] font-data text-white font-bold whitespace-nowrap">{doc.name}</span>

          {/* Connection Lines targeted to center */}
          <div className="absolute top-1/2 left-full w-24 h-px bg-gradient-to-r from-accent-ai-blue/50 to-transparent origin-left -z-10 pointer-events-none overflow-visible">
            <motion.div
              animate={{ x: [0, 100] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: doc.delay }}
              className="w-2 h-2 bg-accent-glow rounded-full blur-[2px]"
            />
          </div>
        </motion.div>
      ))}

      <AiStatusBox />
    </div>
  );
}

function AiStatusBox() {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="absolute top-20 -right-4 lg:-right-16 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-accent-ai-blue/30 shadow-2xl w-80 animate-float z-40"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
          <span className="text-[12px] font-black tracking-widest text-slate-900">BEYANNAME HAZIR</span>
        </div>
        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-3 text-xs font-data py-4 border-b border-slate-100">
          <span className="text-accent-ai-blue font-bold">8471.30</span>
          <span className="text-slate-900 truncate px-1">Dizüstü Bilg.</span>
          <span className="text-slate-900 text-right font-bold">$120.400</span>
        </div>
        <div className="grid grid-cols-3 text-xs font-data py-4 border-b border-slate-100">
          <span className="text-accent-ai-blue font-bold">8504.40</span>
          <span className="text-slate-900 truncate px-1">Güç Adaptörü</span>
          <span className="text-slate-900 text-right font-bold">$12.200</span>
        </div>
        <div className="pt-6 flex justify-between items-center">
          <span className="text-xs text-slate-500 font-medium">Doğruluk Oranı</span>
          <span className="text-lg font-black text-accent-ai-blue tracking-tighter">%99.8</span>
        </div>
        <div className="flex gap-4 pt-4">
          {["XML", "PDF", "ERP"].map(type => (
            <div key={type} className="flex-1 py-3 rounded-2xl bg-slate-50 text-[11px] font-black text-center border border-slate-200 text-slate-900 hover:bg-accent-ai-blue/5 cursor-pointer transition-colors uppercase tracking-widest">
              {type}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PartnerLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center grayscale hover:grayscale-0 opacity-20 hover:opacity-100 transition-all cursor-crosshair">
      <span className="text-xl font-black text-slate-400 hover:text-slate-900 tracking-widest uppercase">{name}</span>
    </div>
  );
}

function TrustBadge({ text, icon }: { text: string; icon: any }) {
  return (
    <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:border-accent-ai-blue/30 transition-colors">
      <div className="text-accent-ai-blue">{icon}</div>
      <span className="text-[10px] font-black tracking-[0.1em] text-white/60 uppercase">{text}</span>
    </div>
  );
}

function TrustStat({ value, label }: any) {
  return (
    <div className="space-y-3 group cursor-default">
      <p className="text-4xl lg:text-5xl font-black text-slate-900 group-hover:text-accent-ai-blue transition-colors">{value}</p>
      <div className="w-12 h-1 bg-accent-ai-blue/30 mx-auto rounded-full group-hover:w-20 transition-all" />
      <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-10 bg-white rounded-[2rem] border border-slate-200 hover:border-accent-ai-blue/40 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
        <div className="w-32 h-32 bg-accent-ai-blue rounded-full blur-[60px]" />
      </div>
      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-accent-ai-blue/10 transition-all duration-500">
        <div className="text-accent-ai-blue transition-colors">{icon}</div>
      </div>
      <h3 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-accent-ai-blue transition-colors">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function WorkflowStep({ number, title, desc, icon }: any) {
  return (
    <div className="relative z-10 text-center space-y-8 group">
      <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto relative group hover:border-accent-ai-blue hover:shadow-xl transition-all border border-slate-200">
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent-ai-blue rounded-full flex items-center justify-center text-xs font-black shadow-lg text-white">{number}</div>
        <div className="text-accent-ai-blue transition-colors scale-125">{icon}</div>
      </div>
      <div className="space-y-4">
        <h4 className="text-2xl font-black text-slate-900 group-hover:text-accent-ai-blue transition-colors">{title}</h4>
        <p className="text-slate-500 font-medium leading-relaxed px-6">{desc}</p>
      </div>
    </div>
  );
}

function PriceCard({ title, price, credits, features, cta, highlight, onClick }: any) {
  return (
    <div className={`p-10 lg:p-14 rounded-[2.5rem] border ${highlight ? 'bg-white border-accent-ai-blue shadow-2xl scale-105' : 'bg-slate-50 border-slate-200'} flex flex-col relative transition-all hover:translate-y-[-8px]`}>
      {highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-accent-ai-blue text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] whitespace-nowrap shadow-xl">En Çok Tercih Edilen</div>}
      <h3 className={`text-xl font-black mb-2 ${highlight ? 'text-accent-ai-blue' : 'text-slate-500'}`}>{title}</h3>
      <div className="flex items-baseline gap-2 mb-10">
        <span className="text-5xl font-black text-slate-900">{price}</span>
        {price !== 'Özel' && price !== 'Ücretsiz' && <span className={`text-xs font-bold ${highlight ? 'text-slate-400' : 'text-slate-400'}`}>/Paket</span>}
      </div>
      <div className={`p-8 rounded-2xl mb-12 ${highlight ? 'bg-accent-ai-blue/5' : 'bg-white border border-slate-100'}`}>
        <p className={`text-[9px] font-black tracking-[0.2em] uppercase mb-2 ${highlight ? 'text-accent-ai-blue' : 'text-slate-400'}`}>İŞLEM HACMİ</p>
        <p className="text-3xl font-black text-slate-900 font-data">{credits}</p>
      </div>
      <ul className="space-y-6 mb-16 flex-1">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-4 text-sm font-bold">
            <CheckCircle2 className={`w-5 h-5 ${highlight ? 'text-accent-ai-blue' : 'text-emerald-500'}`} />
            <span className="text-slate-600">{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95 ${highlight ? 'bg-accent-ai-blue text-white hover:bg-accent-glow shadow-xl' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
      >
        {cta}
      </button>
    </div>
  );
}

function FaqItem({ id, active, setActive, question, answer }: any) {
  const isOpen = active === id;
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? 'bg-slate-50 border-accent-ai-blue/30' : 'bg-white border-slate-200'}`}>
      <button
        onClick={() => setActive(isOpen ? null : id)}
        className="w-full p-8 flex items-center justify-between text-left hover:bg-slate-50 transition-all text-slate-900"
      >
        <span className="text-lg font-black">{question}</span>
        <ChevronDown className={`w-6 h-6 text-accent-ai-blue transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-8 pb-8 text-slate-500 font-medium leading-relaxed"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SocialButton({ icon }: any) {
  return (
    <button className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-accent-ai-blue hover:text-white transition-all shadow-xl hover:-translate-y-1">
      {icon}
    </button>
  );
}

