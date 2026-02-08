'use client';

import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { Link } from '@/i18n/routing';

export default function RegisterPage() {
    const t = useTranslations('Auth');

    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/dashboard' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">{t('register')}</h1>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition mb-4"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    Google ile Kayıt Ol
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Veya Email ile</span>
                    </div>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Şifre</label>
                        <input type="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition">
                        {t('register')}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Zaten hesabınız var mı?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        {t('login')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
