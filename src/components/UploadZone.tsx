'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
    files: File[];
    onFilesChange: (files: File[]) => void;
}

export default function UploadZone({ files, onFilesChange }: UploadZoneProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Prevent duplicates
        const newFiles = acceptedFiles.filter(
            (newFile) => !files.some((existingFile) => existingFile.name === newFile.name && existingFile.size === newFile.size)
        );
        onFilesChange([...files, ...newFiles]);
    }, [files, onFilesChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxSize: 10 * 1024 * 1024 // 10MB
    });

    const removeFile = (index: number) => {
        onFilesChange(files.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-[2rem] p-10 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group
          ${isDragActive ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-6 relative z-10">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors duration-300 ${isDragActive ? 'bg-blue-100' : 'bg-slate-50 group-hover:bg-white group-hover:shadow-lg'}`}>
                        {isDragActive ? (
                            <Upload className="w-10 h-10 text-blue-600 animate-bounce" />
                        ) : (
                            <Upload className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        )}
                    </div>
                    <div className="space-y-2">
                        <p className="text-xl font-black text-slate-700 group-hover:text-blue-600 transition-colors">
                            {isDragActive ? 'Dosyaları buraya bırakın' : 'Dosyaları Sürükleyin veya Seçin'}
                        </p>
                        <p className="text-sm font-bold text-slate-400">
                            Fatura, Çeki Listesi, Ordino (PDF, JPG, PNG, XLS, XLSX)
                        </p>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 space-y-3"
                    >
                        {files.map((file, index) => (
                            <motion.div
                                key={`${file.name}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                        <FileText className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="flex flex-col items-start min-w-0">
                                        <p className="font-bold text-slate-800 text-sm truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                                        <p className="text-[11px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                    className="p-2 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
