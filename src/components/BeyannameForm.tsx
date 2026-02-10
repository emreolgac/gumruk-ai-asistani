'use client';

import React from 'react';

interface BeyannameFormProps {
    data: any;
}

export default function BeyannameForm({ data }: BeyannameFormProps) {
    // Helper to safely get nested data
    const getSafe = (path: string[], defaultValue = '') => {
        try {
            return path.reduce((acc, curr) => (acc && acc[curr] ? acc[curr] : null), data) || defaultValue;
        } catch (e) {
            return defaultValue;
        }
    };

    // Helper to format currency
    const formatCurrency = (val: any, currency = '') => {
        if (val === null || val === undefined || val === '') return '';
        const num = Number(val);
        if (isNaN(num)) return '';
        return `${num.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${currency}`;
    };

    // Helper to render box header
    const BoxHeader = ({ number, title }: { number: string, title?: string }) => (
        <div className="flex items-start gap-1 mb-1">
            <span className="text-[10px] font-bold border border-green-800 px-1 rounded-sm text-green-900 bg-white/50">{number}</span>
            {title && <span className="text-[9px] font-bold text-green-900 uppercase leading-3">{title}</span>}
        </div>
    );

    const firstItem = data.esya_listesi && data.esya_listesi.length > 0 ? data.esya_listesi[0] : {};

    return (
        <div className="w-full overflow-x-auto bg-slate-50 p-4 lg:p-8 rounded-3xl">
            <div className="min-w-[1000px] bg-[#e6f4ea] p-8 text-green-900 font-sans border border-green-200 shadow-sm mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>

                {/* Header Section */}
                <div className="grid grid-cols-12 gap-0 border-2 border-green-800 mb-0">
                    {/* Box 1: Beyan */}
                    <div className="col-span-6 grid grid-cols-3 border-r border-green-800 border-b border-green-800">
                        <div className="p-2 border-r border-green-800">
                            <BoxHeader number="1" title="BEYAN" />
                            <div className="text-xl font-bold text-center mt-2">IM</div>
                        </div>
                        <div className="p-2 border-r border-green-800">
                            <div className="text-xl font-bold text-center mt-8">A</div>
                        </div>
                        <div className="p-2">
                            {/* Empty sub-box */}
                        </div>
                    </div>

                    {/* Box A: Export/Import Office */}
                    <div className="col-span-6 p-2 border-b border-green-800">
                        <BoxHeader number="A" title="GÖNDERİM/İHRACAT GÜMRÜK İDARESİ" />
                        <div className="mt-2 font-bold text-lg text-center">TR340000</div>
                        <div className="text-xs text-center font-medium">İSTANBUL GÜMRÜK MÜDÜRLÜĞÜ</div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-0 border-x-2 border-green-800">
                    {/* Left Column (Sender/Recipient) */}
                    <div className="col-span-6 border-r border-green-800">
                        {/* Box 2: Gönderici */}
                        <div className="p-2 border-b border-green-800 h-32 relative">
                            <BoxHeader number="2" title="GÖNDERİCİ / İHRACATÇI" />
                            <div className="mt-1 text-sm font-bold leading-tight">
                                {getSafe(['gonderici_firma', 'adi'])}
                            </div>
                            <div className="text-xs opacity-80 leading-tight mt-1">
                                {getSafe(['gonderici_firma', 'adresi'])} <br />
                                {getSafe(['gonderici_firma', 'ulkesi'])}
                            </div>
                            <div className="absolute top-2 right-2 text-[10px] font-mono border border-green-600 px-1">NO</div>
                        </div>

                        {/* Box 8: Alıcı */}
                        <div className="p-2 border-b border-green-800 h-32 relative">
                            <BoxHeader number="8" title="ALICI" />
                            <div className="mt-1 text-sm font-bold leading-tight">
                                {getSafe(['alici_firma', 'adi'])}
                            </div>
                            <div className="text-xs opacity-80 leading-tight mt-1">
                                {getSafe(['alici_firma', 'adresi'])}
                            </div>
                            <div className="absolute top-2 right-2 text-[10px] font-mono border border-green-600 px-1">NO: {getSafe(['alici_firma', 'vergi_no'])}</div>
                        </div>

                        {/* Box 14: Beyan Sahibi */}
                        <div className="p-2 border-b-2 border-green-800 h-32 relative">
                            <BoxHeader number="14" title="BEYAN SAHİBİ / TEMSİLCİSİ" />
                            <div className="mt-1 text-sm font-bold leading-tight text-slate-400 italic">
                                [Gümrük Müşaviri Bilgileri Otomatik Gelecek]
                            </div>
                            <div className="absolute top-2 right-2 text-[10px] font-mono border border-green-600 px-1">NO</div>
                        </div>
                    </div>

                    {/* Right Column (Forms, Items, Total) */}
                    <div className="col-span-6">
                        {/* Row: Forms/Items */}
                        <div className="grid grid-cols-2 border-b border-green-800">
                            <div className="p-2 border-r border-green-800 h-16">
                                <BoxHeader number="3" title="FORMLAR" />
                                <div className="text-center font-bold">1 / 1</div>
                            </div>
                            <div className="p-2 h-16">
                                <BoxHeader number="5" title="KALEMLER" />
                                <div className="text-center font-bold">
                                    {data.esya_listesi ? data.esya_listesi.length : 1}
                                </div>
                            </div>
                        </div>

                        {/* Box 6: Kaplar */}
                        <div className="p-2 border-b border-green-800 h-16">
                            <BoxHeader number="6" title="KAPLARIN TOPLAM SAYISI" />
                            <div className="font-bold">{firstItem.adet || 0}</div>
                        </div>

                        {/* Reference Number */}
                        <div className="p-2 border-b border-green-800 h-16 bg-white/30">
                            <BoxHeader number="7" title="REFERANS NUMARASI" />
                            <div className="font-mono font-bold text-sm">{data.belge_bilgileri?.fatura_no}</div>
                        </div>

                        {/* Invoice Totals */}
                        <div className="grid grid-cols-2 border-b-2 border-green-800 h-32">
                            <div className="p-2 border-r border-green-800">
                                <BoxHeader number="22" title="DÖVİZ VE TOPLAM FATURA TUTARI" />
                                <div className="font-bold text-sm mt-2">
                                    {firstItem.doviz_cinsi || 'USD'}
                                </div>
                                <div className="font-bold text-lg mt-1">
                                    {formatCurrency(String(getSafe(['toplamlar', 'toplam_fatura_tutari']) || '0').replace(/[^\d.-]/g, ''))}
                                </div>
                            </div>
                            <div className="p-2">
                                {/* Exchange rate placeholder */}
                                <div className="text-[10px] opacity-60 mt-8 text-center">[Döviz Kuru]</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Item Descriptions */}
                <div className="border-x-2 border-b-2 border-green-800">
                    <div className="grid grid-cols-12 gap-0">
                        {/* Box 31: Packages and Description */}
                        <div className="col-span-8 p-3 border-r border-green-800 h-64 overflow-y-auto">
                            <BoxHeader number="31" title="KAPLARIN VE EŞYANIN TANIMI" />

                            <div className="space-y-4 mt-2">
                                {data.esya_listesi?.map((item: any, idx: number) => (
                                    <div key={idx} className="mb-4 text-xs font-mono font-semibold">
                                        <div className="flex gap-2 mb-1">
                                            <span className="font-bold text-green-700">#{idx + 1}</span>
                                            <span className="uppercase">{item.tanimi}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-green-800/20 text-[10px] italic opacity-70">
                                Özet Beyanlar: {data.ozet}
                            </div>
                        </div>

                        {/* Right Side Item Specifics */}
                        <div className="col-span-4 grid grid-cols-1">
                            {/* Commodity Code */}
                            <div className="p-2 border-b border-green-800 h-16 bg-green-100/50">
                                <BoxHeader number="33" title="EŞYA KODU (GTİP)" />
                                <div className="font-mono font-black text-xl tracking-widest text-center mt-1">
                                    {firstItem.gtip || '____________'}
                                </div>
                            </div>

                            {/* Box 35: Gross Mass */}
                            <div className="p-2 border-b border-green-800 h-16">
                                <BoxHeader number="35" title="BRÜT AĞIRLIK (KG)" />
                                <div className="font-mono font-bold text-right pr-4">
                                    {getSafe(['toplamlar', 'toplam_brut_agirlik'])}
                                </div>
                            </div>

                            {/* Procedure */}
                            <div className="grid grid-cols-2 h-16 border-b border-green-800">
                                <div className="p-2 border-r border-green-800">
                                    <BoxHeader number="37" title="REJİM" />
                                    <div className="text-center font-bold">4000</div>
                                </div>
                                <div className="p-2">
                                    <BoxHeader number="38" title="NET KG" />
                                    <div className="text-center font-bold">{getSafe(['toplamlar', 'toplam_net_agirlik'])}</div>
                                </div>
                            </div>

                            {/* Statistical Value */}
                            <div className="p-2 h-16">
                                <BoxHeader number="46" title="İSTATİSTİKİ KIYMET" />
                                <div className="text-right font-mono text-sm">[Hesaplanacak]</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Signature Area */}
                <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-12 border-2 border-green-800 p-4 min-h-[100px] bg-white/40">
                        <BoxHeader number="54" title="YER VE TARİH" />
                        <div className="flex justify-between items-end mt-4">
                            <div className="font-mono">
                                İSTANBUL, {new Date().toLocaleDateString('tr-TR')}
                            </div>
                            <div className="text-xs font-bold uppercase text-slate-400">
                                Gümrük Müşaviri İmza / Kaşe
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex justify-center mt-6 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-green-700/20 flex items-center gap-2 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Beyannameyi Yazdır (PDF)
                </button>
            </div>

            <style jsx global>{`
                @media print {
                    @page { size: A4; margin: 0; }
                    body * { visibility: hidden; }
                    .bg-\\[\\#e6f4ea\\], .bg-\\[\\#e6f4ea\\] * { 
                        visibility: visible; 
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .bg-\\[\\#e6f4ea\\] {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        border: none;
                    }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>
        </div>
    );
}
