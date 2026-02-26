'use client';

import { useEffect, useState } from 'react';

interface ApiUsageData {
    id: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    cost: number;
    endpoint: string | null;
    createdAt: string;
    user: {
        name: string | null;
        email: string | null;
    } | null;
}

interface Summary {
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
    byModel: { model: string; count: number; tokens: number }[];
}

export default function AdminApiUsagePage() {
    const [usages, setUsages] = useState<ApiUsageData[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsages();
    }, []);

    const fetchUsages = async () => {
        try {
            const res = await fetch('/api/admin/api-usage');
            const data = await res.json();
            setUsages(data.usages || []);
            setSummary(data.summary || null);
        } catch (error) {
            console.error('Failed to fetch API usage:', error);
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

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">🤖 Claude API Kullanımı</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-4 border border-purple-700">
                    <p className="text-purple-300 text-sm">Toplam İstek</p>
                    <p className="text-2xl font-bold text-white">{summary?.totalRequests || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900 to-cyan-900 rounded-xl p-4 border border-blue-700">
                    <p className="text-blue-300 text-sm">Toplam Token</p>
                    <p className="text-2xl font-bold text-white">
                        {(summary?.totalTokens || 0).toLocaleString('tr-TR')}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-xl p-4 border border-green-700">
                    <p className="text-green-300 text-sm">Tahmini Maliyet</p>
                    <p className="text-2xl font-bold text-white">${(summary?.totalCost || 0).toFixed(4)}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-900 to-amber-900 rounded-xl p-4 border border-orange-700">
                    <p className="text-orange-300 text-sm">Ort. Token/İstek</p>
                    <p className="text-2xl font-bold text-white">
                        {summary?.totalRequests ? Math.round((summary?.totalTokens || 0) / summary.totalRequests) : 0}
                    </p>
                </div>
            </div>

            {/* Model Usage */}
            {summary?.byModel && summary.byModel.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                    <h2 className="text-lg font-bold text-white mb-4">Model Kullanımı</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {summary.byModel.map((item) => (
                            <div key={item.model} className="bg-gray-700/50 rounded-lg p-4">
                                <p className="text-white font-medium">{item.model}</p>
                                <p className="text-gray-400 text-sm">{item.count} istek • {item.tokens.toLocaleString()} token</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Usage Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold text-white">Son İstekler</h2>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Kullanıcı</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Model</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Token</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Maliyet</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tarih</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {usages.slice(0, 50).map((usage) => (
                            <tr key={usage.id} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4">
                                    <div className="text-white text-sm">{usage.user?.name || usage.user?.email || 'Anonim'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-purple-900 text-purple-300 rounded text-xs">
                                        {usage.model}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-white text-sm">
                                    <span className="text-green-400">{usage.inputTokens}</span>
                                    {' → '}
                                    <span className="text-blue-400">{usage.outputTokens}</span>
                                    <span className="text-gray-400 ml-1">({usage.totalTokens})</span>
                                </td>
                                <td className="px-6 py-4 text-white text-sm">${usage.cost.toFixed(6)}</td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {new Date(usage.createdAt).toLocaleString('tr-TR')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {usages.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        Henüz API kullanımı yok
                    </div>
                )}
            </div>
        </div>
    );
}
