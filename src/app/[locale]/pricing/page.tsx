'use client';

import { Check } from 'lucide-react';

export default function PricingPage() {
    const handlePayment = async (plan: string, provider: 'paytr' | 'iyzico') => {
        alert(`${plan} paketi için ${provider} ödeme sayfasına yönlendiriliyorsunuz...`);
        // In a real app, calls /api/payment/paytr or /api/payment/iyzico
        // const res = await fetch(\`/api/payment/\${provider}\`, { method: 'POST', body: JSON.stringify({ plan }) });
        // const data = await res.json();
        // if(data.iframeUrl) window.location.href = data.iframeUrl;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Uygun Fiyatlandırma</h1>
            <p className="text-gray-500 mb-12 text-center max-w-xl">
                İhtiyacınıza uygun paketi seçin ve gümrük süreçlerinizi hızlandırın.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Startup Plan */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col hover:shadow-xl transition">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Başlangıç</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-6">₺499<span className="text-lg text-gray-500 font-normal">/ay</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3"><Check className="text-green-500" /> 100 Belge Analizi</li>
                        <li className="flex items-center gap-3"><Check className="text-green-500" /> PDF & Görsel Desteği</li>
                        <li className="flex items-center gap-3"><Check className="text-green-500" /> Excel & XML Çıktısı</li>
                        <li className="flex items-center gap-3"><Check className="text-green-500" /> 7/24 Destek</li>
                    </ul>
                    <p className="text-sm text-gray-400 mb-2 text-center">Ödeme Yöntemi Seçin:</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handlePayment('startup', 'paytr')} className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold">PayTR</button>
                        <button onClick={() => handlePayment('startup', 'iyzico')} className="w-full py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold">Iyzico</button>
                    </div>
                </div>

                {/* Pro Plan */}
                <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPÜLER</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Kurumsal</h3>
                    <div className="text-4xl font-bold text-white mb-6">₺1299<span className="text-lg text-gray-400 font-normal">/ay</span></div>
                    <ul className="space-y-4 mb-8 flex-1 text-gray-300">
                        <li className="flex items-center gap-3"><Check className="text-blue-400" /> Sınırsız Belge Analizi</li>
                        <li className="flex items-center gap-3"><Check className="text-blue-400" /> Öncelikli İşlem</li>
                        <li className="flex items-center gap-3"><Check className="text-blue-400" /> API Erişimi</li>
                        <li className="flex items-center gap-3"><Check className="text-blue-400" /> Özel Entegrasyon</li>
                    </ul>
                    <p className="text-sm text-gray-500 mb-2 text-center">Ödeme Yöntemi Seçin:</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handlePayment('pro', 'paytr')} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">PayTR</button>
                        <button onClick={() => handlePayment('pro', 'iyzico')} className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold">Iyzico</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
