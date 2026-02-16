'use client';

import { useState, useEffect } from 'react';
import { User, Plus, Trash2, Shield, UserCircle, Coins, Search, X, Gift, History, AlertTriangle } from 'lucide-react';

interface AdminUser {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    credits: number;
    isPremium: boolean;
    createdAt: string;
    _count: {
        declarations: number;
    };
}

interface CreditTransaction {
    id: string;
    amount: number;
    type: string;
    description: string;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Credit modal state
    const [creditModal, setCreditModal] = useState<{ open: boolean; user: AdminUser | null }>({ open: false, user: null });
    const [creditAmount, setCreditAmount] = useState(10);
    const [creditDesc, setCreditDesc] = useState('');
    const [creditLoading, setCreditLoading] = useState(false);
    const [creditHistory, setCreditHistory] = useState<CreditTransaction[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // New user form state
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        credits: 5,
        isPremium: false
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.users) setUsers(data.users);
        } catch (error) {
            console.error('Fetch users error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (userId: string, data: any) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...data }),
            });
            if (res.ok) fetchUsers();
        } catch (error) {
            console.error('Update user error:', error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            if (res.ok) {
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || 'Silme işlemi başarısız');
            }
        } catch (error) {
            console.error('Delete user error:', error);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setNewUser({ name: '', email: '', password: '', role: 'USER', credits: 5, isPremium: false });
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || 'Bir hata oluştu');
            }
        } catch (error) {
            console.error('Create user error:', error);
        }
    };

    // Credit functions
    const openCreditModal = (user: AdminUser) => {
        setCreditModal({ open: true, user });
        setCreditAmount(10);
        setCreditDesc('');
        setShowHistory(false);
        setCreditHistory([]);
    };

    const handleGiveCredit = async () => {
        if (!creditModal.user || creditAmount === 0) return;
        setCreditLoading(true);
        try {
            const res = await fetch('/api/admin/credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: creditModal.user.id,
                    amount: creditAmount,
                    description: creditDesc || undefined,
                }),
            });
            if (res.ok) {
                setCreditModal({ open: false, user: null });
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || 'Kredi işlemi başarısız');
            }
        } catch (error) {
            console.error('Credit error:', error);
        } finally {
            setCreditLoading(false);
        }
    };

    const fetchCreditHistory = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/credits?userId=${userId}`);
            const data = await res.json();
            setCreditHistory(data.transactions || []);
            setShowHistory(true);
        } catch (error) {
            console.error('Credit history error:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const quickCredits = [5, 10, 25, 50, 100];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Kullanıcı Yönetimi</h1>
                    <p className="text-slate-500 mt-1">Sistemdeki tüm kullanıcıları yönetin, kredi verin ve manuel kayıt oluşturun.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Kullanıcı Ekle
                </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Toplam Üye</div>
                    <div className="text-3xl font-black text-slate-800">{users.length}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Admin</div>
                    <div className="text-3xl font-black text-red-600">{users.filter(u => u.role === 'ADMIN').length}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Premium</div>
                    <div className="text-3xl font-black text-purple-600">{users.filter(u => u.isPremium).length}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Toplam Kredi</div>
                    <div className="text-3xl font-black text-amber-600">{users.reduce((acc, u) => acc + u.credits, 0)}</div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Kullanıcı ara (isim veya email)..."
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kullanıcı</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Rol</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kredi</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Analizler</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kayıt</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4 h-16 bg-slate-50/50"></td>
                                    </tr>
                                ))
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.role === 'ADMIN'
                                                    ? 'bg-red-50 text-red-600'
                                                    : user.isPremium
                                                        ? 'bg-purple-50 text-purple-600'
                                                        : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                {user.name?.[0] || user.email?.[0] || '?'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 flex items-center gap-2">
                                                    {user.name || 'İsimsiz'}
                                                    {user.role === 'ADMIN' && (
                                                        <span className="text-[9px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full uppercase">Admin</span>
                                                    )}
                                                    {user.isPremium && (
                                                        <span className="text-[9px] font-black bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full uppercase">Premium</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleUpdateUser(user.id, { role: e.target.value })}
                                            className="bg-slate-50 border border-gray-200 text-sm rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
                                        >
                                            <option value="USER">User</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Coins className="w-4 h-4 text-amber-500" />
                                            <span className="font-black text-slate-800">{user.credits}</span>
                                            <button
                                                onClick={() => openCreditModal(user)}
                                                className="ml-1 p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                                                title="Kredi Ver"
                                            >
                                                <Gift className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                        {user._count.declarations} analiz
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Kullanıcıyı Sil"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ═══════════ CREDIT MODAL ═══════════ */}
            {creditModal.open && creditModal.user && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCreditModal({ open: false, user: null })} />
                    <div className="relative bg-white border border-gray-200 rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                                <Coins className="w-7 h-7 text-amber-500" />
                                Kredi Yönetimi
                            </h2>
                            <button onClick={() => setCreditModal({ open: false, user: null })} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-lg">
                                    {creditModal.user.name?.[0] || '?'}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">{creditModal.user.name || creditModal.user.email}</div>
                                    <div className="text-xs text-slate-400">{creditModal.user.email}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-400 font-bold uppercase">Mevcut Kredi</div>
                                <div className="text-2xl font-black text-amber-600">{creditModal.user.credits}</div>
                            </div>
                        </div>

                        {!showHistory ? (
                            <>
                                {/* Quick Credit Buttons */}
                                <div className="mb-4">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Hızlı Seçim</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {quickCredits.map(q => (
                                            <button
                                                key={q}
                                                onClick={() => setCreditAmount(q)}
                                                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${creditAmount === q
                                                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                                                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                    }`}
                                            >
                                                +{q}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Amount */}
                                <div className="mb-4">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Miktar</label>
                                    <input
                                        type="number"
                                        value={creditAmount}
                                        onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Negatif değer girerseniz kredi düşürürsünüz.</p>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Açıklama (Opsiyonel)</label>
                                    <input
                                        type="text"
                                        placeholder="Örn: Kampanya hediyesi, test kredisi..."
                                        value={creditDesc}
                                        onChange={(e) => setCreditDesc(e.target.value)}
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Preview */}
                                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6 text-center">
                                    <span className="text-sm text-green-700 font-medium">Yeni Bakiye: </span>
                                    <span className="text-2xl font-black text-green-700">
                                        {creditModal.user.credits + creditAmount}
                                    </span>
                                    <span className="text-sm text-green-600/60 ml-1">kredi</span>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => fetchCreditHistory(creditModal.user!.id)}
                                        className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <History className="w-4 h-4" />
                                        Geçmiş
                                    </button>
                                    <button
                                        onClick={handleGiveCredit}
                                        disabled={creditLoading || creditAmount === 0}
                                        className="flex-[2] px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black shadow-lg shadow-green-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Gift className="w-5 h-5" />
                                        {creditAmount > 0 ? `+${creditAmount} Kredi Ver` : `${creditAmount} Kredi Düş`}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Credit History View */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest">Kredi Geçmişi</h3>
                                        <button
                                            onClick={() => setShowHistory(false)}
                                            className="text-xs font-bold text-blue-600 hover:text-blue-500"
                                        >
                                            ← Geri
                                        </button>
                                    </div>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                        {creditHistory.length === 0 ? (
                                            <p className="text-sm text-slate-400 text-center py-8">Henüz kredi işlemi yok.</p>
                                        ) : creditHistory.map(tx => (
                                            <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                <div>
                                                    <div className="text-xs text-slate-500">{tx.description || tx.type}</div>
                                                    <div className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleString('tr-TR')}</div>
                                                </div>
                                                <div className={`font-black text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ═══════════ CREATE USER MODAL ═══════════ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white border border-gray-200 rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                <UserCircle className="w-7 h-7 text-blue-500" />
                                Yeni Kullanıcı Oluştur
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-2">Tam İsim</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-2">Email Adresi</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-2">Şifre</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-2">Rol</label>
                                        <select
                                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        >
                                            <option value="USER">Standart Kullanıcı</option>
                                            <option value="ADMIN">Yönetici (Admin)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-2">Başlangıç Kredisi</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            value={newUser.credits}
                                            onChange={(e) => setNewUser({ ...newUser, credits: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 py-2">
                                    <input
                                        type="checkbox"
                                        id="isPremium"
                                        className="w-5 h-5 rounded bg-slate-50 border-gray-200 text-blue-600 focus:ring-blue-500"
                                        checked={newUser.isPremium}
                                        onChange={(e) => setNewUser({ ...newUser, isPremium: e.target.checked })}
                                    />
                                    <label htmlFor="isPremium" className="text-sm font-medium text-slate-600">Premium Üye Olarak İşaretle</label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all"
                                >
                                    Kullanıcıyı Oluştur
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
