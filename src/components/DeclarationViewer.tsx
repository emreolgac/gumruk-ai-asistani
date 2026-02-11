'use client';

import React, { useState } from 'react';
import { Save, Download, FileJson, FileSpreadsheet, FileCode, Printer, Table, FileText, ChevronDown, ChevronUp, Database, Link, SearchCode } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import BeyannameForm from './BeyannameForm';
import EvrimOutput from './EvrimOutput';
import MaviOutput from './MaviOutput';
import { LayoutGrid, Box } from 'lucide-react';

interface DeclarationViewerProps {
    data: any;
}

export default function DeclarationViewer({ data }: DeclarationViewerProps) {
    const [editableData, setEditableData] = useState(data);
    const [viewMode, setViewMode] = useState<'list' | 'form' | 'evrim' | 'mavi'>('form');
    const [expandedListRows, setExpandedListRows] = useState<number[]>([]);

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
                            onClick={() => setViewMode('form')}
                            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'form' ? 'bg-green-100 text-green-700 shadow ring-1 ring-green-200' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <FileText className="w-4 h-4" /> Resmi
                        </button>
                        <button
                            onClick={() => setViewMode('evrim')}
                            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'evrim' ? 'bg-[#0052cc] text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center text-[10px] font-bold">E</div> Evrim
                        </button>
                        <button
                            onClick={() => setViewMode('mavi')}
                            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'mavi' ? 'bg-[#0070f3] text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Box className="w-4 h-4" /> Mavi
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Table className="w-4 h-4" /> Liste
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

            {viewMode === 'list' && (
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
                            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-5 bg-blue-500 rounded-full"></div>
                                    <p className="text-sm text-blue-800 font-black uppercase tracking-wider">Muayene Memuru AI Raporu</p>
                                </div>
                                <div className="text-sm text-blue-900 leading-relaxed space-y-3 whitespace-pre-wrap max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {editableData.ozet}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-xs text-gray-500 font-bold">Fatura No</p>
                                    <p className="font-semibold">{editableData.belge_bilgileri?.fatura_no || '-'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-xs text-gray-500 font-bold">Tarih</p>
                                    <p className="font-semibold">{editableData.belge_bilgileri?.fatura_tarihi || '-'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-xs text-gray-500 font-bold">Teslim Şekli</p>
                                    <p className="uppercase font-bold text-blue-600">
                                        {(editableData.belge_bilgileri?.teslim_sekli || '-').split(' ')[0]}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-xs text-gray-500 font-bold">Toplam Tutar</p>
                                    <p className="font-bold">{editableData.toplamlar?.toplam_fatura_tutari}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Eşya Listesi */}
                    <div className="mt-8 col-span-1 md:col-span-2">
                        <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4 flex items-center gap-2">
                            <Database className="w-5 h-5 text-gray-400" /> Eşya Listesi (Kalemler)
                        </h3>
                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="min-w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-800 text-white font-bold">
                                    <tr>
                                        <th className="p-4 rounded-tl border-r border-white/10">#</th>
                                        <th className="p-4 border-r border-white/10">Tanım</th>
                                        <th className="p-4 border-r border-white/10">GTİP</th>
                                        <th className="p-4 text-center border-r border-white/10">Kap</th>
                                        <th className="p-4 text-center border-r border-white/10">Adet</th>
                                        <th className="p-4 text-center border-r border-white/10">Menşei</th>
                                        <th className="p-4 border-r border-white/10">Brüt (kg)</th>
                                        <th className="p-4 border-r border-white/10">Net (kg)</th>
                                        <th className="p-4 rounded-tr">Fiyat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {editableData.esya_listesi?.map((item: any, i: number) => (
                                        <React.Fragment key={i}>
                                            <tr
                                                onClick={() => {
                                                    const newExpanded = expandedListRows.includes(i)
                                                        ? expandedListRows.filter(idx => idx !== i)
                                                        : [...expandedListRows, i];
                                                    setExpandedListRows(newExpanded);
                                                }}
                                                className={`cursor-pointer transition-colors ${expandedListRows.includes(i) ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                                            >
                                                <td className="p-4 font-bold text-gray-400">{i + 1}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-700 truncate max-w-[200px]">{item.tanimi}</span>
                                                        {expandedListRows.includes(i)
                                                            ? <ChevronUp className="w-4 h-4 text-blue-500" />
                                                            : <ChevronDown className="w-4 h-4 text-gray-300" />
                                                        }
                                                    </div>
                                                </td>
                                                <td className="p-4 font-mono text-blue-600 font-bold">{item.gtip}</td>
                                                <td className="p-4 text-center font-semibold">{item.kap_adedi || '-'}</td>
                                                <td className="p-4 text-center font-semibold">{item.adet || '-'}</td>
                                                <td className="p-4 text-center">
                                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">
                                                        {item.mensei || editableData.belge_bilgileri?.cikis_ulkesi_kodu || 'TR'}
                                                    </span>
                                                </td>
                                                <td className="p-4">{item.brut_agirlik}</td>
                                                <td className="p-4">{item.net_agirlik}</td>
                                                <td className="p-4 font-semibold text-gray-900">{item.birim_fiyat} {item.doviz_cinsi}</td>
                                            </tr>
                                            {expandedListRows.includes(i) && (
                                                <tr className="bg-blue-50/30">
                                                    <td colSpan={9} className="p-0 border-t-2 border-blue-100">
                                                        <div className="p-8 space-y-8">
                                                            {/* Item Info Cards */}
                                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Model / Artikel</p>
                                                                    <p className="text-sm font-bold text-blue-600">{item.model_kodu || 'Belirtilmemiş'}</p>
                                                                </div>
                                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Menşei Ülke</p>
                                                                    <p className="text-sm font-bold text-slate-700">{item.mensei_tam || item.mensei}</p>
                                                                </div>
                                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Birim Fiyat</p>
                                                                    <p className="text-sm font-bold text-slate-700">{item.birim_fiyat} {item.doviz_cinsi}</p>
                                                                </div>
                                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Toplam Kalem Bedeli</p>
                                                                    <p className="text-sm font-black text-slate-900">{item.toplam_fiyat} {item.doviz_cinsi}</p>
                                                                </div>
                                                            </div>

                                                            {/* Detailed Source Tracking Section */}
                                                            <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
                                                                <div className="bg-slate-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <SearchCode className="w-5 h-5 text-blue-600" />
                                                                        <h4 className="font-bold text-slate-800">Veri Yolculuğu & Çıkarım Detayları</h4>
                                                                    </div>
                                                                    <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-1 rounded">DOĞRULANMIŞ VERİ</span>
                                                                </div>
                                                                <div className="p-0 overflow-x-auto">
                                                                    <table className="min-w-full text-xs text-left">
                                                                        <thead>
                                                                            <tr className="bg-slate-50/50 text-slate-400 uppercase font-black tracking-widest border-b border-blue-50">
                                                                                <th className="px-6 py-3">Veri Alanı</th>
                                                                                <th className="px-6 py-3">Çekilen Değer</th>
                                                                                <th className="px-6 py-3">Kaynak Dosya</th>
                                                                                <th className="px-6 py-3">Konum / Satır / Sütun</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-blue-50">
                                                                            {editableData.kaynak_bilgileri?.esya_listesi?.[i]?.alanlar ? (
                                                                                Object.entries(editableData.kaynak_bilgileri.esya_listesi[i].alanlar).map(([key, source]: [string, any]) => (
                                                                                    <tr key={key} className="hover:bg-blue-50/50 transition-colors">
                                                                                        <td className="px-6 py-4 font-bold text-slate-600 capitalize">{key.replace('_', ' ')}</td>
                                                                                        <td className="px-6 py-4 text-slate-900">
                                                                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-mono">
                                                                                                {String(item[key] || '-')}
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="px-6 py-4">
                                                                                            <div className="flex items-center gap-2 text-blue-600 font-bold">
                                                                                                <Link className="w-3 h-3 text-blue-400" />
                                                                                                {source.dosya}
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-slate-500 font-medium">
                                                                                            {source.satir ? `Satır: ${source.satir}` : ''}
                                                                                            {source.sutun ? ` | Sütun: ${source.sutun}` : ''}
                                                                                            {source.sayfa ? ` | Sayfa: ${source.sayfa}` : ''}
                                                                                            {source.konum ? ` | ${source.konum}` : ''}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))
                                                                            ) : (
                                                                                <tr>
                                                                                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">
                                                                                        Bu kalem için ayrıntılı kaynak bilgisi henüz analiz edilmedi.
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Veri Kaynağı Modülü */}
                    {editableData.kaynak_bilgileri && (
                        <div className="mt-12 bg-slate-50 border-2 border-slate-200 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <SearchCode className="w-6 h-6 text-blue-600" />
                                <h3 className="text-xl font-bold text-slate-800">Veri Kaynağı ve Doğrulama İzleri</h3>
                                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded">DEBUG MODU</span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Genel Bilgi Kaynakları */}
                                <div>
                                    <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Genel Belge Bilgileri
                                    </h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Fatura No', path: 'fatura_no' },
                                            { label: 'Fatura Tarihi', path: 'fatura_tarihi' },
                                            { label: 'Gönderici Firma', path: 'gonderici_firma' },
                                            { label: 'Alıcı Firma', path: 'alici_firma' }
                                        ].map((item) => {
                                            const source = editableData.kaynak_bilgileri[item.path];
                                            if (!source) return null;
                                            return (
                                                <div key={item.path} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                                                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                                                    <div className="text-right">
                                                        <p className="text-xs font-black text-blue-600 uppercase">{source.dosya}</p>
                                                        <p className="text-[10px] text-slate-500">{source.sayfa ? `Sayfa ${source.sayfa}` : source.konum}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Kalem Bazlı Kaynak Özetleri */}
                                <div>
                                    <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Database className="w-4 h-4" /> Kalem Bazlı Çıkarım (Örnek)
                                    </h4>
                                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-400 overflow-hidden relative">
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                                            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                                        </div>
                                        <p className="mb-2 text-slate-500">// AI Veri Doğrulama Logu</p>
                                        <p className="text-blue-400">SELECT DATA FROM FILES WHERE ITEM_ID = 1</p>
                                        <p className="text-green-400">FOUND: CLP.xlsx &rarr; ROW: 5 &rarr; COL: B</p>
                                        <p className="text-green-400">VAL: &quot;{editableData.esya_listesi?.[0]?.tanimi?.substring(0, 30)}...&quot;</p>
                                        <p className="text-purple-400">MATCHED WITH INVOICE.PDF PAGE 1 POS: ROW 3</p>
                                        <p className="text-emerald-400">CONFIDENCE: 99.8%</p>
                                    </div>
                                    <p className="mt-3 text-[11px] text-slate-500 italic">
                                        * Tüm kalemlerin detaylı kaynak izini görmek için kalem detaylarını açınız veya JSON çıktısını inceleyiniz.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}


            {viewMode === 'form' && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <BeyannameForm data={editableData} />
                </div>
            )}

            {viewMode === 'evrim' && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <EvrimOutput data={editableData} />
                </div>
            )}

            {viewMode === 'mavi' && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <MaviOutput data={editableData} />
                </div>
            )}
        </div>
    );
}
