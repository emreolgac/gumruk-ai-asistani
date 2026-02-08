'use client';

import { useState } from 'react';
import UploadZone from '@/components/UploadZone';
import DeclarationViewer from '@/components/DeclarationViewer';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function DashboardPage() {
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleAnalysisStart = () => {
        setResult(null);
        setError('');
    };

    const handleAnalysisComplete = (data: any) => {
        setResult(data);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="flex items-center justify-between p-4 bg-white shadow-sm border-b">
                <div className="text-xl font-bold text-blue-600">Gümrük.AI Dashboard</div>
                <div className="flex items-center gap-4">
                    {/* Credits info could go here */}
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Kredi: <span className="font-bold text-blue-600">5</span>
                    </div>
                    <LanguageSwitcher />
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Yeni Beyanname Oluştur</h1>
                    <p className="text-gray-500">Belgelerinizi yükleyin, yapay zeka sizin için analiz etsin.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Upload Area */}
                <UploadZone
                    onAnalysisStart={handleAnalysisStart}
                    onAnalysisComplete={handleAnalysisComplete}
                    onError={setError}
                />

                {/* Results Area */}
                {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <DeclarationViewer data={result} />
                    </div>
                )}

            </main>
        </div>
    );
}
