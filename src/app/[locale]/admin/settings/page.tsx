'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleMakeAdmin = async () => {
        const email = prompt('Admin yapmak istediğiniz kullanıcının email adresini girin:');
        if (!email) return;

        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings/make-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setMessage(`${email} artık admin!`);
            } else {
                const data = await res.json();
                setMessage(`Hata: ${data.error}`);
            }
        } catch (error) {
            setMessage('Bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">⚙️ Sistem Ayarları</h1>

            {message && (
                <div className="mb-6 p-4 bg-blue-900/50 border border-blue-700 rounded-lg text-blue-300">
                    {message}
                </div>
            )}

            {/* Admin Management */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">👤 Admin Yönetimi</h2>
                <p className="text-gray-400 mb-4">
                    Bir kullanıcıyı admin yapabilirsiniz. Admin kullanıcılar bu panele erişebilir.
                </p>
                <button
                    onClick={handleMakeAdmin}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    {saving ? 'İşleniyor...' : 'Kullanıcıyı Admin Yap'}
                </button>
            </div>

            {/* API Keys Info */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">🔑 API Anahtarları</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                        <div>
                            <p className="text-white font-medium">Gemini API</p>
                            <p className="text-gray-400 text-sm">Google AI Studio'dan alınır</p>
                        </div>
                        <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm">
                            {process.env.NEXT_PUBLIC_HAS_GEMINI_KEY === 'true' ? '✓ Yapılandırıldı' : '⚠ Yapılandırılmadı'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                        <div>
                            <p className="text-white font-medium">Iyzico API</p>
                            <p className="text-gray-400 text-sm">Ödeme sistemi</p>
                        </div>
                        <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm">
                            Yapılandırıldı
                        </span>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="bg-yellow-900/30 rounded-xl p-6 border border-yellow-700/50">
                <h2 className="text-xl font-bold text-yellow-300 mb-2">💡 Bilgi</h2>
                <p className="text-yellow-200/80">
                    API anahtarları ve diğer hassas ayarlar <code className="bg-black/30 px-2 py-1 rounded">.env</code> dosyasından yapılandırılır.
                    Güvenlik nedeniyle bu ayarlar bu panelden değiştirilemez.
                </p>
            </div>
        </div>
    );
}
