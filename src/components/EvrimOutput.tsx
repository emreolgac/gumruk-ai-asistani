'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Package, Tag, Globe, Hash } from 'lucide-react';

interface EvrimOutputProps {
    data: any;
}

export default function EvrimOutput({ data }: EvrimOutputProps) {
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

    const formatPrice = (price: any) => {
        if (!price) return '0,00';
        const num = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : price;
        if (isNaN(num)) return '0,00';
        return num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const cleanDelivery = (term: string) => {
        if (!term) return '';
        return term.split(' ')[0].toUpperCase();
    };

    const totalTutar = data.esya_listesi?.reduce((acc: number, item: any) => {
        const price = typeof item.toplam_fiyat === 'string' ? parseFloat(item.toplam_fiyat.replace(/[^\d.-]/g, '')) : item.toplam_fiyat;
        return acc + (isNaN(price) ? 0 : price);
    }, 0) || 0;

    return (
        <div className="bg-[#f8fafc] p-8 rounded-[2rem] border border-slate-200 font-mono text-[11px] text-slate-700 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-6 border-b-2 border-blue-600 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg">E</div>
                    <div>
                        <span className="font-black text-blue-600 text-sm uppercase tracking-tighter">Evrim Veri Aktarım Sistemi</span>
                        <p className="text-[10px] text-slate-400 font-bold -mt-1 uppercase tracking-widest">Beyanname Entegrasyon Modülü</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100 italic">v2.5 Premium</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <InfoBlock label="GÖNDERİCİ" value={getSafe(['gonderici_firma', 'adi'])} />
                <InfoBlock label="ALICI" value={`${getSafe(['alici_firma', 'adi'])} (VKN: ${getSafe(['alici_firma', 'vergi_no'])})`} />
                <InfoBlock label="BELGE" value={`${getSafe(['belge_bilgileri', 'fatura_no'])} / ${getSafe(['belge_bilgileri', 'fatura_tarihi'])}`} />
                <InfoBlock label="TESLİM/REJİM" value={`${cleanDelivery(getSafe(['belge_bilgileri', 'teslim_sekli']))} / ${getSafe(['belge_bilgileri', 'rejim_kodu'])}`} highlight />
            </div>

            <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-900 text-white uppercase text-[9px] tracking-widest">
                            <th className="p-4 text-center w-12 border-r border-white/10">#</th>
                            <th className="p-4 text-left border-r border-white/10">GTİP / EŞYA</th>
                            <th className="p-4 text-center border-r border-white/10">KAP</th>
                            <th className="p-4 text-center border-r border-white/10">ADET</th>
                            <th className="p-4 text-center border-r border-white/10">MENŞEİ</th>
                            <th className="p-4 text-right border-r border-white/10">KİLO (B/N)</th>
                            <th className="p-4 text-right">TUTAR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.esya_listesi?.map((item: any, i: number) => (
                            <React.Fragment key={i}>
                                <tr
                                    onClick={() => toggleRow(i)}
                                    className={`group cursor-pointer transition-colors ${expandedRows.includes(i) ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                                >
                                    <td className="p-4 text-center font-bold text-slate-400 border-r border-slate-50">{i + 1}</td>
                                    <td className="p-4 border-r border-slate-50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">{item.gtip}</span>
                                            {expandedRows.includes(i) ? <ChevronUp className="w-3 h-3 text-slate-300" /> : <ChevronDown className="w-3 h-3 text-slate-300" />}
                                        </div>
                                        <div className="uppercase font-bold text-slate-600 truncate max-w-[200px]">{item.tanimi}</div>
                                    </td>
                                    <td className="p-4 text-center font-bold text-slate-500 border-r border-slate-50">{item.kap_adedi || '-'}</td>
                                    <td className="p-4 text-center font-bold text-slate-500 border-r border-slate-50">{item.adet || '-'}</td>
                                    <td className="p-4 text-center border-r border-slate-50">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">{item.mensei || getSafe(['belge_bilgileri', 'cikis_ulkesi_kodu'], 'TR')}</span>
                                    </td>
                                    <td className="p-4 text-right border-r border-slate-50">
                                        <div className="font-bold text-slate-600">{item.brut_agirlik} kg</div>
                                        <div className="text-[9px] text-slate-400">{item.net_agirlik} kg</div>
                                    </td>
                                    <td className="p-4 text-right font-black text-slate-900">
                                        {formatPrice(item.toplam_fiyat)} <span className="text-[9px] text-slate-400 ml-1">{item.doviz_cinsi}</span>
                                    </td>
                                </tr>
                                {expandedRows.includes(i) && (
                                    <tr className="bg-blue-50/30">
                                        <td colSpan={7} className="p-6 border-t border-blue-100/50">
                                            <div className="grid grid-cols-4 gap-8">
                                                <DetailItem icon={<Package size={14} />} label="ÜRÜN DETAYI" value={item.tanimi} span2 />
                                                <DetailItem icon={<Tag size={14} />} label="MODEL KODU" value={item.model_kodu || item.urun_kodu || 'BELİRTİLMEMİŞ'} highlight />
                                                <DetailItem icon={<Hash size={14} />} label="GTİP" value={item.gtip} />
                                                <DetailItem icon={<Globe size={14} />} label="MENŞEİ" value={item.mensei_tam || '-'} />
                                                <DetailItem icon={<Tag size={14} />} label="BİRİM FİYAT" value={`${formatPrice(item.birim_fiyat)} ${item.doviz_cinsi}`} />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {/* Grand Total Row */}
                        <tr className="bg-slate-900 text-white">
                            <td colSpan={5} className="p-6 text-right font-black text-xs tracking-widest uppercase italic opacity-60">GENEL TOPLAM ({getSafe(['esya_listesi', '0', 'doviz_cinsi'], 'USD')})</td>
                            <td colSpan={2} className="p-6 text-right">
                                <span className="text-2xl font-black tracking-tighter shadow-sm">{formatPrice(totalTutar)}</span>
                                <span className="text-xs font-bold ml-2 opacity-70">{getSafe(['esya_listesi', '0', 'doviz_cinsi'], 'USD')}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex justify-end text-[9px] font-black text-slate-400 uppercase tracking-widest gap-4">
                <span>AKTİF OTURUM: {new Date().toLocaleString()}</span>
                <span>•</span>
                <span>EVRİM GÜMRÜK ENTEGRASYON SRV</span>
            </div>
        </div>
    );
}

function InfoBlock({ label, value, highlight }: any) {
    return (
        <div className={`p-4 rounded-2xl border ${highlight ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 shadow-sm'}`}>
            <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${highlight ? 'text-blue-200' : 'text-slate-400'}`}>{label}</p>
            <p className={`font-bold truncate text-[10px] ${highlight ? 'text-white' : 'text-slate-700'}`}>{value}</p>
        </div>
    );
}

function DetailItem({ icon, label, value, highlight, span2 }: any) {
    return (
        <div className={`space-y-1.5 ${span2 ? 'col-span-2' : ''}`}>
            <div className="flex items-center gap-2 text-blue-600 opacity-60">
                {icon}
                <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className={`font-black text-xs uppercase leading-tight ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>{value}</p>
        </div>
    );
}
