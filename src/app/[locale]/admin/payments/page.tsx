'use client';

import { useEffect, useState } from 'react';

interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    provider: string;
    packageName: string | null;
    creditsAdded: number;
    createdAt: string;
    user: {
        name: string | null;
        email: string | null;
    };
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await fetch('/api/admin/payments');
            const data = await res.json();
            setPayments(data.payments || []);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-900 text-green-300';
            case 'PENDING': return 'bg-yellow-900 text-yellow-300';
            case 'FAILED': return 'bg-red-900 text-red-300';
            default: return 'bg-gray-600 text-gray-300';
        }
    };

    const totalRevenue = payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">💰 Ödeme Geçmişi</h1>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Toplam Ödeme</p>
                    <p className="text-2xl font-bold text-white">{payments.length}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Başarılı</p>
                    <p className="text-2xl font-bold text-green-400">
                        {payments.filter(p => p.status === 'COMPLETED').length}
                    </p>
                </div>
                <div className="bg-green-900 rounded-xl p-4 border border-green-700">
                    <p className="text-green-300 text-sm">Toplam Gelir</p>
                    <p className="text-2xl font-bold text-white">₺{totalRevenue.toLocaleString('tr-TR')}</p>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Kullanıcı</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Paket</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tutar</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Sağlayıcı</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Durum</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tarih</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="text-white font-medium">{payment.user?.name || 'İsimsiz'}</div>
                                        <div className="text-gray-400 text-sm">{payment.user?.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white">
                                    {payment.packageName || '-'}
                                    {payment.creditsAdded > 0 && (
                                        <span className="ml-2 text-gray-400 text-sm">+{payment.creditsAdded} kredi</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-white font-medium">
                                    {payment.currency === 'TRY' ? '₺' : '$'}{payment.amount.toLocaleString('tr-TR')}
                                </td>
                                <td className="px-6 py-4 text-gray-400">{payment.provider}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                        {payment.status === 'COMPLETED' ? 'Başarılı' :
                                            payment.status === 'PENDING' ? 'Bekliyor' : 'Başarısız'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {new Date(payment.createdAt).toLocaleString('tr-TR')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {payments.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        Henüz ödeme yok
                    </div>
                )}
            </div>
        </div>
    );
}
