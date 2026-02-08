import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function HomePage() {
  const t = useTranslations('Index');
  const tAuth = useTranslations('Auth');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 bg-white shadow-sm">
        <div className="text-2xl font-bold text-blue-600">Gümrük.AI</div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/pricing" className="text-gray-600 hover:text-blue-600 font-medium">Fiyatlandırma</Link>
          <Link href="/login" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition">
            {tAuth('login')}
          </Link>
          <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            {tAuth('register')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center mt-20 px-4">
        <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl">
          {t('description')}
        </p>

        <div className="flex gap-4">
          <Link href="/dashboard" className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-105">
            {t('analyzeButton')}
          </Link>
        </div>

        {/* Feature Grid (Static for now) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl w-full">
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-bold mb-2">Belge Analizi</h3>
            <p className="text-gray-500">Ordino ve faturalarınızı yapay zeka ile saniyeler içinde analiz edin.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Hızlı İşlem</h3>
            <p className="text-gray-500">Manuel veri girişine son. Dakikalar süren işleri saniyelere indirin.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold mb-2">Mevzuat Uyumlu</h3>
            <p className="text-gray-500">Türkiye Gümrük Mevzuatına tam uyumlu beyanname taslakları.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
