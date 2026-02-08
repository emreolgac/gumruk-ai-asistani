'use client';

import { useState, useEffect } from 'react';
import { User, Plus, Trash2, Shield, UserCircle, Coins, Search, X } from 'lucide-react';

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

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            if (res.ok) fetchUsers();
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

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
                    <p className="text-gray-400 mt-1">Sistemdeki tüm kullanıcıları yönetin ve manuel kayıt oluşturun.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Kullanıcı Ekle
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Kullanıcı ara (isim veya email)..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-3xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/80 border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Kullanıcı</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Rol</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Kredi</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Analizler</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Kayıt Tarihi</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4 h-16 bg-white/5"></td>
                                    </tr>
                                ))
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
                                                {user.name?.[0] || user.email?.[0] || '?'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{user.name || 'İsimsiz'}</div>
                                                <div className="text-xs text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleUpdateUser(user.id, { role: e.target.value })}
                                            className="bg-gray-900 border border-gray-700 text-sm rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="USER">User</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Coins className="w-4 h-4 text-yellow-500" />
                                            <input
                                                type="number"
                                                value={user.credits}
                                                onChange={(e) => handleUpdateUser(user.id, { credits: parseInt(e.target.value) })}
                                                className="w-16 bg-gray-900 border border-gray-700 text-sm rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {user._count.declarations} analiz
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
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

            {/* Create User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-gray-900 border border-white/10 rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <UserCircle className="w-7 h-7 text-blue-500" />
                                Yeni Kullanıcı Oluştur
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tam İsim</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Adresi</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Şifre</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Rol</label>
                                        <select
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        >
                                            <option value="USER">Standart Kullanıcı</option>
                                            <option value="ADMIN">Yönetici (Admin)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Başlangıç Kredisi</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            value={newUser.credits}
                                            onChange={(e) => setNewUser({ ...newUser, credits: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 py-2">
                                    <input
                                        type="checkbox"
                                        id="isPremium"
                                        className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
                                        checked={newUser.isPremium}
                                        onChange={(e) => setNewUser({ ...newUser, isPremium: e.target.checked })}
                                    />
                                    <label htmlFor="isPremium" className="text-sm font-medium text-gray-300">Premium Üye Olarak İşaretle</label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all"
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
