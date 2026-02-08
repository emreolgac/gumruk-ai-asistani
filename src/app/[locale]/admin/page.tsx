'use client';

import { useEffect, useState } from 'react';

interface Stats {
    totalUsers: number;
    premiumUsers: number;
    totalDeclarations: number;
    totalPayments: number;
    totalRevenue: number;
    apiUsage: {
        totalRequests: number;
        totalTokens: number;
        totalCost: number;
        todayRequests: number;
    };
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const statCards = [
        { label: 'Toplam Kullanıcı', value: stats?.totalUsers || 0, icon: '👥', color: 'blue' },
        { label: 'Premium Kullanıcı', value: stats?.premiumUsers || 0, icon: '⭐', color: 'yellow' },
        { label: 'Toplam Analiz', value: stats?.totalDeclarations || 0, icon: '📄', color: 'green' },
        { label: 'Toplam Ödeme', value: stats?.totalPayments || 0, icon: '💳', color: 'purple' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">{card.label}</p>
                                <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                            </div>
                            <span className="text-3xl">{card.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue Card */}
            <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-xl p-6 border border-green-700 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-300 text-sm">Toplam Gelir</p>
                        <p className="text-4xl font-bold text-white mt-1">
                            ₺{stats?.totalRevenue?.toLocaleString('tr-TR') || 0}
                        </p>
                    </div>
                    <span className="text-5xl">💰</span>
                </div>
            </div>

            {/* API Usage Card */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-6 border border-purple-700">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    🤖 Gemini API Kullanımı
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-black/20 rounded-lg p-4">
                        <p className="text-purple-300 text-sm">Toplam İstek</p>
                        <p className="text-2xl font-bold text-white">{stats?.apiUsage?.totalRequests || 0}</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4">
                        <p className="text-purple-300 text-sm">Bugün</p>
                        <p className="text-2xl font-bold text-white">{stats?.apiUsage?.todayRequests || 0}</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4">
                        <p className="text-purple-300 text-sm">Toplam Token</p>
                        <p className="text-2xl font-bold text-white">
                            {stats?.apiUsage?.totalTokens?.toLocaleString('tr-TR') || 0}
                        </p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4">
                        <p className="text-purple-300 text-sm">Tahmini Maliyet</p>
                        <p className="text-2xl font-bold text-white">
                            ${stats?.apiUsage?.totalCost?.toFixed(4) || '0.00'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
