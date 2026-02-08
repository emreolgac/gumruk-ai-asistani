'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InstallPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        databaseUrl: '',
        googleClientId: '',
        googleClientSecret: '',
        geminiApiKey: '',
        paytrMerchantId: '',
        paytrSecretKey: '',
        appUrl: 'http://localhost:3000'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const testConnection = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/setup/test-db', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ databaseUrl: formData.databaseUrl }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            setStep(2);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const saveConfig = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/setup/save-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            // Redirect to home after a delay to allow restart
            setTimeout(() => {
                router.push('/');
            }, 5000);

            alert('Kurulum tamamlandı! Sunucu yeniden başlatılıyor, lütfen bekleyin...');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Gümrük AI Kurulumu
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Veritabanı Ayarları</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Database URL</label>
                            <input
                                name="databaseUrl"
                                value={formData.databaseUrl}
                                onChange={handleChange}
                                placeholder="postgresql://user:pass@host:5432/db"
                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                PostgreSQL veya SQLite bağlantı stringi.
                            </p>
                        </div>
                        <button
                            onClick={testConnection}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
                        >
                            {loading ? 'Test Ediliyor...' : 'Bağlantıyı Test Et ve İlerle'}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Genel Ayarlar</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Uygulama URL</label>
                            <input
                                name="appUrl"
                                value={formData.appUrl}
                                onChange={handleChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Gemini API Key</label>
                            <input
                                name="geminiApiKey"
                                value={formData.geminiApiKey}
                                onChange={handleChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Google Client ID</label>
                            <input
                                name="googleClientId"
                                value={formData.googleClientId}
                                onChange={handleChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Google Client Secret</label>
                            <input
                                name="googleClientSecret"
                                value={formData.googleClientSecret}
                                onChange={handleChange}
                                type="password"
                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">PayTR Merchant ID</label>
                                <input
                                    name="paytrMerchantId"
                                    value={formData.paytrMerchantId}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">PayTR Secret Key</label>
                                <input
                                    name="paytrSecretKey"
                                    value={formData.paytrSecretKey}
                                    onChange={handleChange}
                                    type="password"
                                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="w-1/3 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition"
                            >
                                Geri
                            </button>
                            <button
                                onClick={saveConfig}
                                disabled={loading}
                                className="w-2/3 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
                            >
                                {loading ? 'Kaydediliyor...' : 'Kurulumu Tamamla'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
