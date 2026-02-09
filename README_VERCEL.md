# Vercel & Postgres Deployment Guide

Bu proje SQLite'dan PostgreSQL'e başarıyla taşındı ve Vercel'e yüklenmeye hazır hale getirildi.

## 1. Veritabanı Hazırlığı
Canlıya çıkmak için bir PostgreSQL veritabanına ihtiyacın var. Aşağıdakilerden birini kullanabilirsin:
- **Vercel Postgres:** Vercel Dashboard -> Storage -> Create Database -> Postgres.
- **Supabase:** [supabase.com](https://supabase.com) üzerinden ücretsiz bir Postgres oluşturabilirsin.
- **Neon:** [neon.tech](https://neon.tech) üzerinden hızlıca oluşturabilirsin.

## 2. Vercel'e Yükleme Adımları
1. Projeni GitHub/GitLab'e yükle.
2. Vercel Dashboard'da "Add New Project" diyerek bu repoyu seç.
3. **Environment Variables** (Ortam Değişkenleri) kısmına şunları ekle:
   - `DATABASE_URL`: Veritabanı bağlantı linkin (Örn: `postgres://...`)
   - `AUTH_SECRET`: Rastgele bir uzun yazı (Örn: `4892374892374jhkfdsg`)
   - `NEXTAUTH_URL`: Sitenin adresi (Örn: `https://seninsiten.vercel.app`)
   - `GEMINI_API_KEY`: Google Gemini API anahtarın.

## 3. Veritabanını Başlatma (İlk Kurulum)
Vercel'e ilk yükleme bittikten sonra, admin kullanıcısını oluşturmak için kendi bilgisayarında terminalden şu komutu çalıştır (önce `.env` dosyandaki `DATABASE_URL`'i canlı veritabanı linkinle değiştir):

```bash
npx prisma db push
npx prisma db seed
```

Artık sistem hazır! `admin@gumruk.ai` ve `Admin123!` bilgileriyle giriş yapabilirsin.
