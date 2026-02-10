'use client';

import React from 'react';

interface BeyannameFormProps {
    data: any;
}

export default function BeyannameForm({ data }: BeyannameFormProps) {
    const getSafe = (path: string[], defaultValue = '') => {
        try {
            return path.reduce((acc, curr) => (acc && acc[curr] ? acc[curr] : null), data) || defaultValue;
        } catch (e) {
            return defaultValue;
        }
    };

    const formatNum = (val: any) => {
        if (!val) return '0,00';
        const num = typeof val === 'string' ? parseFloat(val.replace(/[^\d.-]/g, '')) : val;
        return isNaN(num) ? '0,00' : num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="w-full bg-[#f4f7f5] p-4 lg:p-10 rounded-[2.5rem] border border-green-100 shadow-2xl">
            <div className="max-w-[1000px] mx-auto bg-white border-[3px] border-[#2d5a3c] p-1 relative shadow-lg" style={{ fontFamily: '"Courier New", Courier, monospace' }}>

                {/* Header Strip */}
                <div className="flex border-b-[3px] border-[#2d5a3c]">
                    <div className="w-12 border-r-[3px] border-[#2d5a3c] bg-[#e8f5e9] flex items-center justify-center font-bold text-2xl text-[#2d5a3c]">2 7</div>
                    <div className="flex-1 p-2 bg-[#e8f5e9]">
                        <div className="text-[10px] font-bold text-[#2d5a3c]">T.C. GÜMRÜK BEYANNAMESİ</div>
                        <div className="flex justify-between items-end mt-1">
                            <span className="text-[12px] font-black">Seri : VF</span>
                            <span className="text-[12px] font-black italic">No: {getSafe(['belge_bilgileri', 'fatura_no'])}/IIKS</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 border-b-[3px] border-[#2d5a3c]">
                    {/* Left Column (Boxes 2, 8, 14, 18) */}
                    <div className="col-span-6 border-r-[3px] border-[#2d5a3c]">
                        <Box num="2" title="Gönderici/İhracatçı" height="h-28" content={
                            <div className="text-[11px] font-bold">
                                {getSafe(['gonderici_firma', 'adi'])}<br />
                                {getSafe(['gonderici_firma', 'adresi'])}
                            </div>
                        } />
                        <Box num="8" title="Alıcı" height="h-28" content={
                            <div className="text-[11px] font-bold">
                                {getSafe(['alici_firma', 'adi'])}<br />
                                {getSafe(['alici_firma', 'adresi'])}<br />
                                <span className="bg-slate-100 px-1 border border-slate-300">VKN: {getSafe(['alici_firma', 'vergi_no'])}</span>
                            </div>
                        } />
                        <Box num="14" title="Beyan sahibi/Temsilci" height="h-28" content={
                            <div className="text-[11px] font-bold italic text-slate-400 uppercase">ASSET GÜMRÜK MÜŞAVİRLİĞİ LTD. ŞTİ. (OTOMATİK)</div>
                        } />
                        <div className="grid grid-cols-2">
                            <Box num="15" title="Sevk/İhracat Ülkesi" content={<div className="font-bold text-center">{getSafe(['belge_bilgileri', 'cikis_ulkesi'])}</div>} />
                            <Box num="17" title="Gideceği Ülke" content={<div className="font-bold text-center">TÜRKİYE</div>} />
                        </div>
                    </div>

                    {/* Right Column (Boxes 1, A, 3, 5, 22) */}
                    <div className="col-span-6">
                        <div className="grid grid-cols-12 border-b-[3px] border-[#2d5a3c]">
                            <div className="col-span-3 border-r-[3px] border-[#2d5a3c]">
                                <Box num="1" title="BEYAN" content={<div className="text-xl font-black text-center">{getSafe(['belge_bilgileri', 'beyanname_tipi'], 'AN')}</div>} />
                            </div>
                            <div className="col-span-9 bg-[#e8f5e9]/50 p-2">
                                <div className="text-[9px] font-bold text-[#2d5a3c]">A VARİŞ GÜMRÜK İDARESİ</div>
                                <div className="text-[12px] font-black text-center mt-2 leading-tight">
                                    MURATBEY GÜMRÜK MÜDÜRLÜĞÜ<br />09.02.2026
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 border-b-[3px] border-[#2d5a3c]">
                            <Box num="3" title="Formlar" content={<div className="text-center font-bold">1 / 5</div>} />
                            <Box num="5" title="Kalem Sayısı" content={<div className="text-center font-bold">{data.esya_listesi?.length || 0}</div>} />
                            <Box num="6" title="Kap Adedi" content={<div className="text-center font-bold">{getSafe(['toplamlar', 'toplam_kap_adedi'], '764')}</div>} />
                        </div>
                        <Box num="20" title="Teslim Şekli" height="h-16" content={
                            <div className="flex justify-between items-center px-4 font-black text-lg">
                                <span>{getSafe(['belge_bilgileri', 'teslim_sekli'], 'FOB').split(' ')[0]}</span>
                                <span className="text-xs opacity-50">{getSafe(['belge_bilgileri', 'cikis_ulkesi'], 'BANGLADEŞ')}</span>
                            </div>
                        } />
                        <Box num="22" title="Döviz ve toplam fatura bedeli" height="h-20" content={
                            <div className="flex justify-between items-end px-2">
                                <span className="font-black text-md">{getSafe(['esya_listesi', '0', 'doviz_cinsi'], 'USD')}</span>
                                <span className="font-black text-2xl">{formatNum(getSafe(['toplamlar', 'toplam_fatura_tutari']))}</span>
                            </div>
                        } />
                    </div>
                </div>

                {/* Item List Header */}
                <div className="border-b-[3px] border-[#2d5a3c] bg-[#e8f5e9] p-1 text-[9px] font-black flex justify-between uppercase">
                    <span>31 Kaplar ve Eşyanın Tanımı</span>
                    <span>33 Eşya Kodu</span>
                </div>

                {/* Items Section */}
                <div className="min-h-[400px]">
                    {data.esya_listesi?.map((item: any, i: number) => (
                        <div key={i} className="grid grid-cols-12 border-b-[1px] border-[#2d5a3c]/30 last:border-0">
                            <div className="col-span-8 p-2 border-r-[3px] border-[#2d5a3c]">
                                <div className="flex gap-4">
                                    <span className="font-black text-xs">#{i + 1}</span>
                                    <div className="text-[11px] font-bold uppercase leading-tight">
                                        {item.tanimi}
                                        {item.model_kodu && <div className="text-blue-600 font-black mt-1">MODEL: {item.model_kodu}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-4 p-2 grid grid-cols-2">
                                <div className="text-center">
                                    <div className="text-[8px] font-bold opacity-60 uppercase mb-1">GTİP</div>
                                    <div className="font-black text-sm tracking-widest">{item.gtip}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[8px] font-bold opacity-60 uppercase mb-1">TUTAR</div>
                                    <div className="font-black text-sm">{formatNum(item.toplam_fiyat)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Totals */}
                <div className="border-t-[3px] border-[#2d5a3c] bg-[#e8f5e9] p-4">
                    <div className="flex justify-between items-center text-[#2d5a3c]">
                        <div className="font-black text-xl italic">TOPLAM:</div>
                        <div className="text-right">
                            <div className="text-3xl font-black tracking-tighter">
                                {formatNum(getSafe(['toplamlar', 'toplam_fatura_tutari']))} <span className="text-sm">{getSafe(['esya_listesi', '0', 'doviz_cinsi'], 'USD')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signature Block */}
                <div className="grid grid-cols-2 border-t-[3px] border-[#2d5a3c] h-32">
                    <div className="p-2 border-r-[3px] border-[#2d5a3c] relative">
                        <Box num="54" title="Yer ve Tarih" content={
                            <div className="mt-4 font-bold uppercase">İSTANBUL, {new Date().toLocaleDateString('tr-TR')}</div>
                        } />
                    </div>
                    <div className="p-2 flex items-center justify-center italic text-slate-300 font-bold uppercase text-xs">Acente / Müşavir Kaşe ve İmza</div>
                </div>
            </div>

            {/* Print Controls */}
            <div className="flex justify-center mt-10 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-[#2d5a3c] text-white px-10 py-4 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-3"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    RESMİ ÇIKTI AL (PDF)
                </button>
            </div>
        </div>
    );
}

function Box({ num, title, height, content }: any) {
    return (
        <div className={`p-1 border-[1px] border-[#2d5a3c]/30 relative ${height || ''}`}>
            <span className="text-[9px] font-black border border-[#2d5a3c] px-1 bg-white text-[#2d5a3c] mr-1">{num}</span>
            <span className="text-[8px] font-bold text-[#2d5a3c] uppercase">{title}</span>
            <div className="mt-1">{content}</div>
        </div>
    );
}
