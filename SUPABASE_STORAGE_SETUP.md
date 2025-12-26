# Setup Supabase Storage untuk Gambar Menu

Dokumentasi ini menjelaskan cara setup Supabase Storage untuk menyimpan gambar menu.

## 📋 Langkah-langkah Setup

### 1. Buat Storage Bucket

1. Masuk ke **Supabase Dashboard**
2. Pilih project Anda
3. Buka menu **Storage** di sidebar kiri
4. Klik tombol **"New bucket"** atau **"Create bucket"**
5. Isi form:
   - **Name**: `menu-images` (harus sama dengan yang ada di kode)
   - **Public bucket**: ✅ **Centang** (agar gambar bisa diakses public)
   - **File size limit**: 5 MB (atau sesuai kebutuhan)
   - **Allowed MIME types**: `image/*` (atau spesifik: `image/jpeg,image/png,image/webp`)
6. Klik **"Create bucket"**

### 2. Setup Storage Policies (RLS)

Setelah bucket dibuat, kita perlu setup Row Level Security (RLS) policies agar:
- Authenticated users (admin) bisa upload/delete gambar
- Public bisa melihat gambar

#### a. Buka SQL Editor di Supabase Dashboard

#### b. Jalankan query berikut:

```sql
-- Policy untuk public read (semua orang bisa melihat gambar)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

-- Policy untuk authenticated users upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'menu-images');

-- Policy untuk authenticated users update
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'menu-images')
WITH CHECK (bucket_id = 'menu-images');

-- Policy untuk authenticated users delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'menu-images');
```

### 3. Verifikasi Setup

1. Coba upload gambar melalui admin panel
2. Cek di Storage → `menu-images` apakah file sudah terupload
3. Coba akses URL gambar di browser (harus bisa diakses tanpa login)

## 🔧 Troubleshooting

### Error: "new row violates row-level security policy"

**Solusi**: Pastikan policies sudah dibuat dengan benar. Cek di Supabase Dashboard → Storage → Policies.

### Error: "Bucket not found"

**Solusi**: 
- Pastikan nama bucket adalah `menu-images` (case-sensitive)
- Atau ubah nama bucket di file `lib/storage.ts` sesuai dengan nama bucket Anda

### Gambar tidak muncul di halaman menu

**Solusi**:
- Pastikan bucket sudah di-set sebagai **Public bucket**
- Cek URL gambar di database (harus valid)
- Cek console browser untuk error loading image

### Upload gagal dengan error 413 (Payload Too Large)

**Solusi**:
- File terlalu besar (max 5MB)
- Atau ubah limit di bucket settings

## 📝 Catatan Penting

1. **Public Bucket**: Bucket harus public agar gambar bisa diakses tanpa authentication
2. **File Naming**: File akan otomatis diberi nama dengan format: `{menuId}-{timestamp}.{ext}`
3. **Storage Limit**: Perhatikan storage limit di Supabase plan Anda
4. **Image Optimization**: Next.js Image component akan otomatis optimize gambar

## 🔒 Keamanan

- Hanya authenticated users (admin) yang bisa upload/delete gambar
- Public hanya bisa melihat gambar
- File type validation di frontend dan backend
- File size limit untuk prevent abuse

## 📚 Referensi

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)

