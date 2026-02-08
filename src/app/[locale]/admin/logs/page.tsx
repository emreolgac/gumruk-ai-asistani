'use client';

import { useState, useEffect } from 'react';
import { Terminal, Shield, AlertTriangle, Info, Clock, Search, RefreshCw, Filter } from 'lucide-react';

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/logs');
            const data = await res.json();
            setLogs(data);
        } catch (error) {
            console.error('Logs fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesFilter = typeFilter === 'ALL' || log.level === typeFilter;
        const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) ||
            log.source.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                        <Terminal className="w-8 h-8 text-blue-500" />
                        Sistem Logları
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Uygulama genelindeki tüm kritik olayları ve hataları takip edin.</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 border border-white/5 text-white rounded-2xl font-bold hover:bg-gray-700 transition-all active:scale-95"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Yenile
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Mesaj veya kaynak ara..."
                        className="w-full bg-gray-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none backdrop-blur-md transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 border border-white/5 rounded-2xl p-2 backdrop-blur-md">
                    {['ALL', 'INFO', 'WARN', 'ERROR'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`flex-1 py-2 rounded-xl text-xs font-black tracking-widest transition-all ${typeFilter === type ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-gray-800/50 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="px-8 py-5 text-sm font-black text-gray-500 uppercase tracking-widest">Durum</th>
                                <th className="px-8 py-5 text-sm font-black text-gray-500 uppercase tracking-widest">Kaynak</th>
                                <th className="px-8 py-5 text-sm font-black text-gray-500 uppercase tracking-widest">Mesaj</th>
                                <th className="px-8 py-5 text-sm font-black text-gray-500 uppercase tracking-widest">Tarih</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {loading ? (
                                Array(10).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-8 py-6 bg-white/[0.01]"></td>
                                    </tr>
                                ))
                            ) : filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors font-mono">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${log.level === 'ERROR' ? 'bg-red-500' : log.level === 'WARN' ? 'bg-amber-500' : 'bg-blue-500'
                                                }`} />
                                            <span className={`text-[11px] font-black tracking-widest ${log.level === 'ERROR' ? 'text-red-400' : log.level === 'WARN' ? 'text-amber-400' : 'text-blue-400'
                                                }`}>
                                                {log.level}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-400 font-bold uppercase">{log.source}</td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm text-gray-200 leading-relaxed max-w-xl">{log.message}</div>
                                        {log.details && (
                                            <div className="mt-2 text-[10px] text-gray-600 truncate bg-black/20 p-2 rounded-lg">
                                                {log.details}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-500 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 opacity-50" />
                                            {new Date(log.createdAt).toLocaleString('tr-TR')}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && filteredLogs.length === 0 && (
                        <div className="py-20 text-center text-gray-500 italic">Eşleşen log kaydı bulunamadı.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
