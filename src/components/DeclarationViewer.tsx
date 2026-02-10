'use client';

import { useState } from 'react';
import { Save, Download, FileJson, FileSpreadsheet, FileCode, Printer, Table, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import BeyannameForm from './BeyannameForm';

interface DeclarationViewerProps {
    data: any;
}

export default function DeclarationViewer({ data }: DeclarationViewerProps) {
    const [editableData, setEditableData] = useState(data);
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');

    const handleDownload = (format: 'json' | 'xlsx' | 'pdf') => {
        if (format === 'json') {
            const blob = new Blob([JSON.stringify(editableData, null, 2)], { type: 'application/json' });
            saveAs(blob, 'beyanname.json');
        } else if (format === 'xlsx') {
            // Simple flattening for Excel
            const rows: any[] = [];
            if (editableData.esya_listesi) {
                editableData.esya_listesi.forEach((item: any) => {
                    rows.push({
                        ...item,
                        gonderici: editableData.gonderici_firma?.adi,
                        alici: editableData.alici_firma?.adi,
                        fatura_no: editableData.belge_bilgileri?.fatura_no
                    });
                });
            }
            const ws = XLSX.utils.json_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Beyanname");
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(blob, 'beyanname.xlsx');
        } else if (format === 'pdf') {
            // Trigger browser print dialog, relying on @media print styles
            // Ensure we are in form view before printing
            setViewMode('form');
            setTimeout(() => {
                window.print();
            }, 500);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 border-b pb-4 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    {viewMode === 'list' ? 'Beyanname Özeti' : 'Gümrük Beyannamesi (Taslak)'}
                </h2>

                <div className="flex items-center gap-4">
                    {/* View Toggler */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Table className="w-4 h-4" /> Liste
                        </button>
                        <button
                            onClick={() => setViewMode('form')}
                            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'form' ? 'bg-green-100 text-green-700 shadow ring-1 ring-green-200' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <FileText className="w-4 h-4" /> Beyanname
                        </button>
                    </div>

                    <div className="h-8 w-px bg-gray-300 mx-2"></div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button onClick={() => handleDownload('json')} className="p-2 text-gray-600 hover:bg-gray-100 rounded tooltip" title="JSON İndir"><FileJson size={20} /></button>
                        <button onClick={() => handleDownload('xlsx')} className="p-2 text-green-600 hover:bg-green-50 rounded tooltip" title="Excel İndir"><FileSpreadsheet size={20} /></button>
                        <button onClick={() => handleDownload('pdf')} className="p-2 text-red-600 hover:bg-red-50 rounded tooltip" title="PDF Yazdır"><Printer size={20} /></button>
                    </div>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Gönderici / Alıcı */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 border-b pb-2">Taraflar</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-bold text-gray-500">Gönderici Firma</p>
                                <p>{editableData.gonderici_firma?.adi || '-'}</p>
                                <p className="text-sm text-gray-500">{editableData.gonderici_firma?.adresi}</p>
                                <p className="text-sm text-gray-500">{editableData.gonderici_firma?.ulkesi}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-bold text-gray-500">Alıcı Firma</p>
                                <p>{editableData.alici_firma?.adi || '-'}</p>
                                <p className="text-sm text-gray-500">{editableData.alici_firma?.adresi}</p>
                                <p className="text-sm text-gray-500">VKN: {editableData.alici_firma?.vergi_no}</p>
                            </div>
                        </div>

                        {/* Belge Bilgileri */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 border-b pb-2">Belge Özeti</h3>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <p className="text-sm text-blue-800 font-medium mb-2">AI Özeti</p>
                                <p className="text-sm text-blue-700 italic">"{editableData.ozet}"</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-xs text-gray-500 font-bold">Fatura No</p>
                                    <p>{editableData.belge_bilgileri?.fatura_no || '-'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-xs text-gray-500 font-bold">Tarih</p>
                                    <p>{editableData.belge_bilgileri?.fatura_tarihi || '-'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-xs text-gray-500 font-bold">Teslim Şekli</p>
                                    <p>{editableData.belge_bilgileri?.teslim_sekli || '-'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-xs text-gray-500 font-bold">Toplam Tutar</p>
                                    <p>{editableData.toplamlar?.toplam_fatura_tutari}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Eşya Listesi */}
                    <div className="mt-8 col-span-1 md:col-span-2">
                        <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">Eşya Listesi (Kalemler)</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 font-bold">
                                    <tr>
                                        <th className="p-3 rounded-l">Tanım</th>
                                        <th className="p-3">GTİP</th>
                                        <th className="p-3">Brüt (kg)</th>
                                        <th className="p-3">Net (kg)</th>
                                        <th className="p-3">Miktar</th>
                                        <th className="p-3 rounded-r">Fiyat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {editableData.esya_listesi?.map((item: any, i: number) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="p-3">{item.tanimi}</td>
                                            <td className="p-3 font-mono text-blue-600 font-bold">{item.gtip}</td>
                                            <td className="p-3">{item.brut_agirlik}</td>
                                            <td className="p-3">{item.net_agirlik}</td>
                                            <td className="p-3">{item.adet}</td>
                                            <td className="p-3">{item.birim_fiyat} {item.doviz_cinsi}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <BeyannameForm data={editableData} />
                </div>
            )}

        </div>
    );
}
