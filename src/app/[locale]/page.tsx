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
      <nav className="sticky top-0 z-[100] bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/tr" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)] group-hover:scale-110 transition-transform duration-300">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white group-hover:text-blue-400 transition-colors">GÜMRÜK AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            <Link href="/" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all">Anasayfa</Link>
            <Link href="#features" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all">Yetenekler</Link>
            <Link href="#workflow" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all">Nasıl Çalışır?</Link>
            <Link href="#pricing" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all">Fiyatlandırma</Link>
            <Link href="/tr/blogs" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all">Haberler</Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/tr/login" className="px-6 py-2.5 bg-white/5 text-white rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Giriş</Link>
            <Link href="/tr/login" className="px-7 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:glow-blue hover:scale-105 active:scale-95 transition-all">Başla</Link>
          </div>

          <button className="lg:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-grid-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-blue-600/10 blur-[130px] rounded-full opacity-60 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-10"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <span className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase">GÜMRÜKLEMEDE OTONOM DÖNEM</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-6xl lg:text-[90px] font-black mb-10 leading-[0.95] tracking-tighter text-white"
            >
              Belgeleri Yükleyin. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 text-glow-blue">Yapay Zekâ Oluştursun.</span>
            </motion.h1>

            <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 mb-16 leading-relaxed font-medium">
              Gümrük evraklarını saniyeler içinde analiz edin, <br className="hidden lg:block" />
              GTIP ve beyanname verilerini otomatik oluşturun.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <Link href="/tr/login" className="group w-full sm:w-auto px-12 py-6 bg-blue-600 text-white rounded-[2rem] text-lg font-black flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:glow-blue active:scale-95">
                Belge Analizine Başla
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <button className="group w-full sm:w-auto px-12 py-6 glass rounded-[2rem] text-lg font-black flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-white border-white/10">
                <Clock className="w-6 h-6 text-blue-400" /> Demo İzle
              </button>
            </div>
          </div>

          <div className="flex-1 w-full lg:w-auto relative flex justify-center items-center">
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full border border-blue-500/20" />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10 w-full h-full flex items-center justify-center"
              >
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/big-data-3462310-2895995.png" alt="AI Core" className="w-[80%] h-auto drop-shadow-[0_0_50px_rgba(59,130,246,0.3)] opacity-80" />
              </motion.div>

              <AiStatusBox />
            </div>
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
      <section className="py-20 border-y border-white/5 bg-blue-600/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <TrustStat value="50M+" label="ANALYSED DOCUMENTS" />
            <TrustStat value="%99.8" label="ACCURACY RATE" />
            <TrustStat value="2000+" label="ENTERPRISE CLIENTS" />
            <TrustStat value="24/7" label="AUTONOMOUS OPERATIONS" />
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
      <section id="workflow" className="py-32 relative bg-slate-950">
        <div className="absolute inset-0 bg-blue-600/5 bg-grid-white pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter text-white">Nasıl Çalışır?</h2>
            <p className="text-gray-400 font-medium">Karmaşık süreçleri 3 basit adıma indirdik.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
            <div className="hidden lg:block absolute top-[40px] left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-blue-600/0 via-blue-600/50 to-blue-600/0" />

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
      <section id="pricing" className="py-32 relative bg-slate-900/40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter text-white">Fiyatlandırma</h2>
            <p className="text-gray-400 font-medium">Başlangıç maliyeti yok, sadece kullandığınız kredi kadar ödersiniz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <PriceCard title="Başlangıç" price="Ücretsiz" credits="5 Kredi" features={["AI Belge Analizi", "GTİP Belirleme", "E-Posta Desteği"]} cta="Hemen Başla" onClick={() => router.push('/tr/login')} />
            <PriceCard title="Profesyonel" price="₺2.450" credits="100 Kredi" features={["Toplu Belge İşleme", "XML/Bilge Çıktısı", "Öncelikli Destek"]} cta="Kredi Satın Al" highlight={true} onClick={() => router.push('/tr/login')} />
            <PriceCard title="Kurumsal" price="Özel" credits="Sınırsız" features={["Özel API Erişimi", "ERP Entegrasyonu", "7/24 Teknik Destek"]} cta="İletişime Geç" onClick={() => router.push('/tr/contact')} />
          </div>
        </div>
      </section>

      {/* Module 5: Testimonials */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center z-10 relative">
          <Quote className="w-16 h-16 text-blue-600/20 mx-auto mb-12" />
          <p className="text-2xl lg:text-4xl font-bold italic leading-relaxed mb-12 text-gray-300 max-w-4xl mx-auto">
            "Gümrük AI sayesinde operasyon hızımız %400 arttı. Eskiden saatler süren büyük kalemli fatura girişleri artık sadece saniyeler alıyor."
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-blue-500/30" />
            <div className="text-left">
              <p className="font-black text-xl text-white">Ahmet Yılmaz</p>
              <p className="text-blue-500 font-bold text-xs tracking-widest uppercase">Kıdemli Gümrük Müşaviri</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 6: FAQ */}
      <section className="py-32 bg-slate-900/40">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl lg:text-5xl font-black mb-16 text-center tracking-tighter text-white">Sıkça Sorulan Sorular</h2>
          <div className="space-y-4">
            <FaqItem id={0} active={activeFaq} setActive={setActiveFaq} question="Sistem hangi tür belgeleri destekliyor?" answer="PDF, JPG, PNG ve TIFF formatlarındaki tüm fatura, çeki listesi ve gümrük belgelerini analiz edebiliriz." />
            <FaqItem id={1} active={activeFaq} setActive={setActiveFaq} question="Veri güvenliğini nasıl sağlıyorsunuz?" answer="Tüm verileriniz 256-bit SSL şifreleme ile iletilir ve işleminiz bittikten sonra güvenli sunucularımızda saklanır." />
            <FaqItem id={2} active={activeFaq} setActive={setActiveFaq} question="Mevcut gümrük yazılımıma entegre olur mu?" answer="Evet, sistemimiz Bilge/V2 formatında XML çıktısı üretebilmektedir ve API üzerinden her türlü ERP ile konuşabilir." />
          </div>
        </div>
      </section>

      {/* Module 7: Blog Preview */}
      <section className="py-32 relative bg-slate-950/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
              <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight tracking-tighter text-white uppercase">Teknoloji & Mevzuat</h2>
              <p className="text-gray-400 text-lg font-medium">Gümrük dünyasındaki son gelişmeler ve AI trendleri.</p>
            </div>
            <Link href="/tr/blogs" className="px-10 py-4 glass text-white text-sm font-black rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all group shrink-0 mx-auto lg:mx-0 border-white/10">
              TÜMÜNÜ GÖR <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-blue-500" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <Link key={blog.id} href={`/tr/blogs/${blog.slug}`} className="group glass rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 hover:shadow-xl transition-all flex flex-col h-full border-white/10">
                  <div className="h-56 bg-white/5 flex items-center justify-center p-8 overflow-hidden">
                    <img src={blog.coverImage || "/blog-placeholder.jpg"} alt={blog.title} className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors text-white">{blog.title}</h4>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-3">{blog.excerpt}</p>
                    <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-bold">{new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span>
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                        OKU <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <>
                <Link href="/tr/blogs" className="group glass rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 hover:shadow-xl transition-all flex flex-col h-full border-white/10">
                  <div className="h-56 bg-white/5 flex items-center justify-center">
                    <FileSearch className="w-16 h-16 text-blue-400" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors text-white">2025 Gümrük Yönetmeliği Değişiklikleri</h4>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">Yeni yılda yürürlüğe giren gümrük mevzuatı değişikliklerini ve dijitalleşme adımlarını detaylı olarak inceleyin...</p>
                    <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-bold">15 Ocak 2025</span>
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                        OKU <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
                <Link href="/tr/blogs" className="group glass rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 hover:shadow-xl transition-all flex flex-col h-full border-white/10">
                  <div className="h-56 bg-white/5 flex items-center justify-center">
                    <Bot className="w-16 h-16 text-indigo-400" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors text-white">Yapay Zeka ile GTİP Belirleme</h4>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">AI algoritmaları ürün tanımlarından GTİP kodunu nasıl çıkarıyor? Teknik detaylar ve analizler...</p>
                    <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-bold">22 Ocak 2025</span>
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                        OKU <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
                <Link href="/tr/blogs" className="group glass rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 hover:shadow-xl transition-all flex flex-col h-full border-white/10">
                  <div className="h-56 bg-white/5 flex items-center justify-center">
                    <Briefcase className="w-16 h-16 text-blue-300" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors text-white">Manuel Veri Girişinde Zaman Kaybı</h4>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">Sektör araştırması: Gümrük operasyonlarında dijital dönüşümün önündeki engeller ve çözüm yolları...</p>
                    <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-bold">5 Şubat 2025</span>
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
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
      <section className="py-40 relative overflow-hidden bg-slate-950">
        {/* Glow Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-5xl lg:text-[7rem] font-black tracking-tighter text-white leading-none">Dijital Dönüşüm İçin Beklemeyin.</h2>
            <p className="text-gray-400 text-xl font-medium">Hemen ücretsiz üyeliğinizi oluşturun ve otonom gümrükleme deneyimine başlayın.</p>

            <div className="pt-10 flex flex-col items-center justify-center gap-12">
              <Link href="/tr/login" className="px-16 py-8 bg-blue-600 text-white text-xl font-black rounded-[2.5rem] hover:glow-blue hover:scale-105 transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] uppercase tracking-wider">
                Hemen ÜCRETSİZ Başla
              </Link>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 opacity-60">
                <TrustBadge icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />} text="256-BIT ENCRYPTION" />
                <TrustBadge icon={<Globe className="w-4 h-4 text-blue-400" />} text="CLOUD SECURITY" />
                <TrustBadge icon={<CheckCircle2 className="w-4 h-4 text-blue-500" />} text="ISO 27001 COMPLIANT" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 bg-slate-950 relative border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-6">
              <Link href="/tr" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <FileSearch className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter text-white">GÜMRÜK AI</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">Yapay zeka gücüyle gümrük operasyonlarınızı modernize ederek hata payını sıfıra indirin.</p>
              <div className="flex items-center gap-4">
                <SocialButton icon={<Twitter className="w-4 h-4" />} />
                <SocialButton icon={<Linkedin className="w-4 h-4" />} />
                <SocialButton icon={<Facebook className="w-4 h-4" />} />
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-white/30">Hızlı Linkler</h4>
              <ul className="space-y-4">
                <li><Link href="/" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">Ana Sayfa</Link></li>
                <li><Link href="#features" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Yetenekler</Link></li>
                <li><Link href="/tr/blogs" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">Teknoloji Blog</Link></li>
                <li><Link href="/tr/contact" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">Destek Merkezin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-white/30">Hizmetlerimiz</h4>
              <ul className="space-y-4">
                <li className="text-sm font-bold text-gray-500 hover:text-blue-400 cursor-pointer">AI Belge Analizi</li>
                <li className="text-sm font-bold text-gray-500 hover:text-blue-400 cursor-pointer">Otomatik GTİP Tespiti</li>
                <li className="text-sm font-bold text-gray-500 hover:text-blue-400 cursor-pointer">Gümrük Mevzuat Asistanı</li>
                <li className="text-sm font-bold text-gray-500 hover:text-blue-400 cursor-pointer">XML Beyanname Çıktısı</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-white/30">İletişim</h4>
              <p className="text-sm font-bold text-gray-400 leading-relaxed mb-6">
                Sürecinizi hızlandırmak için <br />
                ekibimizle görüşün.
              </p>
              <Link href="/tr/contact" className="text-sm font-black text-blue-500 hover:text-blue-400 flex items-center gap-2">
                Bize Ulaşın <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-xs font-bold text-gray-600 tracking-wide uppercase">© 2024 GÜMRÜK AI TECHNOLOGY. TÜM HAKLARI SAKLIDIR.</p>
            <div className="flex items-center gap-8">
              <Link href="/privacy" className="text-[10px] font-black text-gray-600 hover:text-white transition-all">GİZLİLİK POLİTİKASI</Link>
              <Link href="/terms" className="text-[10px] font-black text-gray-600 hover:text-white transition-all">KULLANIM ŞARTLARI</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- ENTERPRISE COMPONENTS ---

function AiStatusBox() {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="absolute top-10 right-0 lg:-right-10 glass p-5 rounded-2xl border-white/20 shadow-2xl w-64 animate-float"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black tracking-widest text-slate-400">DECLARATION READY</span>
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-[11px]">
          <span className="text-blue-400 font-bold">8471</span>
          <span className="text-white">Laptop</span>
          <span className="text-white">120</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-blue-400 font-bold">8504</span>
          <span className="text-white">Adaptör</span>
          <span className="text-white">120</span>
        </div>
        <div className="pt-3 border-t border-white/10 flex justify-between items-center">
          <span className="text-[10px] text-slate-400">Confidence Score</span>
          <span className="text-xs font-black text-blue-400">%99.8</span>
        </div>
        <div className="flex gap-2 pt-2">
          <div className="flex-1 py-1 rounded bg-white/5 text-[9px] font-black text-center border border-white/10">XML</div>
          <div className="flex-1 py-1 rounded bg-white/5 text-[9px] font-black text-center border border-white/10">PDF</div>
          <div className="flex-1 py-1 rounded bg-white/5 text-[9px] font-black text-center border border-white/10">ERP</div>
        </div>
      </div>
    </motion.div>
  );
}

function PartnerLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all cursor-crosshair">
      <span className="text-xl font-black text-white tracking-widest">{name}</span>
    </div>
  );
}

function TrustBadge({ text, icon }: { text: string; icon: any }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
      {icon}
      <span className="text-[10px] font-black tracking-widest text-white/60 uppercase">{text}</span>
    </div>
  );
}

// ---------------------------------

function TrustStat({ value, label }: any) {
  return (
    <div className="space-y-2 group cursor-default">
      <p className="text-4xl lg:text-5xl font-black text-white group-hover:text-blue-500 transition-colors drop-shadow-sm">{value}</p>
      <p className="text-[10px] font-black text-blue-500 tracking-[0.2em] uppercase">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-10 glass rounded-[2.5rem] border-white/10 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
        <div className="w-32 h-32 bg-blue-500 rounded-full blur-[50px]" />
      </div>
      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:border-blue-500 transition-all">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-white group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-gray-400 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function WorkflowStep({ number, title, desc, icon }: any) {
  return (
    <div className="relative z-10 text-center space-y-6 group">
      <div className="w-20 h-20 glass rounded-[2rem] flex items-center justify-center mx-auto relative group hover:border-blue-500 hover:glow-blue hover:shadow-lg transition-all border-white/10">
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xs font-black shadow-lg text-white border-2 border-slate-900">{number}</div>
        <div className="text-blue-400">{icon}</div>
      </div>
      <h4 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">{title}</h4>
      <p className="text-gray-400 font-medium leading-relaxed px-4">{desc}</p>
    </div>
  );
}

function PriceCard({ title, price, credits, features, cta, highlight, onClick }: any) {
  return (
    <div className={`p-10 lg:p-12 rounded-[3.5rem] border ${highlight ? 'bg-blue-600 border-blue-400 scale-105 shadow-[0_30px_60px_-15px_rgba(59,130,246,0.4)]' : 'glass border-white/10'} flex flex-col relative transition-all hover:translate-y-[-5px]`}>
      {highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest whitespace-nowrap shadow-lg">En Çok Tercih Edilen</div>}
      <h3 className={`text-xl font-black mb-1 ${highlight ? 'text-blue-100' : 'text-slate-400'}`}>{title}</h3>
      <div className="flex items-baseline gap-2 mb-8">
        <span className={`text-4xl font-black ${highlight ? 'text-white' : 'text-white'}`}>{price}</span>
        {price !== 'Özel' && price !== 'Ücretsiz' && <span className={`text-xs font-bold ${highlight ? 'text-white/50' : 'text-gray-500'}`}>/Paket</span>}
      </div>
      <div className={`p-6 rounded-3xl mb-10 ${highlight ? 'bg-white/10' : 'bg-white/5 border border-white/10'}`}>
        <p className={`text-[9px] font-black tracking-widest uppercase mb-1 ${highlight ? 'text-white/70' : 'text-blue-400'}`}>İŞLEM HACMİ</p>
        <p className="text-2xl font-black text-white">{credits}</p>
      </div>
      <ul className="space-y-5 mb-12 flex-1">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm font-bold">
            <CheckCircle2 className={`w-5 h-5 ${highlight ? 'text-white' : 'text-blue-500'}`} />
            <span className={highlight ? 'text-white' : 'text-gray-300'}>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${highlight ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg' : 'bg-blue-600 text-white hover:bg-blue-500 hover:glow-blue shadow-lg shadow-blue-500/20'}`}
      >
        {cta}
      </button>
    </div>
  );
}

function FaqItem({ id, active, setActive, question, answer }: any) {
  const isOpen = active === id;
  return (
    <div className={`border rounded-3xl overflow-hidden transition-all ${isOpen ? 'glass border-blue-500/30' : 'bg-white/5 border-white/10'}`}>
      <button
        onClick={() => setActive(isOpen ? null : id)}
        className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-all text-white"
      >
        <span className="text-lg font-black">{question}</span>
        <ChevronDown className={`w-6 h-6 text-blue-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-8 pb-8 text-gray-400 font-medium leading-relaxed"
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
    <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
      {icon}
    </button>
  );
}

