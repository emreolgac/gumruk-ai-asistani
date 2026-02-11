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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-slate-900 font-sans overflow-x-hidden selection:bg-blue-500/30">

      {/* Moving Beta Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 border-b border-blue-700 py-2 relative overflow-hidden h-10 flex items-center">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-12 font-bold text-[10px] tracking-[0.2em] text-white uppercase">
          <span>⚡ Gümrük AI Asistanı BETA VERSİYON - Deneyiminizi iyileştirmemize yardımcı olun ⚡</span>
          <span>⚡ Yapay Zeka ile Gümrük Belgesi Analizi Şimdi Aktif ⚡</span>
          <span>⚡ Gümrük AI Asistanı BETA VERSİYON - Deneyiminizi iyileştirmemize yardımcı olun ⚡</span>
          <span>⚡ Yapay Zeka ile Gümrük Belgesi Analizi Şimdi Aktif ⚡</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/tr" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">GÜMRÜK AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            <Link href="/" className="text-[13px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-all">Anasayfa</Link>
            <Link href="#features" className="text-[13px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-all">Yetenekler</Link>
            <Link href="#workflow" className="text-[13px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-all">Nasıl Çalışır?</Link>
            <Link href="#pricing" className="text-[13px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-all">Fiyatlandırma</Link>
            <Link href="/tr/blogs" className="text-[13px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-all">Haberler</Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/tr/login" className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Giriş Yap</Link>
            <Link href="/tr/login" className="px-7 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/50 active:scale-95 transition-all">Ücretsiz Başla</Link>
          </div>

          <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-[130px] rounded-full opacity-60 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-10"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <span className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase">GÜMRÜKLEMEDE YAPAY ZEKA DEVRİMİ</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-6xl lg:text-[100px] font-black mb-10 leading-[0.95] tracking-tighter"
          >
            Gümrük Belgeleri <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">Otonom Hale Geliyor</span>
          </motion.h1>

          <p className="text-slate-600 text-lg lg:text-xl max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
            Fatura, Ordino ve Çeki Listelerini saniyeler içinde dijitalleştirin.
            Yapay zeka ile %99.8 doğruluk oranında veri çıkarımı sağlayın.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/tr/login" className="group w-full sm:w-auto px-12 py-6 bg-blue-600 rounded-[2rem] text-lg font-black flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 active:scale-95">
              Ücretsiz Deneyin
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link href="#features" className="group w-full sm:w-auto px-12 py-6 bg-white border-2 border-slate-300 rounded-[2rem] text-lg font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition-all text-slate-900">
              Sistemi Keşfet
            </Link>
          </div>
        </div>
      </section>

      {/* Module 1: Trust Stats */}
      <section className="py-12 border-y border-slate-200 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <TrustStat value="50M+" label="Analiz Edilen Belge" />
            <TrustStat value="%99.8" label="Doğruluk Oranı" />
            <TrustStat value="2000+" label="Aktif Müşavirlik" />
            <TrustStat value="24/7" label="Otonom Çalışma" />
          </div>
        </div>
      </section>

      {/* Module 2: Key Capabilities (Grid) */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-24">
            <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight tracking-tighter text-slate-900">İş Akışınızı Sıfır Hata ile Dijitalleştirin</h2>
            <p className="text-slate-600 text-lg font-medium">Sadece belge tarama değil, akıllı bir veri işleme merkezi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bot className="w-8 h-8 text-blue-500" />}
              title="Akıllı GTİP Belirleme"
              desc="Ürün tanımlarından doğru GTİP kodlarını çıkarır ve gümrük birimi ile eşleştirir."
            />
            <FeatureCard
              icon={<Layers className="w-8 h-8 text-purple-500" />}
              title="Çoklu Belge Analizi"
              desc="Fatura, Çeki Listesi ve ATR belgelerini aynı anda analiz ederek verileri çapraz doğrular."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-orange-500" />}
              title="Ultra Hızlı İşleme"
              desc="Karmaşık 100 sayfalık bir faturayı dahi saniyeler içinde dijital tabloya dönüştürür."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
              title="Yüksek Güvenlik"
              desc="256-bit şifreleme ile verileriniz sadece size özel sunucularda işlenir ve saklanır."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8 text-pink-500" />}
              title="Global Dil Desteği"
              desc="Arapça, Çince veya Rusça faturaları otomatik olarak tanır ve Türkçeye anlamlandırır."
            />
            <FeatureCard
              icon={<Terminal className="w-8 h-8 text-cyan-500" />}
              title="API Entegrasyonu"
              desc="Kullandığınız mevcut ERP ve Gümrük yazılımları ile tam entegre çalışabilir."
            />
          </div>
        </div>
      </section>

      {/* Module 3: How it Works (Visual Steps) */}
      <section id="workflow" className="py-32 bg-gradient-to-br from-blue-100/40 to-purple-100/40 border-y border-slate-200 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter text-balance text-slate-900">Nasıl Çalışır?</h2>
            <p className="text-slate-600 font-medium">Karmaşık süreçleri 3 basit adıma indirdik.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
            <div className="hidden lg:block absolute top-1/3 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-blue-600/0 via-blue-600/50 to-blue-600/0" />

            <WorkflowStep
              number="01"
              title="Belgeyi Yükle"
              desc="PDF, Image veya Scan dosyalarınızı sisteme sürükleyip bırakın."
              icon={<Download className="w-8 h-8" />}
            />
            <WorkflowStep
              number="02"
              title="Yapay Zeka Analizi"
              desc="AI algoritmalarımız kalemleri, miktarları ve kodları saniyeler içinde ayrıştırır."
              icon={<RefreshCw className="w-8 h-8 text-blue-500" />}
            />
            <WorkflowStep
              number="03"
              title="Sonucu Kullan"
              desc="Verileri Excel, XML veya PDF olarak dışa aktarın ya da ERP'nize gönderin."
              icon={<CheckCircle2 className="w-8 h-8 text-green-500" />}
            />
          </div>
        </div>
      </section>

      {/* Module 4: Pricing (Tables) */}
      <section id="pricing" className="py-32 relative">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter text-slate-900">Esnek Fiyatlandırma</h2>
            <p className="text-slate-600 font-medium">İhtiyacınıza uygun kredi paketini seçin.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.length > 0 ? (
              plans.map((p) => (
                <PriceCard
                  key={p.id}
                  title={p.title}
                  price={p.price}
                  credits={p.credits}
                  features={p.features.split(',')}
                  cta={p.price === 'Özel' ? 'Bize Ulaşın' : 'Hemen Satın Al'}
                  highlight={p.isHighlighted}
                  onClick={() => {
                    if (p.price === 'Özel') {
                      router.push('/tr/contact');
                    } else {
                      router.push('/tr/login');
                    }
                  }}
                />
              ))
            ) : (
              <>
                <PriceCard
                  title="Profesyonel"
                  price="₺1,499"
                  credits="100 Kredi"
                  features={['Sınırsız Dil Desteği', 'ERP Entegrasyonu', 'Öncelikli İşleme', '30 Gün Saklama', 'GTİP Analizörü']}
                  cta="Hemen Satın Al"
                  highlight
                  onClick={() => router.push('/tr/login')}
                />
                <PriceCard
                  title="Kurumsal"
                  price="Özel"
                  credits="Limitsiz"
                  features={['Özel AI Modeli Eğitimi', 'Tam API Erişimi', '7/24 Teknik Danışman', 'Sınırsız Arşivleme', 'Özel SLA Anlaşması']}
                  cta="Bize Ulaşın"
                  onClick={() => router.push('/tr/contact')}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Module 5: Testimonials (Quotes) */}
      <section className="py-24 bg-gradient-to-br from-purple-100/40 to-pink-100/40">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <Quote className="w-16 h-16 text-blue-600/40 mx-auto mb-12" />
            <p className="text-2xl lg:text-4xl font-bold italic leading-relaxed mb-12 text-slate-800">
              "Gümrük AI sayesinde operasyon hızımız %400 arttı. Eskiden saatler süren büyük kalemli fatura girişleri artık sadece saniyeler alıyor."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-blue-600/50" />
              <div className="text-left">
                <p className="font-black text-xl text-slate-900">Ahmet Yılmaz</p>
                <p className="text-blue-500 font-bold text-xs tracking-widest uppercase">Kıdemli Gümrük Müşaviri</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 6: FAQ (Accordions) */}
      <section className="py-32">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl lg:text-5xl font-black mb-16 text-center tracking-tighter text-slate-900">Sıkça Sorulan Sorular</h2>
          <div className="space-y-6">
            <FaqItem
              id={1}
              active={activeFaq}
              setActive={setActiveFaq}
              question="Hangi dosya formatlarını destekliyorsunuz?"
              answer="Sistemimiz PDF, JPG, PNG ve TIFF formatlarındaki tüm belgeleri yüksek doğrulukla analiz edebilir."
            />
            <FaqItem
              id={2}
              active={activeFaq}
              setActive={setActiveFaq}
              question="Verilerim ne kadar güvende?"
              answer="Verileriniz askeri düzeyde 256-bit AES şifreleme ile korunur. Analiz sonrası isterseniz belgeleri tamamen silebilirsiniz."
            />
            <FaqItem
              id={3}
              active={activeFaq}
              setActive={setActiveFaq}
              question="Farklı dillerdeki faturaları tanıyor mu?"
              answer="Evet, AI motorumuz 50'den fazla dili destekler ve teknik gümrük terimlerini otomatik olarak Türkçeye çevirir."
            />
            <FaqItem
              id={4}
              active={activeFaq}
              setActive={setActiveFaq}
              question="GTİP kodu otomatik belirlenebiliyor mu?"
              answer="Evet! Yapay zeka sistemimiz ürün tanımlarını analiz ederek en uygun GTİP kodunu %95 doğrulukla önerir."
            />
            <FaqItem
              id={5}
              active={activeFaq}
              setActive={setActiveFaq}
              question="Sistemin analiz hızı nedir?"
              answer="Ortalama bir fatura (10-50 kalem) 3-5 saniyede işlenir. 100+ kalemli büyük faturalar bile 15 saniyede tamamlanır."
            />
            <FaqItem
              id={6}
              active={activeFaq}
              setActive={setActiveFaq}
              question="Toplu belge yükleme yapabilir miyim?"
              answer="Evet, tek seferde 50 adete kadar belge yükleyebilir ve toplu analiz başlatabilirsiniz."
            />
            <FaqItem
              id={7}
              active={activeFaq}
              setActive={setActiveFaq}
              question="API entegrasyonu nasıl çalışır?"
              answer="RESTful API'miz ile ERP, SAP veya özel yazılımlarınızı entegre edebilirsiniz. Detaylı dokümantasyon API panelinde mevcuttur."
            />
            <FaqItem
              id={8}
              active={activeFaq}
              setActive={setActiveFaq}
              question="Hatalı analiz durumunda ne yapmalıyım?"
              answer="Her analiz sonucunu manuel olarak düzenleyebilirsiniz. Ayrıca hatalı sonuçları raporlayarak AI modelimizin gelişmesine katkı sağlayabilirsiniz."
            />
            <FaqItem
              id={9}
              active={activeFaq}
              setActive={setActiveFaq}
              question="Fiyatlandırma nasıl çalışır?"
              answer="Kredi bazlı sistem kullanıyoruz. 1 kredi = 1 belge analizi. Paketler satın alarak maliyet avantajı elde edebilirsiniz."
            />
            <FaqItem
              id={10}
              active={activeFaq}
              setActive={setActiveFaq}
              question="Kurumsal destek var mı?"
              answer="Evet! Kurumsal paketimizde 7/24 öncelikli destek, özel AI model eğitimi ve dedicated hesap yöneticisi bulunmaktadır."
            />
            <FaqItem
              id={11}
              active={activeFaq}
              setActive={setActiveFaq}
              question="Veriler ne kadar süre saklanır?"
              answer="Standart pakette 30 gün, profesyonel pakette 90 gün, kurumsal pakette sınırsız arşivleme sağlanır."
            />
            <FaqItem
              id={12}
              active={activeFaq}
              setActive={setActiveFaq}
              question="Hangi belge tiplerini destekliyorsunuz?"
              answer="Fatura, Proforma, Çeki Listesi (Packing List), ATR, EUR.1, Konşimento, Menşe Şahadetnamesi ve diğer tüm gümrük belgelerini destekliyoruz."
            />
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="py-32 bg-gradient-to-br from-blue-100/40 to-slate-100/40 border-t border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-16 gap-4">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tighter text-slate-900">Haberler & Analizler</h2>
              <p className="text-slate-600 font-medium">Sektördeki teknolojik gelişmeleri takip edin.</p>
            </div>
            <Link href="/tr/blogs" className="hidden sm:flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
              TÜMÜNÜ GÖR <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length > 0 ? (
              blogs.map((blog, idx) => (
                <Link key={idx} href={`/tr/blog/${blog.slug}`} className="group bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-[2.5rem] overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all flex flex-col h-full">
                  <div className="h-56 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden relative">
                    {blog.image ? (
                      <img src={blog.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileSearch className="w-12 h-12 text-blue-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors text-slate-900">{blog.title}</h4>
                    <p className="text-slate-600 text-sm mb-8 leading-relaxed line-clamp-2">{blog.excerpt}</p>
                    <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-bold">{new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span>
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                        OKU <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <>
                <Link href="/tr/blogs" className="group bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-[2.5rem] overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all flex flex-col h-full">
                  <div className="h-56 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <FileSearch className="w-16 h-16 text-blue-400" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors text-slate-900">2025 Gümrük Yönetmeliği Değişiklikleri</h4>
                    <p className="text-slate-600 text-sm mb-8 leading-relaxed">Yeni yılda yürürlüğe giren gümrük mevzuatı değişikliklerini ve dijitalleşme adımlarını detaylı olarak inceleyin...</p>
                    <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-bold">15 Ocak 2025</span>
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                        OKU <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
                <Link href="/tr/blogs" className="group bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-[2.5rem] overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all flex flex-col h-full">
                  <div className="h-56 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <Bot className="w-16 h-16 text-purple-400" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors text-slate-900">Yapay Zeka ile GTİP Belirleme: Nasıl Çalışır?</h4>
                    <p className="text-slate-600 text-sm mb-8 leading-relaxed">AI algoritmaları ürün tanımlarından GTİP kodunu nasıl çıkarıyor? Teknik detaylar ve doğruluk oranları...</p>
                    <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-bold">22 Ocak 2025</span>
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                        OKU <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
                <Link href="/tr/blogs" className="group bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-[2.5rem] overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all flex flex-col h-full">
                  <div className="h-56 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                    <Briefcase className="w-16 h-16 text-orange-400" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors text-slate-900">Şirketlerin %80'i Manuel Veri Girişinde Zaman Kaybediyor</h4>
                    <p className="text-slate-600 text-sm mb-8 leading-relaxed">Sektör araştırması: Gümrük operasyonlarında dijital dönüşümün önündeki engeller ve çözüm yolları...</p>
                    <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-bold">5 Şubat 2025</span>
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
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

      {/* Module 7: Final CTA */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-br from-blue-100/60 to-purple-100/60">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900">Dijital Dönüşüm İçin Beklemeyin.</h2>
            <p className="text-slate-600 text-xl font-medium">Hemen ücretsiz üyeliğinizi oluşturun ve 5 kredinizle ilk analizlerinizi yapın.</p>
            <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link href="/tr/login" className="px-16 py-7 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-black rounded-[2.5rem] hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all active:scale-95">
                Hesabını Oluştur
              </Link>
              <p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em]">KREDİ KARTI GEREKMEZ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 bg-slate-900 relative border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-6">
              <Link href="/tr" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FileSearch className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter">GÜMRÜK AI</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">Yapay zeka gücüyle gümrük operasyonlarınızı modernize edin.</p>
              <div className="flex items-center gap-4">
                <SocialButton icon={<Twitter className="w-4 h-4" />} />
                <SocialButton icon={<Linkedin className="w-4 h-4" />} />
                <SocialButton icon={<Facebook className="w-4 h-4" />} />
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-white/40">Hızlı Linkler</h4>
              <ul className="space-y-4">
                <li><Link href="/tr" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Ana Sayfa</Link></li>
                <li><Link href="#features" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Özellikler</Link></li>
                <li><Link href="/tr/blogs" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/tr/contact" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">İletişim</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-white/40">Çözümlerimiz</h4>
              <ul className="space-y-4">
                <li className="text-sm font-bold text-gray-400">GTİP Analizörü</li>
                <li className="text-sm font-bold text-gray-400">Belge Veri Çıkarımı</li>
                <li className="text-sm font-bold text-gray-400">Otomatik Tercüme</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Bülten</h4>
              <div className="relative">
                <input type="email" placeholder="E-posta" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-lg text-white">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center">
            <span className="text-[10px] font-black tracking-[0.4em] text-gray-600 uppercase">© 2026 GÜMRÜK AI ASİSTANI - PREMIUM ANALİZ PLATFORMU</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 35s linear infinite; }
      `}</style>
    </div>
  );
}

function TrustStat({ value, label }: any) {
  return (
    <div className="space-y-2">
      <p className="text-4xl lg:text-5xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-10 bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-[3rem] hover:border-blue-300 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mb-8 border-2 border-slate-200 group-hover:scale-110 group-hover:border-blue-300 transition-all">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-slate-900">{title}</h3>
      <p className="text-slate-600 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function WorkflowStep({ number, title, desc, icon }: any) {
  return (
    <div className="relative z-10 text-center space-y-6">
      <div className="w-20 h-20 bg-white/90 backdrop-blur-sm border-2 border-slate-300 rounded-[2rem] flex items-center justify-center mx-auto relative group hover:border-blue-500 hover:shadow-lg transition-all">
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xs font-black shadow-lg text-white">{number}</div>
        {icon}
      </div>
      <h4 className="text-2xl font-black text-slate-900">{title}</h4>
      <p className="text-slate-600 font-medium leading-relaxed px-4">{desc}</p>
    </div>
  );
}

function PriceCard({ title, price, credits, features, cta, highlight, onClick }: any) {
  return (
    <div className={`p-10 lg:p-12 rounded-[3.5rem] border-2 ${highlight ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-500 scale-105 shadow-[0_30px_60px_-15px_rgba(59,130,246,0.4)]' : 'bg-white/90 backdrop-blur-sm border-slate-200'} flex flex-col relative`}>
      {highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest whitespace-nowrap shadow-lg">En Çok Tercih Edilen</div>}
      <h3 className={`text-xl font-black mb-1 ${highlight ? 'text-blue-100' : 'text-slate-600'}`}>{title}</h3>
      <div className="flex items-baseline gap-2 mb-8">
        <span className={`text-4xl font-black ${highlight ? 'text-white' : 'text-slate-900'}`}>{price}</span>
        {price !== 'Özel' && price !== 'Ücretsiz' && <span className="text-xs font-bold opacity-50">/Paket</span>}
      </div>
      <div className={`p-6 rounded-3xl mb-10 ${highlight ? 'bg-white/10' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
        <p className={`text-xs font-black tracking-widest uppercase mb-1 ${highlight ? 'opacity-70' : 'text-slate-600'}`}>KREDİ</p>
        <p className="text-2xl font-black">{credits}</p>
      </div>
      <ul className="space-y-5 mb-12 flex-1">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm font-bold">
            <Check className={`w-5 h-5 ${highlight ? 'text-white' : 'text-blue-600'}`} />
            <span className={highlight ? 'text-white/90' : 'text-slate-700'}>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${highlight ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50'}`}
      >
        {cta}
      </button>
    </div>
  );
}

function FaqItem({ id, active, setActive, question, answer }: any) {
  const isOpen = active === id;
  return (
    <div className="border-2 border-slate-200 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <button
        onClick={() => setActive(isOpen ? null : id)}
        className="w-full p-8 flex items-center justify-between text-left hover:bg-slate-50 transition-all"
      >
        <span className="text-lg font-black text-slate-900">{question}</span>
        <ChevronDown className={`w-6 h-6 text-blue-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-8 pb-8 text-slate-600 font-medium leading-relaxed"
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
    <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
      {icon}
    </button>
  );
}
