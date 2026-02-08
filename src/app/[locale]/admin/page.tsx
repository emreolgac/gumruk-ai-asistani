'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    CreditCard,
    Zap,
    Eye,
    DollarSign,
    Clock,
    Activity,
    StickyNote,
    Terminal,
    ChevronRight,
    Plus,
    Trash2
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

interface DashboardStats {
    revenue: { today: number; week: number; month: number; total: number };
    users: { total: number; today: number; week: number; online: number };
    hits: { total: number; today: number; week: number; month: number };
    api: { requests: number; tokens: number; cost: number };
    recentLogs: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [notes, setNotes] = useState<any[]>([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, notesRes] = await Promise.all([
                fetch('/api/admin/stats'),
                fetch('/api/admin/notes')
            ]);
            const statsData = await statsRes.json();
            const notesData = await notesRes.json();

            setStats(statsData);
            setNotes(notesData);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        try {
            const res = await fetch('/api/admin/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newNote, color: 'blue' }),
            });
            if (res.ok) {
                setNewNote('');
                fetchData();
            }
        } catch (error) {
            console.error('Note add error:', error);
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            await fetch('/api/admin/notes', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            fetchData();
        } catch (error) {
            console.error('Note delete error:', error);
        }
    };

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center min-h-screen font-sans">
                <Activity className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    const chartData = [
        { name: 'Bugün', hits: stats.hits.today, users: stats.users.today, rev: stats.revenue.today },
        { name: 'Bu Hafta', hits: stats.hits.week, users: stats.users.week, rev: stats.revenue.week },
        { name: 'Bu Ay', hits: stats.hits.month, users: stats.users.total / 4, rev: stats.revenue.month },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Dashboard</h1>
                    <p className="text-gray-400 mt-2 text-lg">Sistemin genel durumu ve canlı istatistikler.</p>
                </div>
                <div className="flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-2xl">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-blue-400 font-bold">{stats.users.online} Kullanıcı Online</span>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<DollarSign className="w-6 h-6" />}
                    label="Bugünkü Kazanç"
                    value={`${stats.revenue.today.toFixed(2)} ₺`}
                    subValue={`Haftalık: ${stats.revenue.week.toFixed(2)} ₺`}
                    color="bg-emerald-500"
                />
                <StatCard
                    icon={<Users className="w-6 h-6" />}
                    label="Yeni Üyeler (Bugün)"
                    value={stats.users.today}
                    subValue={`Bu Hafta: ${stats.users.week}`}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={<Eye className="w-6 h-6" />}
                    label="Sözlük Hit (Bugün)"
                    value={stats.hits.today}
                    subValue={`Aylık: ${stats.hits.month}`}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={<Zap className="w-6 h-6" />}
                    label="API Harcaması"
                    value={`$${stats.api.cost.toFixed(4)}`}
                    subValue={`${stats.api.requests} İstek`}
                    color="bg-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-gray-800/50 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            Büyüme Analizi
                        </h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorHits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="hits" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHits)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-purple-500" />
                            Sistem Logları
                        </h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {stats.recentLogs.map((log: any) => (
                                <div key={log.id} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] group hover:bg-white/[0.04] transition-all">
                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${log.level === 'ERROR' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                            log.level === 'WARN' ? 'bg-amber-500' : 'bg-blue-500'
                                        }`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{log.source}</span>
                                            <span className="text-[10px] text-gray-600 font-mono">
                                                {new Date(log.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-300 truncate font-mono">{log.message}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-700 group-hover:translate-x-1 transition-transform" />
                                </div>
                            ))}
                            {stats.recentLogs.length === 0 && (
                                <div className="text-center py-10 text-gray-600">Henüz log kaydı bulunmuyor.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    {/* Notes Section */}
                    <div className="bg-gray-800/50 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <StickyNote className="w-5 h-5 text-yellow-500" />
                            Yönetici Notları
                        </h3>

                        <form onSubmit={handleAddNote} className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Yeni not ekle..."
                                className="w-full bg-gray-900/50 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors">
                                <Plus className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="space-y-3">
                            {notes.map((note) => (
                                <div key={note.id} className="group flex items-start gap-3 p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 hover:border-yellow-500/30 transition-all">
                                    <div className="flex-1 text-sm text-yellow-100/80 leading-relaxed">{note.content}</div>
                                    <button
                                        onClick={() => handleDeleteNote(note.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {notes.length === 0 && (
                                <div className="text-center py-6 text-gray-600 text-sm">Hiç not yok.</div>
                            )}
                        </div>
                    </div>

                    {/* Revenue Details */}
                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-400" />
                            Kazanç Özet
                        </h3>
                        <div className="space-y-6">
                            <RevenueRow label="Bugün" value={stats.revenue.today} />
                            <RevenueRow label="Bu Hafta" value={stats.revenue.week} />
                            <RevenueRow label="Bu Ay" value={stats.revenue.month} />
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-400">Toplam</span>
                                <span className="text-2xl font-black text-white">{stats.revenue.total.toFixed(0)} ₺</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, subValue, color }: any) {
    return (
        <div className="relative group bg-gray-800/50 border border-white/5 p-6 rounded-[2.5rem] shadow-xl backdrop-blur-md overflow-hidden transition-all hover:scale-[1.02] hover:border-white/10">
            <div className={`absolute -right-4 -top-4 w-24 h-24 blur-[40px] opacity-10 ${color}`} />
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-white/5 group-hover:scale-110 transition-transform`}>
                    <div className={`p-2 rounded-xl text-white ${color} shadow-lg shadow-black/20`}>{icon}</div>
                </div>
                <div className="text-sm font-semibold text-gray-400 mb-1">{label}</div>
                <div className="text-3xl font-black text-white mb-1">{value}</div>
                <div className="text-xs text-gray-500 font-medium">{subValue}</div>
            </div>
        </div>
    );
}

function RevenueRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 font-medium">{label}</span>
            <span className="text-lg font-bold text-white leading-none">{value.toFixed(2)} ₺</span>
        </div>
    );
}
