
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getConfig } from '@/lib/config';

export interface AuditReport {
    score: number; // 0-100
    summary: string;
    criticalIssues: string[];
    warnings: string[];
    suggestions: string[];
    verificationStatus: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
}

/**
 * The Auditor Agent (Denetmen) reviews the draft declaration JSON.
 * It checks for logic errors, missing fields, and compliance issues.
 */
export async function auditDeclaration(draftJson: any, regimeInstructions: string): Promise<AuditReport> {
    const apiKey = await getConfig('GEMINI_API_KEY');
    if (!apiKey) throw new Error("API Key missing for Auditor");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
    ROL: Sen kıdemli bir Gümrük Mevzuat Denetmeni ve Müfettişisin (Auditor).
    GÖREV: Aşağıdaki Gümrük Beyannamesi taslağını (JSON) incele ve olası hataları, mevzuat uyumsuzluklarını ve eksiklikleri raporla.
    
    KURALLAR:
    1. GTİP formatlarını kontrol et (12 hane olmalı).
    2. Menşei bilgilerinin tutarlılığını kontrol et (Ülke kodu ile menşei adı uyumlu mu?).
    3. Matematiksel tutarlılığı yüzeysel kontrol et (Birim fiyat * Adet ≈ Toplam Fiyat).
    4. Rejim kurallarına uygun mu? (${regimeInstructions})
    5. Yasaklı/İzne tabi ürün uyarısı var mı?
    6. "Bilinmiyor", "0", "null" gibi şüpheli alanları tespit et.

    GİRDİ (TASLAK JSON):
    ${JSON.stringify(draftJson, null, 2)}

    ÇIKTI FORMATI (SAF JSON):
    {
      "score": 85, (0-100 arası güven puanı),
      "summary": "Genel değerlendirme cümlesi...",
      "criticalIssues": ["Kritik Hata 1", "Kritik Hata 2"],
      "warnings": ["Uyarı 1", "Uyarı 2"],
      "suggestions": ["Öneri 1", "Öneri 2"],
      "verificationStatus": "APPROVED" | "REJECTED" | "NEEDS_REVIEW"
    }
  `;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean JSON
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson) as AuditReport;

    } catch (error) {
        console.error("Auditor Agent Error:", error);
        // Fallback report
        return {
            score: 0,
            summary: "Denetmen ajanı çalışırken hata oluştu.",
            criticalIssues: ["Denetim yapılamadı."],
            warnings: [],
            suggestions: [],
            verificationStatus: "NEEDS_REVIEW"
        };
    }
}
