# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan di file ini.

## [1.2.0] - Desember 2024

### ✨ Fitur Baru

#### 1. Perbaikan UI Keranjang
- ✅ Keranjang tidak transparan lagi (solid background dengan border)
- ✅ Background amber untuk header keranjang
- ✅ Shadow dan border untuk better visibility

#### 2. Halaman "Silakan Bayar"
- ✅ Update halaman success menjadi halaman informasi pembayaran
- ✅ Pesan jelas: "Silakan Bayar untuk Memproses Pesanan"
- ✅ Informasi bahwa pesanan bisa dikelompokkan
- ✅ Tombol "Pesan Lagi" untuk order lagi
- ✅ Design yang lebih informatif dengan icon dan color coding

#### 3. Laporan Penjualan dengan History & Export
- ✅ **Date Picker**: Pilih tanggal untuk melihat laporan sebelumnya
- ✅ **History Laporan**: Bisa melihat laporan dari tanggal manapun
- ✅ **Auto-delete Data**: Data lebih dari 1 bulan otomatis dihapus
- ✅ **Export CSV**: Export laporan per tanggal/hari ke file CSV
- ✅ **Summary di Export**: Include summary statistics di file CSV
- ✅ **Tombol "Hari Ini"**: Quick access ke laporan hari ini

**File yang diupdate:**
- `app/admin/sales/page.tsx` - Date picker, export, auto-delete
- `app/order/menu/page.tsx` - Keranjang tidak transparan
- `app/order/success/page.tsx` - Halaman "Silakan Bayar"

### 🔧 Perbaikan

- ✅ Pesanan bisa dikelompokkan (multiple orders dari meja yang sama)
- ✅ Semua pesanan yang sudah dibayar akan diproses bersamaan
- ✅ UI/UX yang lebih baik untuk flow pembayaran

### 📝 Catatan

- Auto-delete berjalan setiap kali halaman laporan dimuat
- Export CSV menggunakan format UTF-8 dengan BOM untuk Excel compatibility
- Date picker menggunakan locale Indonesia

---

## [1.1.0] - Desember 2024

### ✨ Fitur Baru

#### 1. Upload Gambar Menu dengan Supabase Storage
- ✅ Implementasi upload gambar langsung ke Supabase Storage
- ✅ Preview gambar sebelum upload
- ✅ Validasi file type dan size (max 5MB)
- ✅ Auto-delete gambar lama saat update/delete menu
- ✅ Display gambar di halaman menu ordering
- ✅ Support untuk format: PNG, JPG, WEBP

**File yang ditambahkan:**
- `lib/storage.ts` - Helper functions untuk upload/delete gambar

**File yang diupdate:**
- `app/admin/menu/page.tsx` - Form upload dengan preview
- `app/order/menu/page.tsx` - Display gambar menu
- `next.config.js` - Konfigurasi untuk Supabase Storage images

**Dokumentasi:**
- `SUPABASE_STORAGE_SETUP.md` - Panduan setup Supabase Storage

#### 2. Real-time Updates untuk Dashboard Pesanan
- ✅ Supabase Realtime subscription untuk tabel `orders` dan `order_items`
- ✅ Auto-refresh dashboard saat ada pesanan baru
- ✅ Auto-refresh saat status pesanan berubah
- ✅ Toast notification untuk pesanan baru
- ✅ Toast notification untuk update status
- ✅ Tombol refresh manual

**File yang diupdate:**
- `app/admin/dashboard/page.tsx` - Real-time subscription dan notifications

**Setup yang diperlukan:**
- Enable Realtime untuk tabel `orders` dan `order_items` di Supabase
- Lihat `DATABASE_SETUP.md` bagian "Enable Realtime"

### 🔧 Perbaikan

- ✅ Perbaikan typo di `scripts/seed-menu.sql`
- ✅ Update dokumentasi dengan instruksi setup storage dan realtime

### 📝 Dokumentasi

- ✅ `SUPABASE_STORAGE_SETUP.md` - Panduan lengkap setup Supabase Storage
- ✅ Update `DATABASE_SETUP.md` - Tambah instruksi Realtime dan Storage
- ✅ Update `DOKUMENTASI_PROYEK.md` - Status fitur terbaru

### ⚠️ Breaking Changes

Tidak ada breaking changes. Fitur baru bersifat opsional dan backward compatible.

### 📋 Migration Guide

#### Untuk menggunakan Upload Gambar:
1. Setup Supabase Storage bucket (lihat `SUPABASE_STORAGE_SETUP.md`)
2. Setup Storage policies
3. Upload gambar melalui admin panel

#### Untuk menggunakan Real-time Updates:
1. Enable Realtime untuk tabel `orders` dan `order_items` di Supabase
2. Dashboard akan otomatis update real-time

---

## [1.0.0] - Oktober 2024

### ✨ Fitur Awal

- ✅ Landing page dengan desain modern
- ✅ Sistem pemesanan pelanggan (tanpa login)
- ✅ Pilih meja dan input nama pelanggan
- ✅ Menu ordering dengan kategori
- ✅ Keranjang belanja dengan quantity management
- ✅ Submit pesanan ke database
- ✅ Halaman konfirmasi pesanan
- ✅ Admin authentication (login/logout)
- ✅ Admin dashboard untuk kelola pesanan
- ✅ Update status pesanan
- ✅ Manajemen menu (CRUD lengkap)
- ✅ Laporan penjualan harian
- ✅ Row Level Security (RLS) policies

---

## Catatan

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

