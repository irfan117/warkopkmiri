# Setup Supabase Storage untuk Gambar Homepage

Dokumentasi ini menjelaskan cara setup Supabase Storage untuk menyimpan gambar homepage dengan optimasi.

## 📋 Langkah-langkah Setup

### 1. Buat Storage Bucket

1. Masuk ke **Supabase Dashboard**
2. Pilih project Anda
3. Buka menu **Storage** di sidebar kiri
4. Klik tombol **"New bucket"** atau **"Create bucket"**
5. Isi form:
   - **Name**: `homepage-images` (harus sama dengan yang ada di kode)
   - **Public bucket**: ✅ **Centang** (agar gambar bisa diakses public)
   - **File size limit**: 10 MB (atau sesuai kebutuhan)
   - **Allowed MIME types**: `image/*` (atau spesifik: `image/jpeg,image/png,image/webp`)
6. Klik **"Create bucket"**

### 2. Setup Storage Policies (RLS)

Setelah bucket dibuat, jalankan migration untuk membuat policies:

```bash
npx supabase db push
```

Atau jalankan query berikut di Supabase Dashboard → SQL Editor:

```sql
-- Policy untuk public read (semua orang bisa melihat gambar)
CREATE POLICY "Public can view homepage images"
ON storage.objects FOR SELECT
USING (bucket_id = 'homepage-images');

-- Policy untuk authenticated users upload
CREATE POLICY "Authenticated users can upload homepage images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'homepage-images');

-- Policy untuk authenticated users update
CREATE POLICY "Authenticated users can update homepage images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'homepage-images')
WITH CHECK (bucket_id = 'homepage-images');

-- Policy untuk authenticated users delete
CREATE POLICY "Authenticated users can delete homepage images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'homepage-images');
```

### 3. Verifikasi Setup

1. Coba upload gambar melalui admin panel (`/admin/homepage-images`)
2. Cek di Storage → `homepage-images` apakah file sudah terupload
3. Cek struktur folder: `hero/`, `about/`, `facilities/`, `testimonial/`
4. Coba akses URL gambar di browser (harus bisa diakses tanpa login)

## 🎨 Optimasi Gambar

Sistem ini secara otomatis mengoptimasi gambar sebelum upload:

### Ukuran Maksimal per Section:
- **Hero**: 1920x1080px, quality 90%
- **About**: 1200x1200px, quality 85%
- **Facilities**: 800x800px, quality 80%
- **Testimonial**: 600x600px, quality 80%

### Format Output:
- Semua gambar dikonversi ke **WebP** untuk ukuran lebih kecil
- Kompresi otomatis dengan quality yang disesuaikan
- Resize otomatis dengan menjaga aspect ratio

### Manfaat:
- ✅ Ukuran file lebih kecil (hemat storage)
- ✅ Loading lebih cepat
- ✅ Hemat bandwidth
- ✅ Kualitas tetap terjaga

## 🔧 Troubleshooting

### Error: "Bucket not found"

**Solusi**: 
- Pastikan nama bucket adalah `homepage-images` (case-sensitive)
- Pastikan bucket sudah dibuat di Supabase Dashboard

### Error: "new row violates row-level security policy"

**Solusi**: Pastikan policies sudah dibuat dengan benar. Jalankan migration atau query SQL di atas.

### Gambar tidak muncul di halaman utama

**Solusi**:
- Pastikan bucket sudah di-set sebagai **Public bucket**
- Cek URL gambar di database (harus valid)
- Cek console browser untuk error loading image
- Pastikan Next.js Image component bisa mengakses URL Supabase

### Upload gagal dengan error 413 (Payload Too Large)

**Solusi**:
- File terlalu besar (max 10MB sebelum optimasi)
- Atau ubah limit di bucket settings
- Sistem akan otomatis resize, jadi file besar akan dikurangi

### Gambar terlihat buram setelah upload

**Solusi**:
- Quality setting sudah dioptimasi untuk balance antara ukuran dan kualitas
- Untuk hero section, quality sudah 90% (cukup tinggi)
- Jika perlu kualitas lebih tinggi, edit di `lib/homepage-storage.ts`

## 📝 Catatan Penting

1. **Public Bucket**: Bucket harus public agar gambar bisa diakses tanpa authentication
2. **File Naming**: File akan otomatis diberi nama dengan format: `{section}-{timestamp}-{random}.webp`
3. **Storage Limit**: Perhatikan storage limit di Supabase plan Anda
4. **Image Optimization**: 
   - Optimasi dilakukan di client-side sebelum upload
   - Menggunakan Canvas API untuk resize dan compress
   - Format output selalu WebP untuk ukuran optimal
5. **Cache**: Gambar di-cache selama 1 tahun (31536000 detik) untuk performa optimal

## 🔒 Keamanan

- Hanya authenticated users (admin) yang bisa upload/delete gambar
- Public hanya bisa melihat gambar
- File type validation di frontend
- File size limit untuk prevent abuse
- Gambar diorganisir per section untuk kemudahan manajemen

## 📚 Referensi

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [WebP Format](https://developers.google.com/speed/webp)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

