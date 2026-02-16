'use client';

import React from 'react';

interface BeyannameFormProps {
    data: any;
}

// Rejim tipleri ve renk kodları
const REJIM_CONFIG: Record<string, { label: string; color: string; border: string; bg: string; copies: string; headerBg: string }> = {
    IM: { label: 'İTHALAT BEYANNAMESİ', color: '#1a5c2e', border: '#1a5c2e', bg: '#e8f5e9', copies: 'Nüsha: 6 / 7 / 8', headerBg: '#c8e6c9' },
    EX: { label: 'İHRACAT BEYANNAMESİ', color: '#7b1fa2', border: '#7b1fa2', bg: '#f3e5f5', copies: 'Nüsha: 1 / 2 / 3', headerBg: '#ce93d8' },
    TR: { label: 'TRANSİT BEYANNAMESİ', color: '#0d47a1', border: '#0d47a1', bg: '#e3f2fd', copies: 'Nüsha: 1 / 4 / 5', headerBg: '#90caf9' },
};

export default function BeyannameForm({ data }: BeyannameFormProps) {
    const getSafe = (path: string[], defaultValue = '') => {
        try {
            return path.reduce((acc: any, curr: string) => (acc && acc[curr] ? acc[curr] : null), data) || defaultValue;
        } catch { return defaultValue; }
    };

    const formatNum = (val: any) => {
        if (!val) return '0,00';
        const num = typeof val === 'string' ? parseFloat(val.replace(/[^\d.-]/g, '')) : val;
        return isNaN(num) ? '0,00' : num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Rejim tipini belirle
    const beyanTipi = getSafe(['belge_bilgileri', 'beyanname_tipi'], 'IM');
    const rejimKodu = beyanTipi.substring(0, 2).toUpperCase();
    const config = REJIM_CONFIG[rejimKodu] || REJIM_CONFIG['IM'];

    const items = data?.esya_listesi || [];

    return (
        <div className="w-full bg-gray-50 p-4 lg:p-8 rounded-2xl">
            <div
                className="max-w-[1050px] mx-auto bg-white shadow-2xl"
                style={{ fontFamily: '"Courier New", Courier, monospace', border: `3px solid ${config.border}` }}
            >
                {/* ═══════════════════════════════════════════════════════ */}
                {/* HEADER: T.C. Gümrük Beyannamesi Başlık Şeridi         */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="flex" style={{ borderBottom: `3px solid ${config.border}` }}>
                    {/* Sol: Nüsha/Seri */}
                    <div className="w-14 flex items-center justify-center font-black text-2xl" style={{ borderRight: `3px solid ${config.border}`, backgroundColor: config.bg, color: config.color }}>
                        {rejimKodu === 'IM' ? '6' : rejimKodu === 'EX' ? '1' : '4'}
                    </div>
                    {/* Orta: Başlık */}
                    <div className="flex-1 px-3 py-2" style={{ backgroundColor: config.headerBg }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: config.color }}>T.C. TİCARET BAKANLIĞI</div>
                                <div className="text-sm font-black uppercase tracking-wider" style={{ color: config.color }}>{config.label}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[8px] font-bold opacity-60">{config.copies}</div>
                                <div className="text-[8px] font-bold opacity-60">TEK İDARİ BELGE (SAD)</div>
                            </div>
                        </div>
                    </div>
                    {/* Sağ: T.C. Arma placeholder */}
                    <div className="w-20 flex items-center justify-center" style={{ borderLeft: `3px solid ${config.border}`, backgroundColor: config.bg }}>
                        <div className="text-center">
                            <div className="text-[20px]">🇹🇷</div>
                            <div className="text-[7px] font-black" style={{ color: config.color }}>T.C.</div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* GENEL SEGMENT: Kutular 1-30                           */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-12" style={{ borderBottom: `3px solid ${config.border}` }}>

                    {/* ─── SOL SÜTUN (6 kolon) ─── */}
                    <div className="col-span-6" style={{ borderRight: `3px solid ${config.border}` }}>

                        {/* Kutu 1 + A */}
                        <div className="grid grid-cols-4" style={{ borderBottom: `2px solid ${config.border}` }}>
                            <Box num="1" title="BEYAN" config={config}>
                                <div className="text-2xl font-black text-center mt-1" style={{ color: config.color }}>{beyanTipi}</div>
                            </Box>
                            <div className="col-span-3" style={{ borderLeft: `2px solid ${config.border}` }}>
                                <Box num="A" title="GÜMRÜK İDARESİ" config={config}>
                                    <div className="text-[11px] font-black text-center mt-1">
                                        {getSafe(['belge_bilgileri', 'gumruk_idaresi'], 'MURATBEY GÜMRÜK MÜDÜRLÜĞÜ')}
                                    </div>
                                    <div className="text-[9px] text-center font-bold opacity-60 mt-1">
                                        {getSafe(['belge_bilgileri', 'tescil_tarihi'], new Date().toLocaleDateString('tr-TR'))}
                                    </div>
                                </Box>
                            </div>
                        </div>

                        {/* Kutu 2: Gönderici/İhracatçı */}
                        <Box num="2" title="Gönderici / İhracatçı" config={config} h="h-[90px]">
                            <div className="text-[10px] font-bold leading-tight mt-1">
                                <div className="font-black">{getSafe(['gonderici_firma', 'adi'])}</div>
                                <div className="opacity-70">{getSafe(['gonderici_firma', 'adresi'])}</div>
                            </div>
                        </Box>

                        {/* Kutu 8: Alıcı */}
                        <Box num="8" title="Alıcı" config={config} h="h-[90px]">
                            <div className="text-[10px] font-bold leading-tight mt-1">
                                <div className="font-black">{getSafe(['alici_firma', 'adi'])}</div>
                                <div className="opacity-70">{getSafe(['alici_firma', 'adresi'])}</div>
                                {getSafe(['alici_firma', 'vergi_no']) && (
                                    <div className="mt-1 inline-block text-[9px] px-1 border font-black" style={{ borderColor: config.border, color: config.color }}>
                                        VKN: {getSafe(['alici_firma', 'vergi_no'])}
                                    </div>
                                )}
                            </div>
                        </Box>

                        {/* Kutu 14: Beyan Sahibi/Temsilci */}
                        <Box num="14" title="Beyan Sahibi / Temsilci" config={config} h="h-[70px]">
                            <div className="text-[10px] font-bold italic opacity-50 uppercase mt-1">
                                {getSafe(['beyan_sahibi', 'adi'], 'GÜMRÜK MÜŞAVİRLİĞİ LTD. ŞTİ.')}
                            </div>
                        </Box>
                    </div>

                    {/* ─── SAĞ SÜTUN (6 kolon) ─── */}
                    <div className="col-span-6">

                        {/* Kutu 3, 5, 6 */}
                        <div className="grid grid-cols-3" style={{ borderBottom: `2px solid ${config.border}` }}>
                            <Box num="3" title="Formlar" config={config}>
                                <div className="text-center font-black text-sm mt-1">1 / {Math.ceil(items.length / 3) || 1}</div>
                            </Box>
                            <Box num="5" title="Kalem Sayısı" config={config} borderL>
                                <div className="text-center font-black text-sm mt-1">{items.length || 0}</div>
                            </Box>
                            <Box num="6" title="Kap Adedi" config={config} borderL>
                                <div className="text-center font-black text-sm mt-1">{getSafe(['toplamlar', 'toplam_kap_adedi'], '-')}</div>
                            </Box>
                        </div>

                        {/* Kutu 15, 17 */}
                        <div className="grid grid-cols-2" style={{ borderBottom: `2px solid ${config.border}` }}>
                            <Box num="15" title="Sevk/İhraç Ülkesi" config={config}>
                                <div className="text-center font-black text-[11px] mt-1">{getSafe(['belge_bilgileri', 'cikis_ulkesi'], '-')}</div>
                            </Box>
                            <Box num="17" title="Gideceği Ülke" config={config} borderL>
                                <div className="text-center font-black text-[11px] mt-1">
                                    {rejimKodu === 'IM' ? 'TÜRKİYE (TR)' : getSafe(['belge_bilgileri', 'varacagi_ulke'], '-')}
                                </div>
                            </Box>
                        </div>

                        {/* Kutu 18, 19 */}
                        <div className="grid grid-cols-3" style={{ borderBottom: `2px solid ${config.border}` }}>
                            <div className="col-span-2">
                                <Box num="18" title="Taşıtın Kimliği ve Ülkesi" config={config}>
                                    <div className="text-[10px] font-bold mt-1">{getSafe(['tasima_bilgileri', 'tasit_kimlik'], '-')}</div>
                                </Box>
                            </div>
                            <Box num="19" title="Kont." config={config} borderL>
                                <div className="text-center font-black text-[11px] mt-1">{getSafe(['tasima_bilgileri', 'konteyner'], '0')}</div>
                            </Box>
                        </div>

                        {/* Kutu 20: Teslim Şekli */}
                        <Box num="20" title="Teslim Şekli" config={config}>
                            <div className="flex justify-between items-center px-2 mt-1">
                                <span className="font-black text-lg" style={{ color: config.color }}>
                                    {getSafe(['belge_bilgileri', 'teslim_sekli'], 'FOB').split(' ')[0]}
                                </span>
                                <span className="text-[10px] font-bold opacity-50">
                                    {getSafe(['belge_bilgileri', 'teslim_yeri'], getSafe(['belge_bilgileri', 'cikis_ulkesi'], ''))}
                                </span>
                            </div>
                        </Box>

                        {/* Kutu 22, 23 */}
                        <div className="grid grid-cols-5" style={{ borderBottom: `0px` }}>
                            <div className="col-span-3">
                                <Box num="22" title="Döviz ve Toplam Fatura Bedeli" config={config}>
                                    <div className="flex justify-between items-end px-1 mt-1">
                                        <span className="font-black text-xs">{getSafe(['esya_listesi', '0', 'doviz_cinsi'], 'USD')}</span>
                                        <span className="font-black text-lg">{formatNum(getSafe(['toplamlar', 'toplam_fatura_tutari']))}</span>
                                    </div>
                                </Box>
                            </div>
                            <div className="col-span-2">
                                <Box num="23" title="Kur" config={config} borderL>
                                    <div className="text-center font-black text-[11px] mt-1">
                                        {getSafe(['belge_bilgileri', 'doviz_kuru'], '34,50')}
                                    </div>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* Kutu 24, 25, 26 satırı                                */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-3" style={{ borderBottom: `3px solid ${config.border}` }}>
                    <Box num="24" title="İşlemin Niteliği" config={config}>
                        <div className="text-center font-black text-[11px] mt-1">{getSafe(['belge_bilgileri', 'islem_niteligi'], '11')}</div>
                    </Box>
                    <Box num="25" title="Sınırdaki Taşıma Şekli" config={config} borderL>
                        <div className="text-center font-black text-[11px] mt-1">{getSafe(['tasima_bilgileri', 'tasima_sekli'], 'DENİZYOLU')}</div>
                    </Box>
                    <Box num="26" title="Yurtiçi Taşıma Şekli" config={config} borderL>
                        <div className="text-center font-black text-[11px] mt-1">{getSafe(['tasima_bilgileri', 'yurtici_tasima'], 'KARAYOLU')}</div>
                    </Box>
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* KALEM SEGMENTİ: Her eşya kalemi                      */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="text-[8px] font-black uppercase px-2 py-1 flex justify-between" style={{ backgroundColor: config.bg, color: config.color, borderBottom: `2px solid ${config.border}` }}>
                    <span>31 Kaplar ve Eşyanın Tanımı</span>
                    <span>33 Eşya Kodu (GTİP) • 34 Menşe • 38 Net Ağırlık • 42 Kalem Bedeli</span>
                </div>

                <div className="min-h-[200px]">
                    {items.map((item: any, i: number) => (
                        <div key={i} style={{ borderBottom: `1px solid ${config.border}40` }}>
                            {/* Ana Kalem Satırı */}
                            <div className="grid grid-cols-12">
                                {/* Kutu 31: Eşya Tanımı (sol geniş alan) */}
                                <div className="col-span-7 p-2" style={{ borderRight: `2px solid ${config.border}` }}>
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="text-[8px] font-bold opacity-40">32</div>
                                            <div className="font-black text-sm" style={{ color: config.color }}>#{i + 1}</div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[10px] font-bold uppercase leading-tight">
                                                {item.tanimi}
                                            </div>
                                            {item.model_kodu && (
                                                <div className="text-[9px] font-black mt-1" style={{ color: config.color }}>
                                                    MODEL: {item.model_kodu}
                                                </div>
                                            )}
                                            {item.marka && (
                                                <div className="text-[9px] font-bold opacity-50 mt-0.5">
                                                    MARKA: {item.marka}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Sağ: GTİP, Menşe, Ağırlık, Fiyat */}
                                <div className="col-span-5 grid grid-cols-4">
                                    {/* Kutu 33: GTİP */}
                                    <div className="p-1.5 text-center" style={{ borderRight: `1px solid ${config.border}30` }}>
                                        <div className="text-[7px] font-bold opacity-40 uppercase">33 GTİP</div>
                                        <div className="font-black text-[11px] tracking-wider mt-0.5" style={{ color: config.color }}>
                                            {item.gtip || '-'}
                                        </div>
                                    </div>
                                    {/* Kutu 34: Menşe */}
                                    <div className="p-1.5 text-center" style={{ borderRight: `1px solid ${config.border}30` }}>
                                        <div className="text-[7px] font-bold opacity-40 uppercase">34 Menşe</div>
                                        <div className="font-black text-[10px] mt-0.5">{item.mensei || '-'}</div>
                                    </div>
                                    {/* Kutu 38: Net Ağırlık */}
                                    <div className="p-1.5 text-center" style={{ borderRight: `1px solid ${config.border}30` }}>
                                        <div className="text-[7px] font-bold opacity-40 uppercase">38 NetAğ</div>
                                        <div className="font-bold text-[10px] mt-0.5">{item.net_agirlik || '-'} KG</div>
                                    </div>
                                    {/* Kutu 42: Kalem Fiyatı */}
                                    <div className="p-1.5 text-right">
                                        <div className="text-[7px] font-bold opacity-40 uppercase">42 Fiyat</div>
                                        <div className="font-black text-[11px] mt-0.5">{formatNum(item.toplam_fiyat)}</div>
                                        <div className="text-[7px] font-bold opacity-40">{item.doviz_cinsi || 'USD'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Kutu 47: Vergi Hesaplaması (eğer varsa) */}
                            {item.vergiler && (
                                <div className="grid grid-cols-6 text-[8px]" style={{ backgroundColor: `${config.bg}80`, borderTop: `1px dashed ${config.border}40` }}>
                                    <div className="p-1 font-bold text-center" style={{ borderRight: `1px solid ${config.border}20` }}>
                                        <span className="opacity-40">47</span> VERGİ
                                    </div>
                                    <div className="p-1 text-center" style={{ borderRight: `1px solid ${config.border}20` }}>
                                        GV: <span className="font-black">{formatNum(item.vergiler.gvHesa)}</span>
                                    </div>
                                    <div className="p-1 text-center" style={{ borderRight: `1px solid ${config.border}20` }}>
                                        ÖTV: <span className="font-black">{formatNum(item.vergiler.otvHesap)}</span>
                                    </div>
                                    <div className="p-1 text-center" style={{ borderRight: `1px solid ${config.border}20` }}>
                                        KDV: <span className="font-black">{formatNum(item.vergiler.kdvHesap)}</span>
                                    </div>
                                    <div className="p-1 text-center" style={{ borderRight: `1px solid ${config.border}20` }}>
                                        D+K: <span className="font-black">{formatNum((item.vergiler.damgaHesap || 0) + (item.vergiler.kkdfHesap || 0))}</span>
                                    </div>
                                    <div className="p-1 text-center font-black" style={{ color: config.color }}>
                                        TOP: {formatNum(item.vergiler.toplamVergi)}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* TOPLAM SATIRI                                         */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="p-3 flex justify-between items-center" style={{ borderTop: `3px solid ${config.border}`, backgroundColor: config.bg }}>
                    <div>
                        <span className="text-[8px] font-bold uppercase opacity-50" style={{ color: config.color }}>TOPLAM FATURA BEDELİ</span>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-black tracking-tighter" style={{ color: config.color }}>
                            {formatNum(getSafe(['toplamlar', 'toplam_fatura_tutari']))}
                        </span>
                        <span className="text-xs font-black ml-2 opacity-60">{getSafe(['esya_listesi', '0', 'doviz_cinsi'], 'USD')}</span>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* FOOTER: Kutu 48, 49, 54                              */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-3" style={{ borderTop: `3px solid ${config.border}` }}>
                    <Box num="48" title="Ertelenmiş Ödeme" config={config}>
                        <div className="text-[10px] font-bold mt-1 opacity-50">
                            {getSafe(['belge_bilgileri', 'odeme_sekli'], '-')}
                        </div>
                    </Box>
                    <Box num="49" title="Antrepo Kimliği" config={config} borderL>
                        <div className="text-[10px] font-bold mt-1 opacity-50">
                            {getSafe(['belge_bilgileri', 'antrepo'], '-')}
                        </div>
                    </Box>
                    <div style={{ borderLeft: `2px solid ${config.border}` }}>
                        <Box num="B" title="Muhasebe Detayları" config={config}>
                            <div className="text-[9px] font-bold mt-1 opacity-40 uppercase">
                                {getSafe(['belge_bilgileri', 'tescil_no'], '...............')}
                            </div>
                        </Box>
                    </div>
                </div>

                {/* İmza Bloğu */}
                <div className="grid grid-cols-2" style={{ borderTop: `3px solid ${config.border}`, minHeight: '80px' }}>
                    <div className="p-2" style={{ borderRight: `2px solid ${config.border}` }}>
                        <Box num="54" title="Yer ve Tarih" config={config}>
                            <div className="mt-3 font-bold uppercase text-center text-[11px]">
                                İSTANBUL, {new Date().toLocaleDateString('tr-TR')}
                            </div>
                        </Box>
                    </div>
                    <div className="p-2 flex flex-col items-center justify-center">
                        <div className="text-[9px] font-bold uppercase opacity-30 tracking-widest" style={{ color: config.color }}>
                            Beyan Sahibinin İmzası
                        </div>
                        <div className="mt-2 w-32 border-b-2 border-dashed opacity-20" style={{ borderColor: config.border }}></div>
                        <div className="text-[8px] font-bold uppercase opacity-20 mt-1" style={{ color: config.color }}>
                            Kaşe ve İmza
                        </div>
                    </div>
                </div>

                {/* Dijital Onay Damgası */}
                <div className="p-2 text-center" style={{ backgroundColor: config.bg, borderTop: `1px solid ${config.border}30` }}>
                    <div className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40" style={{ color: config.color }}>
                        BU BELGE GÜMRÜK AI SİSTEMİ TARAFINDAN OTOMATİK OLARAK OLUŞTURULMUŞTUR • {new Date().toISOString()}
                    </div>
                </div>
            </div>

            {/* Yazdır Butonu */}
            <div className="flex justify-center mt-8 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="text-white px-10 py-4 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-3"
                    style={{ backgroundColor: config.color }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    RESMİ ÇIKTI AL (PDF)
                </button>
            </div>
        </div>
    );
}

/* ── Yardımcı Bileşen: Numaralı Kutu ── */
function Box({ num, title, config, children, h, borderL }: any) {
    return (
        <div
            className={`p-1 relative ${h || ''}`}
            style={{
                borderBottom: `1px solid ${config.border}30`,
                ...(borderL ? { borderLeft: `2px solid ${config.border}` } : {})
            }}
        >
            <div className="flex items-center gap-1">
                <span
                    className="text-[8px] font-black px-1 border inline-block leading-tight"
                    style={{ borderColor: config.border, color: config.color, backgroundColor: 'white' }}
                >
                    {num}
                </span>
                <span className="text-[7px] font-bold uppercase" style={{ color: config.color }}>{title}</span>
            </div>
            {children}
        </div>
    );
}
