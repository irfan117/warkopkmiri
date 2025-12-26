# Deployment Guide - Vercel

Panduan lengkap untuk deploy aplikasi Kemiri Cafe ke Vercel dengan optimasi performa dan SEO.

## 📋 Prerequisites

1. Akun Vercel (gratis di [vercel.com](https://vercel.com))
2. Akun Supabase (gratis di [supabase.com](https://supabase.com))
3. Repository Git (GitHub, GitLab, atau Bitbucket)

## 🚀 Langkah-langkah Deployment

### 1. Persiapan Repository

Pastikan semua perubahan sudah di-commit dan push ke repository:

```bash
git add .
git commit -m "Optimize for production and SEO"
git push origin main
```

### 2. Setup di Vercel

1. **Login ke Vercel**
   - Kunjungi [vercel.com](https://vercel.com)
   - Login dengan GitHub/GitLab/Bitbucket

2. **Import Project**
   - Klik "Add New Project"
   - Pilih repository Anda
   - Klik "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (otomatis terdeteksi)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### 3. Environment Variables

Tambahkan environment variables di Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

**Catatan**: 
- Ganti `NEXT_PUBLIC_SITE_URL` dengan domain Vercel Anda setelah deploy pertama
- Atau gunakan custom domain jika sudah setup

### 4. Deploy

1. Klik "Deploy"
2. Tunggu proses build selesai (biasanya 2-3 menit)
3. Setelah selesai, aplikasi akan live di URL yang diberikan

### 5. Setup Custom Domain (Opsional)

1. Di Vercel Dashboard → Settings → Domains
2. Tambahkan domain Anda
3. Ikuti instruksi untuk setup DNS
4. Update `NEXT_PUBLIC_SITE_URL` dengan custom domain

## ⚙️ Optimasi yang Sudah Diterapkan

### Performance

✅ **Image Optimization**
- Next.js Image component dengan WebP/AVIF
- Lazy loading untuk images
- Proper sizing dan responsive images
- Blur placeholder untuk better UX

✅ **Code Splitting**
- Dynamic imports untuk komponen besar
- Lazy loading sections
- Route-based code splitting

✅ **Caching**
- Static assets: 1 year cache
- Images: 1 year cache
- API responses: sesuai kebutuhan

✅ **Compression**
- Gzip/Brotli compression (otomatis Vercel)
- Minified JavaScript dan CSS
- Optimized fonts loading

✅ **Bundle Size**
- Tree shaking untuk unused code
- SWC minification
- Optimized dependencies

### SEO

✅ **Meta Tags**
- Title, description, keywords
- Open Graph tags
- Twitter Card tags
- Structured data (JSON-LD)

✅ **Sitemap**
- Dynamic sitemap (`/sitemap.xml`)
- Auto-updated dengan Next.js

✅ **Robots.txt**
- Dynamic robots.txt (`/robots.txt`)
- Proper crawling directives

✅ **Performance Metrics**
- Core Web Vitals optimized
- Fast page loads
- Smooth interactions

## 🔍 Verifikasi Setelah Deploy

### 1. Check Performance

Gunakan tools berikut:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

Target:
- Performance Score: > 90
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s

### 2. Check SEO

- [Google Search Console](https://search.google.com/search-console)
- [Schema Markup Validator](https://validator.schema.org/)
- [Rich Results Test](https://search.google.com/test/rich-results)

### 3. Check Functionality

- ✅ Homepage loads correctly
- ✅ Images load properly
- ✅ Admin login works
- ✅ Order flow works
- ✅ All pages accessible

## 🐛 Troubleshooting

### Build Fails

**Error**: Module not found
- **Solusi**: Pastikan semua dependencies terinstall di `package.json`

**Error**: TypeScript errors
- **Solusi**: Fix TypeScript errors atau set `ignoreBuildErrors: true` di `next.config.js`

**Error**: Environment variables missing
- **Solusi**: Pastikan semua env vars sudah ditambahkan di Vercel

### Images Not Loading

**Solusi**: 
- Cek `next.config.js` remotePatterns
- Pastikan Supabase Storage bucket public
- Cek CORS settings di Supabase

### Slow Performance

**Solusi**:
- Enable Vercel Analytics
- Check bundle size dengan `npm run build`
- Optimize images lebih lanjut
- Consider using CDN untuk static assets

## 📊 Monitoring

### Vercel Analytics

1. Enable di Vercel Dashboard → Analytics
2. Monitor:
   - Page views
   - Performance metrics
   - Real user monitoring

### Error Tracking

Consider adding:
- Sentry untuk error tracking
- LogRocket untuk session replay
- Vercel Logs untuk server logs

## 🔄 Continuous Deployment

Vercel otomatis deploy setiap push ke branch:
- `main` → Production
- Other branches → Preview deployments

## 📝 Best Practices

1. **Environment Variables**
   - Jangan commit `.env` files
   - Gunakan Vercel Environment Variables
   - Different values untuk Production/Preview

2. **Build Optimization**
   - Monitor bundle size
   - Remove unused dependencies
   - Use dynamic imports

3. **Performance**
   - Optimize images sebelum upload
   - Use proper caching strategies
   - Minimize API calls

4. **SEO**
   - Update metadata regularly
   - Submit sitemap ke Google Search Console
   - Monitor search rankings

## 🎯 Next Steps

Setelah deploy:

1. ✅ Submit sitemap ke Google Search Console
2. ✅ Setup Google Analytics (opsional)
3. ✅ Monitor performance dengan Vercel Analytics
4. ✅ Setup custom domain (jika perlu)
5. ✅ Test semua fitur di production
6. ✅ Setup error tracking (opsional)

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Performance](https://vercel.com/docs/concepts/analytics)
- [Core Web Vitals](https://web.dev/vitals/)
