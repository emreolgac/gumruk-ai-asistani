
import { getConfig } from '@/lib/config';

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL_NAME = "claude-sonnet-4-6";

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
    const apiKey = await getConfig('CLAUDE_API_KEY');
    if (!apiKey) throw new Error("API Key missing for Auditor");

    const systemPrompt = `Sen kıdemli bir Gümrük Mevzuat Denetmeni ve Müfettişisin (Auditor). Görevin gümrük beyannamesi taslaklarını inceleyip hata ve uyumsuzlukları raporlamaktır.`;

    const userPrompt = `
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
      "score": 85,
      "summary": "Genel değerlendirme cümlesi...",
      "criticalIssues": ["Kritik Hata 1", "Kritik Hata 2"],
      "warnings": ["Uyarı 1", "Uyarı 2"],
      "suggestions": ["Öneri 1", "Öneri 2"],
      "verificationStatus": "APPROVED" | "REJECTED" | "NEEDS_REVIEW"
    }
  `;

    try {
        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                max_tokens: 4096,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: userPrompt },
                ],
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Claude API Error: ${response.status} - ${errorBody}`);
        }

        const data = await response.json();
        const responseText = data.content
            ?.filter((block: any) => block.type === 'text')
            .map((block: any) => block.text)
            .join('') || '';

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
