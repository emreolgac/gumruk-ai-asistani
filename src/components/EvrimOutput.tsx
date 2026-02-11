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
        <div className="bg-white p-8 rounded-2xl border-2 border-slate-300 font-sans text-sm text-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-8 border-b-4 border-blue-600 pb-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-md">E</div>
                    <div>
                        <span className="font-black text-blue-600 text-xl uppercase tracking-tight">Evrim Veri Aktarım Sistemi</span>
                        <p className="text-sm text-slate-500 font-semibold mt-0.5 uppercase tracking-wide">Beyanname Entegrasyon Modülü</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wider border-2 border-blue-200">v2.5 Premium</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                <InfoBlock label="GÖNDERİCİ" value={getSafe(['gonderici_firma', 'adi'])} />
                <InfoBlock label="ALICI" value={`${getSafe(['alici_firma', 'adi'])} (VKN: ${getSafe(['alici_firma', 'vergi_no'])})`} />
                <InfoBlock label="BELGE" value={`${getSafe(['belge_bilgileri', 'fatura_no'])} / ${getSafe(['belge_bilgileri', 'fatura_tarihi'])}`} />
                <InfoBlock label="TESLİM/REJİM" value={`${cleanDelivery(getSafe(['belge_bilgileri', 'teslim_sekli']))} / ${getSafe(['belge_bilgileri', 'rejim_kodu'])}`} highlight />
            </div>

            <div className="overflow-hidden border-2 border-slate-300 rounded-2xl bg-white shadow-md">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-900 text-white uppercase text-xs tracking-wide font-bold">
                            <th className="p-5 text-center w-16 border-r border-white/20">#</th>
                            <th className="p-5 text-left border-r border-white/20">GTİP / EŞYA</th>
                            <th className="p-5 text-center border-r border-white/20">KAP</th>
                            <th className="p-5 text-center border-r border-white/20">ADET</th>
                            <th className="p-5 text-center border-r border-white/20">MENŞEİ</th>
                            <th className="p-5 text-right border-r border-white/20">KİLO (B/N)</th>
                            <th className="p-5 text-right">TUTAR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {data.esya_listesi?.map((item: any, i: number) => (
                            <React.Fragment key={i}>
                                <tr
                                    onClick={() => toggleRow(i)}
                                    className={`group cursor-pointer transition-all duration-200 ${expandedRows.includes(i) ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                                >
                                    <td className="p-5 text-center font-bold text-slate-500 border-r border-slate-100 text-base">{i + 1}</td>
                                    <td className="p-5 border-r border-slate-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-md text-xs">{item.gtip}</span>
                                            {expandedRows.includes(i) ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                        </div>
                                        <div className="uppercase font-semibold text-slate-700 text-sm">{item.tanimi}</div>
                                    </td>
                                    <td className="p-5 text-center font-semibold text-slate-700 border-r border-slate-100">{item.kap_adedi || '-'}</td>
                                    <td className="p-5 text-center font-semibold text-slate-700 border-r border-slate-100">{item.adet || '-'}</td>
                                    <td className="p-5 text-center border-r border-slate-100">
                                        <span className="bg-slate-200 px-3 py-1 rounded-md text-xs font-semibold text-slate-700">{item.mensei || getSafe(['belge_bilgileri', 'cikis_ulkesi_kodu'], 'TR')}</span>
                                    </td>
                                    <td className="p-5 text-right border-r border-slate-100">
                                        <div className="font-semibold text-slate-800 text-sm">{item.brut_agirlik} kg</div>
                                        <div className="text-xs text-slate-500">{item.net_agirlik} kg</div>
                                    </td>
                                    <td className="p-5 text-right font-bold text-slate-900 text-base">
                                        {formatPrice(item.toplam_fiyat)} <span className="text-xs text-slate-500 ml-1">{item.doviz_cinsi}</span>
                                    </td>
                                </tr>
                                {expandedRows.includes(i) && (
                                    <tr className="bg-blue-50">
                                        <td colSpan={7} className="p-8 border-t-2 border-blue-200">
                                            <div className="grid grid-cols-4 gap-6">
                                                <DetailItem icon={<Package size={16} />} label="ÜRÜN DETAYI" value={item.tanimi} span2 />
                                                <DetailItem icon={<Tag size={16} />} label="MODEL KODU" value={item.model_kodu || item.urun_kodu || 'BELİRTİLMEMİŞ'} highlight />
                                                <DetailItem icon={<Hash size={16} />} label="GTİP" value={item.gtip} />
                                                <DetailItem icon={<Globe size={16} />} label="MENŞEİ" value={item.mensei_tam || '-'} />
                                                <DetailItem icon={<Tag size={16} />} label="BİRİM FİYAT" value={`${formatPrice(item.birim_fiyat)} ${item.doviz_cinsi}`} />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {/* Grand Total Row */}
                        <tr className="bg-slate-900 text-white">
                            <td colSpan={5} className="p-6 text-right font-bold text-sm tracking-wide uppercase">GENEL TOPLAM ({getSafe(['esya_listesi', '0', 'doviz_cinsi'], 'USD')})</td>
                            <td colSpan={2} className="p-6 text-right">
                                <span className="text-3xl font-black tracking-tight">{formatPrice(totalTutar)}</span>
                                <span className="text-sm font-semibold ml-2">{getSafe(['esya_listesi', '0', 'doviz_cinsi'], 'USD')}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex justify-end text-xs font-semibold text-slate-500 uppercase tracking-wide gap-4">
                <span>Aktif Oturum: {new Date().toLocaleString('tr-TR')}</span>
                <span>•</span>
                <span>Evrim Gümrük Entegrasyon</span>
            </div>
        </div>
    );
}

function InfoBlock({ label, value, highlight }: any) {
    return (
        <div className={`p-5 rounded-xl border-2 ${highlight ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 shadow-sm'}`}>
            <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${highlight ? 'text-blue-100' : 'text-slate-500'}`}>{label}</p>
            <p className={`font-semibold text-sm ${highlight ? 'text-white' : 'text-slate-800'}`}>{value}</p>
        </div>
    );
}

function DetailItem({ icon, label, value, highlight, span2 }: any) {
    return (
        <div className={`space-y-2 ${span2 ? 'col-span-2' : ''}`}>
            <div className="flex items-center gap-2 text-blue-600 opacity-70">
                {icon}
                <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
            </div>
            <p className={`font-bold text-sm uppercase leading-relaxed ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>{value}</p>
        </div>
    );
}
