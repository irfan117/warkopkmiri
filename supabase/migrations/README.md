# Supabase Migrations

Folder ini berisi migration SQL untuk database Cafe Management System.

## File Migration

- `20240101000000_initial_schema.sql` - Initial schema dengan tabel, indexes, RLS policies, functions, dan triggers

## Cara Menjalankan Migration

### 1. Link Project Supabase (Jika Belum)

Jika belum pernah link project Supabase, jalankan:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

Atau login dulu:

```bash
npx supabase login
npx supabase link
```

### 2. Push Migration ke Supabase

Jalankan migration dengan perintah:

```bash
npx supabase db push
```

Perintah ini akan:
- Mencari semua file SQL di folder `supabase/migrations/`
- Menjalankan migration yang belum pernah dijalankan
- Menjalankan migration sesuai urutan timestamp di nama file

### 3. Verifikasi Migration

Setelah migration berhasil, verifikasi dengan:

1. Cek di Supabase Dashboard → Table Editor
2. Pastikan tabel `menu`, `orders`, dan `order_items` sudah terbuat
3. Cek RLS policies di Supabase Dashboard → Authentication → Policies

## Struktur Migration

Setiap file migration harus mengikuti format:
- `YYYYMMDDHHMMSS_description.sql`
- Urutan timestamp menentukan urutan eksekusi migration

## Menambahkan Data Seed

Untuk menambahkan data seed (contoh menu), jalankan file `scripts/seed-menu.sql` di Supabase Dashboard → SQL Editor setelah migration selesai.

## Troubleshooting

**Error: Project not linked**
- Jalankan `npx supabase link` terlebih dahulu

**Error: Migration failed**
- Cek error message di console
- Pastikan semua tabel belum ada sebelumnya (atau gunakan `DROP TABLE IF EXISTS` untuk reset)
- Cek koneksi ke Supabase

**Migration sudah pernah dijalankan**
- Supabase akan skip migration yang sudah pernah dijalankan
- Jika ingin reset, hapus migration history di Supabase Dashboard atau reset database
