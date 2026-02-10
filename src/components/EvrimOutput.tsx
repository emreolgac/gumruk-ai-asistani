'use client';

import React from 'react';

interface EvrimOutputProps {
    data: any;
}

export default function EvrimOutput({ data }: EvrimOutputProps) {
    const getSafe = (path: string[], defaultValue = '') => {
        try {
            return path.reduce((acc, curr) => (acc && acc[curr] ? acc[curr] : null), data) || defaultValue;
        } catch (e) {
            return defaultValue;
        }
    };

    return (
        <div className="bg-[#f0f4f8] p-6 rounded-xl border border-[#cbd5e1] font-mono text-[11px] text-[#1e293b]">
            <div className="flex items-center justify-between mb-4 border-b-2 border-[#3b82f6] pb-2">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#0052cc] rounded flex items-center justify-center text-white font-bold">E</div>
                    <span className="font-bold text-[#0052cc] text-xs uppercase">Evrim Gümrük Müşavirliği Sistemi</span>
                </div>
                <div className="text-right italic text-slate-400">Veri Aktarım Modülü v2.4</div>
            </div>

            <div className="grid grid-cols-3 gap-0 border border-[#94a3b8]">
                {/* Row 1 */}
                <div className="p-2 border-r border-b border-[#94a3b8] bg-[#e2e8f0] font-bold">GÖNDERİCİ BİLGİSİ</div>
                <div className="p-2 border-r border-b border-[#94a3b8] col-span-2">{getSafe(['gonderici_firma', 'adi'])}</div>

                {/* Row 2 */}
                <div className="p-2 border-r border-b border-[#94a3b8] bg-[#e2e8f0] font-bold">ALICI BİLGİSİ</div>
                <div className="p-2 border-r border-b border-[#94a3b8] col-span-2">
                    {getSafe(['alici_firma', 'adi'])} (VKN: {getSafe(['alici_firma', 'vergi_no'])})
                </div>

                {/* Row 3 */}
                <div className="p-2 border-r border-b border-[#94a3b8] bg-[#e2e8f0] font-bold">FATURA NO / TARİH</div>
                <div className="p-2 border-r border-b border-[#94a3b8]">{getSafe(['belge_bilgileri', 'fatura_no'])}</div>
                <div className="p-2 border-b border-[#94a3b8]">{getSafe(['belge_bilgileri', 'fatura_tarihi'])}</div>

                {/* Row 4 */}
                <div className="p-2 border-r border-[#94a3b8] bg-[#e2e8f0] font-bold">TESLİM / REJİM</div>
                <div className="p-2 border-r border-[#94a3b8] font-bold text-[#0052cc]">
                    {getSafe(['belge_bilgileri', 'teslim_sekli'])} / {getSafe(['belge_bilgileri', 'rejim_kodu'])}
                </div>
                <div className="p-2 font-bold text-[#0052cc]">{getSafe(['belge_bilgileri', 'beyanname_tipi'])}</div>
            </div>

            <div className="mt-4">
                <table className="w-full border-collapse border border-[#94a3b8]">
                    <thead className="bg-[#0052cc] text-white">
                        <tr>
                            <th className="p-1 border border-[#94a3b8]">KLM</th>
                            <th className="p-1 border border-[#94a3b8] text-left">EŞYA TANIMI</th>
                            <th className="p-1 border border-[#94a3b8]">GTİP</th>
                            <th className="p-1 border border-[#94a3b8]">BRÜT</th>
                            <th className="p-1 border border-[#94a3b8]">NET</th>
                            <th className="p-1 border border-[#94a3b8]">TUTAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.esya_listesi?.map((item: any, i: number) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}>
                                <td className="p-1 border border-[#94a3b8] text-center">{i + 1}</td>
                                <td className="p-1 border border-[#94a3b8] uppercase">{item.tanimi}</td>
                                <td className="p-1 border border-[#94a3b8] font-bold">{item.gtip}</td>
                                <td className="p-1 border border-[#94a3b8] text-right">{item.brut_agirlik}</td>
                                <td className="p-1 border border-[#94a3b8] text-right">{item.net_agirlik}</td>
                                <td className="p-1 border border-[#94a3b8] text-right font-bold">{item.toplam_fiyat} {item.doviz_cinsi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center text-[10px] font-bold uppercase">
                <div className="text-[#0052cc]">TOPLAM TUTAR: {getSafe(['toplamlar', 'toplam_fatura_tutari'])}</div>
                <div className="text-slate-500">ÇIKTI ALINDI: {new Date().toLocaleString()}</div>
            </div>
        </div>
    );
}
