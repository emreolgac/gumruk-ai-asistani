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
    Trash2,
    Share2,
    ThumbsUp,
    Star,
    MessageSquare,
    BookOpen,
    UserPlus,
    ArrowRight,
    RefreshCw,
    Mail,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Cell,
    Pie
} from 'recharts';

interface DashboardStats {
    revenue: { today: number; week: number; month: number; total: number };
    users: { total: number; today: number; week: number; online: number; latest: any[] };
    hits: { total: number; today: number; week: number; month: number };
    api: { requests: number; tokens: number; cost: number };
    messages: { total: number; unread: number };
    blogs: any[];
    recentLogs: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [notes, setNotes] = useState<any[]>([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsRefreshing(true);
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
            setIsRefreshing(false);
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
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-slate-400 font-bold tracking-widest animate-pulse uppercase">Dashboard Yükleniyor...</p>
            </div>
        );
    }

    const chartData = [
        { name: 'Ocak', hits: 400, users: 240, rev: 2400 },
        { name: 'Şubat', hits: 300, users: 139, rev: 2210 },
        { name: 'Mart', hits: 200, users: 980, rev: 2290 },
        { name: 'Nisan', hits: 278, users: 390, rev: 2000 },
        { name: 'Mayıs', hits: 189, users: 480, rev: 2181 },
        { name: 'Haziran', hits: 239, users: 380, rev: 2500 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            {/* Top Header Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Kontrol Merkezi</h1>
                        <p className="text-slate-500 font-medium mt-1">Sistemin genel sağlığı ve tüm verileri tek ekranda.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Sistem Zamanı</span>
                        <span className="text-lg font-bold text-slate-700">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <button
                        onClick={fetchData}
                        title="Verileri Yenile"
                        className={`p-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl transition-all border border-gray-100 ${isRefreshing ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Hero Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatTile
                    label="Toplam Ciro"
                    value={`${stats.revenue.total.toFixed(0)} ₺`}
                    subtitle={`Bugün: ${stats.revenue.today.toFixed(0)} ₺`}
                    icon={<DollarSign className="w-5 h-5" />}
                    color="bg-[#1e2b4d]"
                />
                <StatTile
                    label="Ziyaretçi Hiti"
                    value={stats.hits.total}
                    subtitle={`Bugün: ${stats.hits.today}`}
                    icon={<Eye className="w-5 h-5 text-orange-400" />}
                    color="bg-white"
                />
                <StatTile
                    label="Yeni Üyeler"
                    value={stats.users.total}
                    subtitle={`Bugün: ${stats.users.today}`}
                    icon={<Users className="w-5 h-5 text-blue-600" />}
                    color="bg-white"
                />
                <StatTile
                    label="Bekleyen Mesaj"
                    value={stats.messages.unread}
                    subtitle={`Toplam: ${stats.messages.total}`}
                    icon={<MessageSquare className="w-5 h-5 text-pink-500" />}
                    color="bg-white"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left: Charts & Operations */}
                <div className="xl:col-span-2 space-y-8">

                    {/* Main Chart Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                                Aylık Büyüme Analizi
                            </h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Hit</span>
                                <span className="px-3 py-1 bg-orange-50 text-orange-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Giriş</span>
                            </div>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                                    />
                                    <Area type="monotone" dataKey="hits" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorVisits)" />
                                    <Area type="monotone" dataKey="users" stroke="#f59e0b" strokeWidth={4} fill="none" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Quick User Add Card */}
                        <div className="bg-[#1e2b4d] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                            <div className="absolute right-[-10%] top-[-10%] w-48 h-48 bg-white/5 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                    <UserPlus className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-black mb-2">Hızlı Üye Kaydı</h3>
                                <p className="text-blue-100/60 text-sm mb-8 leading-relaxed">Yeni bir kullanıcıyı manuel olarak hemen sisteme dahil edin.</p>
                                <div className="mt-auto">
                                    <button
                                        onClick={() => window.location.href = '/tr/admin/users?action=new'}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20"
                                    >
                                        Yeni Üye Oluştur
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* System Logs Module */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-gray-400" />
                                Sistem Logları
                            </h3>
                            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {stats.recentLogs.map((log) => (
                                    <div key={log.id} className="flex gap-4 p-4 bg-slate-50 border border-gray-100 rounded-2xl group hover:border-blue-200 transition-all">
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${log.level === 'ERROR' ? 'bg-red-500' : log.level === 'WARN' ? 'bg-amber-500' : 'bg-blue-500'
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-slate-500 font-mono mb-1 truncate">{log.message}</p>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(log.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => window.location.href = '/tr/admin/logs'}
                                className="w-full mt-6 py-3 border border-gray-100 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                Tüm Logları Gör
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Components Hub */}
                <div className="space-y-8">

                    {/* Notes Module */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                            <StickyNote className="w-5 h-5 text-yellow-500" />
                            Yönetici Notları
                        </h3>
                        <form onSubmit={handleAddNote} className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Not al..."
                                    className="w-full bg-slate-50 border border-gray-100 rounded-2xl py-4 pl-5 pr-12 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {notes.map(note => (
                                <div key={note.id} className="group relative p-5 bg-yellow-50 border border-yellow-100 rounded-[1.5rem] flex items-start gap-4 hover:border-yellow-300 transition-all">
                                    <div className="flex-1 text-sm text-yellow-900/80 leading-relaxed font-medium">{note.content}</div>
                                    <button
                                        onClick={() => handleDeleteNote(note.id)}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Latest Members List */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            Son Kayıtlar
                        </h3>
                        <div className="space-y-6">
                            {stats.users.latest.map(u => (
                                <div key={u.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 shrink-0">
                                            {u.name?.[0] || 'A'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-slate-800 truncate">{u.name || u.email.split('@')[0]}</p>
                                            <p className="text-[10px] text-slate-400 font-bold truncate">{u.email}</p>
                                        </div>
                                    </div>
                                    <Link href={`/tr/admin/users?id=${u.id}`} className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Blog Summary Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-[2.5rem] shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black">Blog Durumu</h3>
                            <BookOpen className="w-6 h-6 text-white/40" />
                        </div>
                        <div className="space-y-4 mb-8">
                            {stats.blogs.map(blog => (
                                <div key={blog.id} className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${blog.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                                    <span className="text-xs font-bold text-white/80 truncate flex-1">{blog.title}</span>
                                </div>
                            ))}
                            {stats.blogs.length === 0 && <p className="text-xs text-white/50 italic">Henüz blog yazısı yok.</p>}
                        </div>
                        <button
                            onClick={() => window.location.href = '/tr/admin/blogs'}
                            className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold text-sm transition-all text-center"
                        >
                            İçerikleri Yönet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatTile({ label, value, subtitle, icon, color }: any) {
    const isDark = color === 'bg-[#1e2b4d]';
    return (
        <div className={`${color} p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group`}>
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isDark ? 'bg-white/10 shadow-xl' : 'bg-slate-50 group-hover:scale-110 transition-transform duration-500'}`}>
                    {icon}
                </div>
                <p className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-blue-100/50' : 'text-slate-400'} mb-2`}>{label}</p>
                <p className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-800'} mb-2 tracking-tight`}>{value}</p>
                <p className={`text-xs font-bold ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>{subtitle}</p>
            </div>
        </div>
    );
}
