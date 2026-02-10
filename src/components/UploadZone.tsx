'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
    onAnalysisStart: () => void;
    onAnalysisComplete: (result: any) => void;
    onError: (error: string, details?: string, hint?: string) => void;
}

export default function UploadZone({ onAnalysisStart, onAnalysisComplete, onError }: UploadZoneProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
        setUploadSuccess(false);
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
        setUploadSuccess(false);
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);
        setUploadSuccess(false);
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
                onError(data.error || 'Analiz hatası', data.details, data.hint);
                setIsUploading(false); // Make sure to stop loading on error
                return;
            }

            setUploadSuccess(true);
            setTimeout(() => {
                onAnalysisComplete(data.result);
                // Reset states after navigation or data handling
                setUploadSuccess(false);
                setIsUploading(false);
                setFiles([]);
            }, 1500); // Show success message for 1.5s before showing results

        } catch (error: any) {
            console.error(error);
            onError('Bağlantı hatası veya sunucu yanıt vermiyor.');
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 relative overflow-hidden
          ${isDragActive ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4 relative z-10">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300 ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        {isDragActive ? (
                            <Upload className="w-10 h-10 text-blue-600 animate-bounce" />
                        ) : (
                            <Upload className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-700">
                            {isDragActive ? 'Dosyaları buraya bırakın' : 'Dosyaları sürükleyin veya seçin'}
                        </p>
                        <p className="text-sm font-medium text-gray-400 mt-2">
                            PDF, JPG, PNG (Maks. 10MB)
                        </p>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-8 space-y-4"
                    >
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            Yüklenecek Dosyalar
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">{files.length}</span>
                        </h3>
                        <div className="bg-white rounded-xl border border-gray-200 divide-y overflow-hidden shadow-sm">
                            {files.map((file, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{file.name}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-medium text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                                {uploadSuccess && <span className="text-xs font-bold text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> YÜKLENDİ</span>}
                                            </div>
                                        </div>
                                        {/* Success Indicator per file could go here */}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {isUploading && !uploadSuccess && (
                                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                        )}
                                        {uploadSuccess && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                                            >
                                                <CheckCircle2 className="w-5 h-5 text-white" />
                                            </motion.div>
                                        )}
                                        {!isUploading && !uploadSuccess && (
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={isUploading || uploadSuccess}
                            className={`w-full py-4 rounded-xl font-black text-white shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]
                                ${uploadSuccess
                                    ? 'bg-green-500 shadow-green-500/30'
                                    : isUploading
                                        ? 'bg-blue-400 cursor-wait'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-500/30'
                                }`}
                        >
                            {uploadSuccess ? (
                                <>
                                    <CheckCircle2 className="w-6 h-6" />
                                    ANALİZ TAMAMLANDI!
                                </>
                            ) : isUploading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    BELGELER İŞLENİYOR...
                                </>
                            ) : (
                                <>
                                    ANALİZİ BAŞLAT
                                    <Upload className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
