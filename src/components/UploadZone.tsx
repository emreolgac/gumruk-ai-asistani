'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'; // We need to install this or implement manual drag/drop
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadZoneProps {
    onAnalysisStart: () => void;
    onAnalysisComplete: (result: any) => void;
    onError: (error: string, details?: string, hint?: string) => void;
}

export default function UploadZone({ onAnalysisStart, onAnalysisComplete, onError }: UploadZoneProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxSize: 10 * 1024 * 1024 // 10MB
    });

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);
        onAnalysisStart();

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                // Return full error info if available
                onError(data.error || 'Analiz hatası', data.details, data.hint);
                return;
            }

            onAnalysisComplete(data.result);
        } catch (error: any) {
            console.error(error);
            onError('Bağlantı hatası veya sunucu yanıt vermiyor.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xl font-semibold text-gray-700">
                            {isDragActive ? 'Dosyaları buraya bırakın' : 'Dosyaları sürükleyin veya seçin'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            PDF, JPG, PNG (Maks. 10MB)
                        </p>
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-8 space-y-4">
                    <h3 className="font-semibold text-gray-700">Yüklenecek Dosyalar ({files.length})</h3>
                    <div className="bg-white rounded-lg border border-gray-200 divide-y">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    disabled={isUploading}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                                >
                                    Kaldır
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analiz Ediliyor...
                            </>
                        ) : (
                            <>
                                Analiz Başlat
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
