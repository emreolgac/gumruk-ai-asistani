
import { js2xml } from 'xml-js';

export function generateBilgeXML(data: any): string {
    const xmlObj = {
        _declaration: { _attributes: { version: "1.0", encoding: "UTF-8" } },
        Beyanname: {
            GenelBilgiler: {
                FaturaNo: data.belge_bilgileri?.fatura_no,
                FaturaTarihi: data.belge_bilgileri?.fatura_tarihi,
                TeslimSekli: data.belge_bilgileri?.teslim_sekli,
                Gonderici: data.gonderici_firma?.adi,
                Alici: data.alici_firma?.adi
            },
            Kalemler: {
                Kalem: data.esya_listesi?.map((item: any, index: number) => ({
                    SiraNo: index + 1,
                    Gtip: item.gtip,
                    EsyaTanimi: item.tanimi,
                    Miktar: item.adet,
                    BirimFiyat: item.birim_fiyat,
                    ToplamFiyat: item.toplam_fiyat,
                    Mensei: item.mensei,
                    NetAgirlik: item.net_agirlik,
                    BrutAgirlik: item.brut_agirlik
                }))
            }
        }
    };

    return js2xml(xmlObj, { compact: true, spaces: 4 });
}
