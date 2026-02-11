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
                                    <tr className="bg-blue-50">
                                        <td colSpan={8} className="p-6 border-t-2 border-blue-200">
                                            <div className="grid grid-cols-4 gap-6">
                                                <DetailItem icon={<Package size={16} />} label="ÜRÜN DETAYI" value={item.tanimi} span2 />
                                                <DetailItem icon={<Tag size={16} />} label="MODEL KODU" value={item.model_kodu || item.urun_kodu || 'BELİRTİLMEMİŞ'} highlight />
                                                <DetailItem icon={<Hash size={16} />} label="GTİP" value={item.gtip} />
                                                <DetailItem icon={<Globe size={16} />} label="MENŞEİ" value={item.mensei_tam || '-'} />
                                                <DetailItem icon={<Tag size={16} />} label="BİRİM FİYAT" value={`${item.birim_fiyat} ${item.doviz_cinsi}`} />
                                                <DetailItem icon={<Tag size={16} />} label="NET AĞIRLIK" value={`${item.net_agirlik} KG`} />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex justify-between items-center bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-slate-900/10">
                <div>
                    <label className="text-[10px] uppercase font-black text-slate-500 block mb-1">Toplam Fatura Bedeli</label>
                    <p className="text-2xl font-black tracking-tight">{getSafe(['toplamlar', 'toplam_fatura_tutari'])}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold">DİJİTAL SİSTEM ONAYI</p>
                    <p className="font-mono text-[10px] text-green-400 tracking-widest">VERIFIED-BY-MAVI-AI</p>
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
