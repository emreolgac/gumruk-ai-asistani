'use client';

import { useEffect, useState } from 'react';

interface User {
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

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (userId: string, data: Partial<User>) => {
        setActionLoading(userId);
        try {
            await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...data }),
            });
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const deleteUser = async (userId: string) => {
        if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;

        setActionLoading(userId);
        try {
            await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const addCredits = async (userId: string) => {
        const credits = prompt('Eklenecek kredi miktarını girin:');
        if (!credits) return;

        const currentUser = users.find(u => u.id === userId);
        if (!currentUser) return;

        updateUser(userId, { credits: currentUser.credits + parseInt(credits) });
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
            <h1 className="text-3xl font-bold text-white mb-8">👥 Kullanıcı Yönetimi</h1>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Kullanıcı</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Kredi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Analiz</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Kayıt</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="text-white font-medium">{user.name || 'İsimsiz'}</div>
                                        <div className="text-gray-400 text-sm">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN'
                                            ? 'bg-red-900 text-red-300'
                                            : 'bg-gray-600 text-gray-300'
                                        }`}>
                                        {user.role}
                                    </span>
                                    {user.isPremium && (
                                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                                            ⭐ Premium
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-white">{user.credits}</td>
                                <td className="px-6 py-4 text-white">{user._count?.declarations || 0}</td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => addCredits(user.id)}
                                        disabled={actionLoading === user.id}
                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                                    >
                                        +Kredi
                                    </button>
                                    <button
                                        onClick={() => updateUser(user.id, {
                                            role: user.role === 'ADMIN' ? 'USER' : 'ADMIN'
                                        })}
                                        disabled={actionLoading === user.id}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                                    >
                                        {user.role === 'ADMIN' ? 'User Yap' : 'Admin Yap'}
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        disabled={actionLoading === user.id}
                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        Henüz kullanıcı yok
                    </div>
                )}
            </div>
        </div>
    );
}
