import React from 'react';
import { Download } from 'lucide-react';

interface BeyannameFormProps {
    data: any;
}

export default function BeyannameForm({ data }: BeyannameFormProps) {
    // Helper to safety get data
    const getSafe = (path: string[], defaultValue = '') => {
        return path.reduce((acc, curr) => (acc && acc[curr] ? acc[curr] : null), data) || defaultValue;
    };

    return (
        <div className="w-full overflow-x-auto bg-gray-100 p-8 print:p-0 print:bg-white">
            <div className="mx-auto bg-[#e6f4ea] text-black font-sans text-[10px] leading-tight border border-green-700 w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl print:shadow-none print:w-full print:border-none relative box-border">

                {/* Header Section */}
                <div className="grid grid-cols-12 gap-0 border-b border-green-700">
                    <div className="col-span-6 border-r border-green-700 p-1">
                        <div className="text-[9px] text-green-800 uppercase font-bold mb-1">1. GÖNDERİCİ / İHRACATÇI</div>
                        <div className="font-bold text-sm uppercase">{getSafe(['gonderici_firma', 'adi'])}</div>
                        <div className="whitespace-pre-line">{getSafe(['gonderici_firma', 'adresi'])}</div>
                        <div className="mt-1 font-bold">{getSafe(['gonderici_firma', 'ulkesi'])}</div>
                    </div>
                    <div className="col-span-6 grid grid-cols-12">
                        <div className="col-span-12 border-b border-green-700 p-1 flex justify-between">
                            <span className="font-bold text-lg">GÜMRÜK BEYANNAMESİ</span>
                            <span className="text-red-600 font-bold font-mono">No: {getSafe(['belge_bilgileri', 'fatura_no'], '000000')}</span>
                        </div>
                        <div className="col-span-12 p-1 h-20">
                            {/* Form Names / Copies */}
                            <div className="text-center text-xs font-bold text-green-800 mt-2">1 İHRACAT / İTHALAT (Gümrük İdaresi Nüshası)</div>
                        </div>
                    </div>
                </div>

                {/* Main Body */}
                <div className="grid grid-cols-12 gap-0 border-b border-green-700 h-auto">
                    {/* Left Column */}
                    <div className="col-span-6 border-r border-green-700">
                        <div className="p-1 border-b border-green-700 h-24">
                            <div className="text-[9px] text-green-800 uppercase font-bold mb-1">2. ALICI</div>
                            <div className="font-bold text-sm uppercase">{getSafe(['alici_firma', 'adi'])}</div>
                            <div className="whitespace-pre-line">{getSafe(['alici_firma', 'adresi'])}</div>
                            <div className="mt-1 font-bold">VKN: {getSafe(['alici_firma', 'vergi_no'])}</div>
                        </div>
                        <div className="p-1 border-b border-green-700 h-16">
                            <div className="text-[9px] text-green-800 uppercase font-bold mb-1">18. ÇIKIŞTAKİ TAŞITIN KİMLİĞİ VE AİDİYETİ</div>
                            <div className="font-bold uppercase">GEMİ / UÇAK / TIR</div>
                        </div>
                        <div className="p-1 border-b border-green-700 h-16">
                            <div className="text-[9px] text-green-800 uppercase font-bold mb-1">20. TESLİM ŞEKLİ</div>
                            <div className="font-bold uppercase text-lg">{getSafe(['belge_bilgileri', 'teslim_sekli'])} ISTANBUL</div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-span-6">
                        <div className="p-1 border-b border-green-700 h-12">
                            <div className="text-[9px] text-green-800 uppercase font-bold">14. BEYAN SAHİBİ / TEMSİLCİSİ</div>
                            <div className="font-bold text-xs uppercase opacity-50">[GÜMRÜK MÜŞAVİRLİĞİ LTD ŞTİ]</div>
                        </div>
                        <div className="p-1 border-b border-green-700 h-12">
                            <div className="text-[9px] text-green-800 uppercase font-bold">15. ÇIKIŞ / İHRACAT ÜLKESİ</div>
                            <div className="font-bold uppercase">{getSafe(['gonderici_firma', 'ulkesi'])}</div>
                        </div>
                        <div className="p-1 border-b border-green-700 h-12">
                            <div className="text-[9px] text-green-800 uppercase font-bold">17. GİDECEĞİ ÜLKE</div>
                            <div className="font-bold uppercase">TÜRKİYE</div>
                        </div>
                    </div>
                </div>

                {/* Items Section (Repeating for first item main details) */}
                <div className="border-b border-green-700">
                    <div className="p-1">
                        <div className="text-[9px] text-green-800 uppercase font-bold mb-1">31. KAPLARIN VE EŞYANIN TANIMI</div>
                        {data.esya_listesi && data.esya_listesi.map((item: any, i: number) => (
                            <div key={i} className="mb-4 border-b border-green-700/30 pb-2 last:border-0 relative">
                                <div className="grid grid-cols-12 gap-2">
                                    <div className="col-span-8">
                                        <div className="font-bold text-sm">{item.tanimi}</div>
                                        <div className="text-xs text-gray-600">Miktar: {item.adet} | Brüt: {item.brut_agirlik} | Net: {item.net_agirlik}</div>
                                    </div>
                                    <div className="col-span-4 border-l border-green-700 pl-2">
                                        <div className="text-[9px] text-green-800 uppercase font-bold">33. EŞYA KODU (GTİP)</div>
                                        <div className="font-mono font-black text-lg tracking-widest">{item.gtip || '____________'}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-12 gap-2 mt-2">
                                    <div className="col-span-6">
                                        <div className="text-[9px] text-green-800 uppercase font-bold">42. KALEM FİYATI</div>
                                        <div className="font-bold">{item.birim_fiyat ? `${item.birim_fiyat} ${item.doviz_cinsi}` : '-'}</div>
                                    </div>
                                    <div className="col-span-6 text-right">
                                        <div className="text-[9px] text-green-800 uppercase font-bold">46. İSTATİSTİKİ KIYMET</div>
                                        <div className="font-bold">{item.toplam_fiyat} {item.doviz_cinsi}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totals Section */}
                <div className="grid grid-cols-12 border-b border-green-700">
                    <div className="col-span-8 border-r border-green-700 p-2">
                        <div className="font-bold text-xs">TOPLAM FATURA TUTARI:</div>
                        <div className="text-xl font-black">{getSafe(['toplamlar', 'toplam_fatura_tutari'])}</div>
                    </div>
                    <div className="col-span-4 p-2 text-center">
                        <div className="text-[9px] text-green-800 uppercase font-bold">54. YER VE TARİH</div>
                        <div className="font-bold mt-2">İSTANBUL</div>
                        <div className="font-bold">{new Date().toLocaleDateString('tr-TR')}</div>
                    </div>
                </div>

            </div>

            <div className="text-center mt-6 text-gray-400 text-xs print:hidden">
                * Bu belge Gümrük AI Asistanı tarafından otomatik oluşturulmuş bir taslaktır. Resmi geçerliliği yoktur.
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    nav, footer, button, .no-print {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
