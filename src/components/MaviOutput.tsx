'use client';

import React from 'react';

interface MaviOutputProps {
    data: any;
}

export default function MaviOutput({ data }: MaviOutputProps) {
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

            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-[#0070f3]/10 text-[#0070f3]">
                        <tr>
                            <th className="p-4 font-black">KALEM</th>
                            <th className="p-4 font-black">GTİP KODU</th>
                            <th className="p-4 font-black">AĞIRLIK (BRÜT)</th>
                            <th className="p-4 font-black text-right">BEDEL</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.esya_listesi?.map((item: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold">{i + 1}</div>
                                    <div className="text-[10px] text-slate-400 uppercase font-medium">{item.tanimi?.substring(0, 30)}...</div>
                                </td>
                                <td className="p-4 font-mono font-bold text-slate-900 tracking-tighter">{item.gtip}</td>
                                <td className="p-4 font-bold text-slate-500">{item.brut_agirlik} KG</td>
                                <td className="p-4 text-right font-black text-[#0070f3]">{item.toplam_fiyat} {item.doviz_cinsi}</td>
                            </tr>
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
