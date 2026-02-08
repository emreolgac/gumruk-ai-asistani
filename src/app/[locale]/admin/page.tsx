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
    PieChart as PieIcon
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
    Area,
    PieChart,
    Cell,
    Pie
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
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-slate-400 font-bold animate-pulse">VERİLER YÜKLENİYOR...</p>
                </div>
            </div>
        );
    }

    const chartData = [
        { name: 'Ocak', value: 400, value2: 240 },
        { name: 'Şubat', value: 300, value2: 139 },
        { name: 'Mart', value: 200, value2: 980 },
        { name: 'Nisan', value: 278, value2: 390 },
        { name: 'Mayıs', value: 189, value2: 480 },
        { name: 'Haziran', value: 239, value2: 380 },
    ];

    const pieData = [
        { name: 'Premium', value: stats.users.total * 0.45 },
        { name: 'Standart', value: stats.users.total * 0.55 },
    ];
    const COLORS = ['#3b82f6', '#f59e0b'];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Admin</h1>
                <button className="lg:hidden p-2 bg-white rounded-lg shadow-sm">
                    <Activity className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Stats Grid - Matching UI Template */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <CompactStatCard
                    label="Earning"
                    value={`$ ${stats.revenue.total.toFixed(0)}`}
                    color="bg-[#1e2b4d]"
                    textColor="text-white"
                    icon={<DollarSign className="w-4 h-4" />}
                />
                <CompactStatCard
                    label="Share"
                    value={stats.hits.total}
                    icon={<Share2 className="w-5 h-5 text-orange-400" />}
                />
                <CompactStatCard
                    label="Likes"
                    value={stats.users.total}
                    icon={<ThumbsUp className="w-5 h-5 text-orange-400" />}
                />
                <CompactStatCard
                    label="Rating"
                    value="8,5"
                    icon={<Star className="w-5 h-5 text-orange-400" />}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Main Charts area */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-slate-700">Result</h3>
                            <button className="px-4 py-1.5 bg-orange-400 text-white text-xs font-bold rounded-lg hover:bg-orange-500 transition-colors">Check Now</button>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="value" fill="#1e2b4d" radius={[4, 4, 0, 0]} barSize={12} />
                                    <Bar dataKey="value2" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <Area type="monotone" dataKey="value2" stroke="#1e2b4d" fill="#f0f2f5" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Charts */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center h-full">
                        <div className="relative inline-block mb-8">
                            <div className="h-48 w-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-2xl text-slate-800">
                                45%
                            </div>
                        </div>

                        <div className="space-y-4 text-left">
                            <LegendItem label="Lorem ipsum" color="bg-blue-500" />
                            <LegendItem label="Lorem ipsum" color="bg-orange-400" />
                            <LegendItem label="Lorem ipsum" color="bg-slate-200" />
                            <LegendItem label="Lorem ipsum" color="bg-slate-100" />
                        </div>

                        <button className="w-full mt-10 py-3 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20">
                            Check Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CompactStatCard({ label, value, icon, color, textColor }: any) {
    return (
        <div className={`${color || 'bg-white'} p-6 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between`}>
            <div>
                <p className={`text-xs font-bold ${textColor || 'text-slate-400'} mb-2`}>{label}</p>
                <p className={`text-3xl font-black ${textColor || 'text-slate-800'}`}>{value}</p>
            </div>
            {icon && (
                <div className={`p-3 rounded-xl bg-slate-50 flex items-center justify-center`}>
                    {icon}
                </div>
            )}
            {!icon && color && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                </div>
            )}
        </div>
    );
}

function LegendItem({ label, color }: { label: string, color: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-sm text-slate-500 font-medium">{label}</span>
        </div>
    );
}

function RefreshCw(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
    );
}
