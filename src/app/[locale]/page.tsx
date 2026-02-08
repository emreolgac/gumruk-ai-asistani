'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  Zap,
  BarChart3,
  Globe2,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  PlayCircle
} from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function HomePage() {
  const t = useTranslations('HomePage');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 mx-auto max-w-7xl backdrop-blur-md border-b border-white/5 sticky top-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Gümrük AI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Özellikler</a>
          <a href="#pricing" className="hover:text-white transition-colors">Fiyatlandırma</a>
          <a href="#faq" className="hover:text-white transition-colors">SSS</a>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            Hemen Başla
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-8"
          >
            <Zap className="w-3 h-3" />
            <span>YENİ: Gemini 1.5 Flash ile 2 kat daha hızlı analiz</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight"
          >
            Gümrük Beyannamelerini<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Saniyeler İçinde Analiz Edin
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Yapay zeka destekli gümrük asistanınızla hataları sıfıra indirin,
            operasyonel hızınızı %80 artırın. Karmaşık verileri okunabilir raporlara dönüştürün.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-all group shadow-2xl shadow-blue-500/10"
            >
              Ücretsiz Deneyin
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              <PlayCircle className="w-5 h-5 text-blue-400" />
              Nasıl Çalışır?
            </button>
          </motion.div>
        </div>

        {/* Dashboard Preview Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 max-w-5xl mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative rounded-[2rem] bg-gray-900 border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <div className="ml-4 h-5 w-64 rounded bg-white/10" />
            </div>
            <img
              src="https://images.unsplash.com/photo-1611224885990-ab73b39132a9?q=80&w=2000&auto=format&fit=crop"
              alt="Dashboard Preview"
              className="w-full h-auto grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-blue-500 font-semibold mb-4 uppercase tracking-widest text-sm">Neden Biz?</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Gümrük İşlemlerinizi Modernleştirin</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">Teknolojinin gücünü gümrük süreçlerinize entegre ederek verimliliğinizi maksimize edin.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-yellow-400" />,
                title: "Ultra Hızlı Analiz",
                desc: "Yüzlerce sayfalık gümrük belgelerini saniyeler içinde tarar ve kritik verileri ayıklar."
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
                title: "Detaylı Raporlama",
                desc: "Verileri grafiklerle ve anlaşılır tablolarla görselleştirir. Karar verme sürecinizi kolaylaştırır."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
                title: "Güvenli Altyapı",
                desc: "Verileriniz en yüksek güvenlik standartlarında korunur. Sadece sizin erişiminize açıktır."
              },
              {
                icon: <Globe2 className="w-8 h-8 text-purple-400" />,
                title: "Çoklu Dil Desteği",
                desc: "Global ticaretin dili olan İngilizce ve Türkçe belgeleri kusursuz şekilde analiz eder."
              },
              {
                icon: <MessageSquare className="w-8 h-8 text-pink-400" />,
                title: "Akıllı Asistan",
                desc: "Belgeleriniz hakkında soru sorun, gümrük mevzuatına uygun cevaplar alın."
              },
              {
                icon: <FileText className="w-8 h-8 text-orange-400" />,
                title: "Otomatik Arşivleme",
                desc: "Tüm analizlerinizi dijital ortamda düzenli bir şekilde saklar ve istediğiniz zaman erişim sunar."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all hover:border-blue-500/30 group"
              >
                <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] inline-block group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 font-medium mb-12">GÜVENDİĞİNİZ TEKNOLOJİLERLE ENTEGRE</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale filter">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Google AI" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Vercel_logo.svg" alt="Vercel" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" alt="PostgreSQL" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" className="h-8" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto relative rounded-[3rem] bg-gradient-to-br from-blue-600 to-purple-700 p-12 md:p-20 overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Geleceğin Gümrük Teknolojisiyle<br />Bugün Tanışın</h2>
            <p className="text-blue-100 text-lg mb-12 max-w-2xl mx-auto">
              Operasyonel mükemmelliğe giden yolda ilk adımı atın. 5 kredi ücretsiz kullanım hakkınız sizi bekliyor.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-10 py-5 bg-white text-blue-700 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Şimdi Kaydol
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-10 py-5 bg-blue-700/30 border border-blue-400/30 text-white rounded-full font-bold text-lg hover:bg-blue-700/50 transition-all"
              >
                Planları İncele
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-blue-100/70">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Kredi Kartı Gerekmez</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ücretsiz 5 Analiz</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">Gümrük AI</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs text-center md:text-left">
              Yapay zeka ile gümrük operasyonlarını dönüştürüyoruz.
            </p>
          </div>

          <div className="flex gap-10 text-sm text-gray-500 font-medium">
            <a href="#" className="hover:text-white">Şartlar</a>
            <a href="#" className="hover:text-white">Gizlilik</a>
            <a href="#" className="hover:text-white">İletişim</a>
          </div>

          <div className="text-gray-500 text-sm">
            © 2026 Gümrük AI Asistanı. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
