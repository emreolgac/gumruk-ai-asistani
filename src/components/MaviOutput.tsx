'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Package, Tag, Globe, Hash } from 'lucide-react';

interface MaviOutputProps {
    data: any;
}

export default function MaviOutput({ data }: MaviOutputProps) {
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const toggleRow = (index: number) => {
        setExpandedRows(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const getSafe = (path: string[], defaultValue = '') => {
        try {
            return path.reduce((acc, curr) => (acc && acc[curr] ? acc[curr] : null), data) || defaultValue;
        } catch (e) {
            return defaultValue;
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg border-2 border-slate-200 font-sans text-xs text-slate-700 shadow-inner">
            <div className="flex items-center gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="w-10 h-10 bg-[#0070f3] rounded-full flex items-center justify-center text-white shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <div>
                    <h3 className="font-black text-[#0070f3] text-sm tracking-tight m-0">MAVİ GÜMRÜK OTOMASYONU</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase m-0">Dijital Beyanname Entegrasyonu</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                    <div className="border-l-4 border-[#0070f3] pl-3">
                        <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Gönderici</label>
                        <p className="font-bold">{getSafe(['gonderici_firma', 'adi'])}</p>
                    </div>
                    <div className="border-l-4 border-slate-200 pl-3">
                        <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Alıcı</label>
                        <p className="font-bold">{getSafe(['alici_firma', 'adi'])}</p>
                    </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Fatura</label>
                        <p className="font-mono font-bold text-slate-800">{getSafe(['belge_bilgileri', 'fatura_no'])}</p>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Rejim</label>
                        <p className="font-mono font-bold text-[#0070f3]">{getSafe(['belge_bilgileri', 'rejim_kodu'])} / {getSafe(['belge_bilgileri', 'beyanname_tipi'])}</p>
                    </div>
                    <div className="col-span-2">
                        <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Teslim Şekli</label>
                        <p className="font-bold text-slate-600 tracking-widest">{getSafe(['belge_bilgileri', 'teslim_sekli'])}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0070f3] text-white">
                        <tr>
                            <th className="p-4 font-black border-r border-white/20">#</th>
                            <th className="p-4 font-black border-r border-white/20">KALEM</th>
                            <th className="p-4 font-black border-r border-white/20">GTİP KODU</th>
                            <th className="p-4 font-black text-center border-r border-white/20">KAP</th>
                            <th className="p-4 font-black text-center border-r border-white/20">ADET</th>
                            <th className="p-4 font-black text-center border-r border-white/20">MENŞEİ</th>
                            <th className="p-4 font-black border-r border-white/20">AĞIRLIK (BRÜT)</th>
                            <th className="p-4 font-black text-right">BEDEL</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.esya_listesi?.map((item: any, i: number) => (
                            <React.Fragment key={i}>
                                <tr
                                    onClick={() => toggleRow(i)}
                                    className={`cursor-pointer transition-colors ${expandedRows.includes(i) ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                                >
                                    <td className="p-4 font-bold text-slate-600">{i + 1}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <div className="font-bold">{item.tanimi?.substring(0, 40)}{item.tanimi?.length > 40 ? '...' : ''}</div>
                                            </div>
                                            {expandedRows.includes(i) ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono font-bold text-slate-900 tracking-tighter">{item.gtip}</td>
                                    <td className="p-4 text-center font-semibold text-slate-700">{item.kap_adedi || '-'}</td>
                                    <td className="p-4 text-center font-semibold text-slate-700">{item.adet || '-'}</td>
                                    <td className="p-4 text-center">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold">
                                            {item.mensei || getSafe(['belge_bilgileri', 'cikis_ulkesi_kodu'], 'TR')}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-slate-500">{item.brut_agirlik} KG</td>
                                    <td className="p-4 text-right font-black text-[#0070f3]">{item.toplam_fiyat} {item.doviz_cinsi}</td>
                                </tr>
                                {expandedRows.includes(i) && (
                                    <tr className="bg-blue-50/50">
                                        <td colSpan={8} className="p-6 border-b border-blue-100">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* Left Side: Product Details */}
                                                <div className="space-y-4">
                                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Ürün Kimlik Kartı</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <DetailItem icon={<Package size={14} />} label="TANIM" value={item.tanimi} span2 />
                                                        <DetailItem icon={<Tag size={14} />} label="MODEL" value={item.model_kodu || item.urun_kodu} highlight />
                                                        <DetailItem icon={<Hash size={14} />} label="GTİP" value={item.gtip} />
                                                        <DetailItem icon={<Globe size={14} />} label="MENŞEİ" value={item.mensei_tam || item.mensei} />

                                                        {item.uyarilar && item.uyarilar.length > 0 && (
                                                            <div className="col-span-2 bg-red-50 border border-red-100 p-3 rounded-lg">
                                                                <p className="text-red-600 font-bold text-[10px] uppercase mb-1">⚠️ Mevzuat Uyarıları</p>
                                                                <ul className="list-disc list-inside text-red-500 font-medium space-y-1">
                                                                    {item.uyarilar.map((uyari: string, idx: number) => (
                                                                        <li key={idx}>{uyari}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right Side: Tax Calculation (If available) */}
                                                {item.vergiler && (
                                                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                                                        <h4 className="text-xs font-black text-[#0070f3] uppercase tracking-widest border-b border-blue-50 pb-2 mb-3 flex justify-between">
                                                            <span>Tahmini Vergi Dökümü</span>
                                                            <span className="text-[10px] opacity-70">Kur: {item.vergiler.dovizKuru || '34.50'} TL</span>
                                                        </h4>

                                                        <div className="space-y-2 text-xs">
                                                            <div className="flex justify-between items-center text-slate-500">
                                                                <span>Matrah (CIF TL)</span>
                                                                <span className="font-mono">{formatCurrency(item.vergiler.baseAmountTry || (item.toplam_fiyat * 34.50))} TL</span>
                                                            </div>

                                                            <div className="flex justify-between items-center">
                                                                <span className="font-semibold text-slate-600">Gümrük Vergisi (%{item.vergiler.oranlar?.gvRate || 0})</span>
                                                                <span className="font-mono font-bold text-slate-800">{formatCurrency(item.vergiler.gvHesa)} TL</span>
                                                            </div>

                                                            {item.vergiler.igvHesap > 0 && (
                                                                <div className="flex justify-between items-center">
                                                                    <span className="font-semibold text-slate-600">İlave GV (%{item.vergiler.oranlar?.igvRate})</span>
                                                                    <span className="font-mono font-bold text-slate-800">{formatCurrency(item.vergiler.igvHesap)} TL</span>
                                                                </div>
                                                            )}

                                                            {item.vergiler.otvHesap > 0 && (
                                                                <div className="flex justify-between items-center">
                                                                    <span className="font-semibold text-slate-600">ÖTV (%{item.vergiler.oranlar?.otvRate})</span>
                                                                    <span className="font-mono font-bold text-slate-800">{formatCurrency(item.vergiler.otvHesap)} TL</span>
                                                                </div>
                                                            )}

                                                            <div className="flex justify-between items-center">
                                                                <span className="font-semibold text-slate-600">Damga & KKDF</span>
                                                                <span className="font-mono font-bold text-slate-800">{formatCurrency((item.vergiler.damgaHesap || 0) + (item.vergiler.kkdfHesap || 0))} TL</span>
                                                            </div>

                                                            <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200">
                                                                <span className="font-semibold text-slate-600">KDV (%{item.vergiler.oranlar?.kdvRate || 20})</span>
                                                                <span className="font-mono font-bold text-slate-800">{formatCurrency(item.vergiler.kdvHesap)} TL</span>
                                                            </div>

                                                            <div className="flex justify-between items-center pt-3 mt-2 border-t border-blue-100">
                                                                <span className="font-black text-[#0070f3]">TOPLAM VERGİ YÜKÜ</span>
                                                                <span className="font-mono font-black text-[#0070f3] text-sm">{formatCurrency(item.vergiler.toplamVergi)} TL</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- NEW: Auditor Report Section --- */}
            {data.denetmen_raporu && (
                <div className="mt-8 bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                    </div>

                    <div className="flex items-start justify-between mb-6 relative z-10">
                        <div>
                            <h3 className="text-xl font-black tracking-tight text-white mb-1 flex items-center gap-2">
                                <span className="bg-white/20 p-1 rounded">⚖️</span>
                                MEVZUAT DENETMEN RAPORU
                            </h3>
                            <p className="text-slate-400 text-sm font-medium">Yapay Zeka Destekli Gümrük Müfettişi İncelemesi</p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-black text-white tracking-tighter">
                                {data.denetmen_raporu.score}<span className="text-xl text-slate-500">/100</span>
                            </div>
                            <div className={`text-[10px] font-bold uppercase py-1 px-2 rounded-full inline-block mt-1 ${data.denetmen_raporu.score >= 80 ? 'bg-green-500/20 text-green-400' :
                                    data.denetmen_raporu.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                }`}>
                                {data.denetmen_raporu.verificationStatus}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-slate-300 italic text-sm">"{data.denetmen_raporu.summary}"</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Critical Issues */}
                            {data.denetmen_raporu.criticalIssues?.length > 0 && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                                    <h4 className="text-red-400 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                                        🚫 KRİTİK HATALAR
                                    </h4>
                                    <ul className="space-y-2">
                                        {data.denetmen_raporu.criticalIssues.map((issue: string, i: number) => (
                                            <li key={i} className="flex gap-2 text-xs text-red-200">
                                                <span className="text-red-500">•</span>
                                                {issue}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Warnings & Suggestions */}
                            <div className="space-y-4">
                                {data.denetmen_raporu.warnings?.length > 0 && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                                        <h4 className="text-yellow-400 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                                            ⚠️ DİKKAT EDİLMESİ GEREKENLER
                                        </h4>
                                        <ul className="space-y-2">
                                            {data.denetmen_raporu.warnings.map((warn: string, i: number) => (
                                                <li key={i} className="flex gap-2 text-xs text-yellow-200">
                                                    <span className="text-yellow-500">•</span>
                                                    {warn}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 flex justify-between items-center bg-white border-2 border-slate-200 p-6 rounded-2xl shadow-sm">
                <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Toplam Fatura Bedeli</label>
                    <p className="text-2xl font-black tracking-tight text-slate-800">{getSafe(['toplamlar', 'toplam_fatura_tutari'])}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold">DİJİTAL SİSTEM ONAYI</p>
                    <p className="font-mono text-[10px] text-[#0070f3] tracking-widest">VERIFIED-BY-MAVI-AI</p>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ icon, label, value, highlight, span2 }: any) {
    return (
        <div className={`space-y-2 ${span2 ? 'col-span-2' : ''}`}>
            <div className="flex items-center gap-2 text-[#0070f3] opacity-70">
                {icon}
                <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
            </div>
            <p className={`font-bold text-sm uppercase leading-relaxed ${highlight ? 'text-[#0070f3]' : 'text-slate-800'}`}>{value}</p>
        </div>
    );
}
