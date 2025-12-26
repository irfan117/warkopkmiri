# Dokumentasi Pengembangan Proyek Kafe Management System

## Ringkasan Proyek

Sistem manajemen kafe berbasis web yang memungkinkan pelanggan untuk memesan menu tanpa login, dan admin (kasir/pelayan) untuk mengelola pesanan dan melihat laporan penjualan.

## Teknologi yang Digunakan

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Framework**: Tailwind CSS + ShadCN UI
- **Icons**: Lucide React
- **Toast Notifications**: Sonner

## Struktur Database

### Tabel `menu`
Menyimpan data menu kafe:
- `id` (uuid, PK): ID unik menu
- `name` (text): Nama menu
- `description` (text): Deskripsi menu
- `price` (numeric): Harga menu
- `category` (text): Kategori (minuman, makanan, snack)
- `image_url` (text): URL gambar menu
- `available` (boolean): Status ketersediaan
- `created_at` (timestamptz): Waktu dibuat

### Tabel `orders`
Menyimpan data pesanan:
- `id` (uuid, PK): ID unik pesanan
- `table_number` (integer): Nomor meja
- `customer_name` (text): Nama pelanggan (opsional)
- `status` (text): Status pesanan (menunggu_pembayaran, dibayar, selesai)
- `total_amount` (numeric): Total harga pesanan
- `created_at` (timestamptz): Waktu pesanan dibuat
- `updated_at` (timestamptz): Waktu pesanan diupdate

### Tabel `order_items`
Menyimpan detail item pesanan:
- `id` (uuid, PK): ID unik item
- `order_id` (uuid, FK): Referensi ke orders
- `menu_id` (uuid, FK): Referensi ke menu
- `quantity` (integer): Jumlah item
- `price` (numeric): Harga per item saat pemesanan
- `subtotal` (numeric): Total harga (quantity × price)
- `created_at` (timestamptz): Waktu dibuat

## Row Level Security (RLS)

### Menu Table
- Public dapat melihat menu yang tersedia (available = true)
- Admin dapat melihat semua menu
- Admin dapat menambah dan mengupdate menu

### Orders Table
- Public dapat membuat pesanan baru
- Admin dapat melihat semua pesanan
- Admin dapat mengupdate status pesanan

### Order Items Table
- Public dapat membuat item pesanan
- Admin dapat melihat semua item pesanan

## Fitur yang Sudah Diimplementasikan

### 1. Halaman Pelanggan (Public)

#### a. Homepage (`/`)
- Landing page dengan 2 pilihan utama:
  - Tombol "Mulai Pesan" untuk pelanggan
  - Tombol "Login Admin" untuk admin
- Desain modern dengan gradasi warna amber/orange

#### b. Pilih Meja (`/order/select-table`)
- Grid button untuk quick select meja 1-12
- Input manual untuk nomor meja lainnya
- Input nama pelanggan (opsional)
- Validasi nomor meja harus > 0

#### c. Menu Ordering (`/order/menu`)
- Tab untuk filter kategori (minuman, makanan, snack)
- Grid card untuk setiap menu item
- Keranjang belanja dengan fitur:
  - Tambah/kurangi quantity
  - Lihat subtotal per item
  - Lihat total keseluruhan
- Submit pesanan langsung ke database
- Real-time feedback dengan toast notifications

#### d. Order Success (`/order/success`)
- Konfirmasi pesanan berhasil
- Tampilan detail pesanan
- Tombol kembali ke homepage

### 2. Halaman Admin (Protected)

#### a. Login Page (`/admin/login`)
- Form login dengan email dan password
- Menggunakan Supabase Auth
- Redirect ke dashboard setelah login berhasil
- Error handling untuk kredensial salah

#### b. Dashboard (`/admin/dashboard`)
- Protected route (perlu login)
- Summary cards untuk statistik:
  - Jumlah pesanan menunggu pembayaran
  - Jumlah pesanan dibayar
  - Jumlah pesanan selesai
- Tab untuk filter pesanan berdasarkan status
- Setiap pesanan menampilkan:
  - Nomor meja dan nama pelanggan
  - Daftar item pesanan dengan quantity
  - Total harga
  - Waktu pemesanan
- Tombol aksi:
  - "Tandai Dibayar" untuk status menunggu_pembayaran
  - "Tandai Selesai" untuk status dibayar
- Tombol logout
- Link ke laporan penjualan

#### c. Sales Report (`/admin/sales`)
- Protected route (perlu login)
- Laporan penjualan harian dengan metrics:
  - Total pesanan dan revenue
  - Breakdown per status (pending, dibayar, selesai)
- Daftar 10 pesanan terbaru hari ini
- Data difilter berdasarkan tanggal hari ini (mulai jam 00:00)

## File Structure

```
/tmp/cc-agent/59081439/project/
├── app/
│   ├── page.tsx                      # Homepage
│   ├── layout.tsx                    # Root layout dengan Toaster
│   ├── globals.css                   # Global styles
│   ├── order/
│   │   ├── select-table/
│   │   │   └── page.tsx             # Pilih meja
│   │   ├── menu/
│   │   │   └── page.tsx             # Menu ordering
│   │   └── success/
│   │       └── page.tsx             # Order success
│   └── admin/
│       ├── login/
│       │   └── page.tsx             # Admin login
│       ├── dashboard/
│       │   └── page.tsx             # Order management
│       └── sales/
│           └── page.tsx             # Sales report
├── lib/
│   ├── supabase.ts                  # Supabase client & types
│   └── utils.ts                     # Utility functions
├── components/
│   └── ui/                          # ShadCN UI components
├── scripts/
│   └── seed-menu.sql                # SQL seed data
├── DATABASE_SETUP.md                # Database setup guide
└── PENGEMBANGAN_PROYEK.md           # This file
```

## Cara Menjalankan Proyek

### 1. Setup Database
Ikuti instruksi di `DATABASE_SETUP.md`:
- Buat tabel di Supabase
- Jalankan seed data untuk menu
- Buat akun admin

### 2. Environment Variables
File `.env` sudah berisi:
```
NEXT_PUBLIC_SUPABASE_URL=https://gufbqtdkcqoatjbnramg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### 5. Build untuk Production
```bash
npm run build
npm run start
```

## User Flow

### Flow Pelanggan:
1. Buka homepage → Klik "Mulai Pesan"
2. Pilih nomor meja (dan input nama opsional) → Klik "Lanjut ke Menu"
3. Browse menu berdasarkan kategori
4. Tambah item ke keranjang
5. Review keranjang (adjust quantity jika perlu)
6. Klik "Kirim Pesanan"
7. Lihat konfirmasi pesanan → Kembali ke beranda atau pesan lagi

### Flow Admin:
1. Buka homepage → Klik "Login Admin"
2. Login dengan email dan password
3. Masuk ke dashboard → Lihat semua pesanan
4. Filter pesanan berdasarkan status (tab)
5. Update status pesanan:
   - Menunggu Pembayaran → Tandai Dibayar (setelah pelanggan bayar)
   - Dibayar → Tandai Selesai (setelah makanan diantar)
6. Klik "Laporan Penjualan" untuk melihat summary harian
7. Logout setelah selesai

## Langkah Pengembangan Selanjutnya

### 1. Fitur Menu Management untuk Admin
**Prioritas**: Tinggi

Saat ini menu hanya bisa ditambahkan via SQL. Perlu dibuat UI untuk admin:
- Halaman `/admin/menu` untuk CRUD menu items
- Form tambah menu baru (nama, deskripsi, harga, kategori, upload gambar)
- Edit menu existing
- Toggle available/unavailable
- Soft delete menu

**File yang perlu dibuat**:
- `app/admin/menu/page.tsx` - List dan manage menu
- `app/admin/menu/add/page.tsx` - Form tambah menu
- `app/admin/menu/edit/[id]/page.tsx` - Form edit menu

**Perubahan RLS yang diperlukan**:
- Tambah policy DELETE untuk authenticated users di tabel menu

### 2. Upload dan Manajemen Gambar Menu
**Prioritas**: Tinggi

Saat ini `image_url` masih kosong. Perlu implementasi:
- Integrasi dengan Supabase Storage untuk upload gambar
- Preview gambar di menu ordering page
- Placeholder image jika tidak ada gambar
- Image optimization dan resizing

**Teknologi**:
- Supabase Storage bucket untuk menyimpan gambar
- Next.js Image component untuk optimasi
- Library seperti `react-dropzone` untuk upload UI

### 3. Real-time Updates dengan Supabase Realtime
**Prioritas**: Sedang

Dashboard admin akan lebih powerful dengan real-time updates:
- Auto-refresh saat ada pesanan baru
- Live update status pesanan
- Notifikasi suara untuk pesanan baru

**Implementasi**:
```typescript
// Subscribe ke changes di tabel orders
const subscription = supabase
  .channel('orders')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'orders' },
    (payload) => {
      // Update UI
    }
  )
  .subscribe()
```

### 4. Filter dan Search Pesanan
**Prioritas**: Sedang

Untuk kafe yang ramai, perlu fitur:
- Search pesanan by nomor meja atau nama
- Filter by tanggal (tidak hanya hari ini)
- Filter by range harga
- Sort by waktu/total amount

### 5. Print Receipt / Nota
**Prioritas**: Sedang

Fitur print untuk:
- Nota untuk pelanggan
- Kitchen order untuk dapur
- End of day report untuk kasir

**Library yang bisa digunakan**:
- `react-to-print`
- `jsPDF` untuk generate PDF

### 6. Multi-language Support
**Prioritas**: Rendah

Saat ini aplikasi hanya Bahasa Indonesia. Bisa tambahkan:
- English
- Bahasa lainnya sesuai kebutuhan

**Library**: `next-intl` atau `i18next`

### 7. Reporting dan Analytics
**Prioritas**: Sedang

Expand sales report dengan:
- Chart/grafik penjualan (menggunakan Recharts - sudah installed)
- Best selling items
- Peak hours analysis
- Weekly/monthly reports
- Export to Excel/CSV

### 8. Table Management
**Prioritas**: Rendah

Saat ini nomor meja bisa input bebas. Bisa ditambahkan:
- Tabel `tables` untuk daftar meja yang tersedia
- Status meja (available, occupied, reserved)
- Kapasitas meja (jumlah kursi)
- Merging tables untuk group besar

### 9. Sistem Loyalty/Membership
**Prioritas**: Rendah

Untuk meningkatkan repeat customers:
- Registrasi member (nama, nomor HP, email)
- Point system
- Promo dan discount
- Birthday voucher

### 10. Payment Gateway Integration
**Prioritas**: Sedang (jika ingin cashless)

Integrasi dengan payment provider:
- Midtrans
- Xendit
- Dana/OVO/GoPay
- QRIS

### 11. Kitchen Display System (KDS)
**Prioritas**: Tinggi (untuk operasional)

Layar khusus untuk dapur:
- Tampilan pesanan yang perlu diproses
- Status: new, cooking, ready
- Timer untuk tracking cooking time
- Alert untuk pesanan yang lama

**File yang perlu dibuat**:
- `app/kitchen/page.tsx` - KDS interface
- Fullscreen mode untuk display

### 12. Inventory Management
**Prioritas**: Sedang

Track bahan baku dan stock:
- Tabel `inventory` untuk bahan baku
- Tabel `recipe` untuk hubungan menu dengan bahan
- Auto-deduct stock saat ada pesanan
- Low stock alert
- Purchase order system

### 13. Staff Management
**Prioritas**: Rendah

Multi-user admin dengan role:
- Super Admin (full access)
- Kasir (order & payment only)
- Waiter (order only)
- Chef (kitchen display only)

**Perubahan**:
- Tambah kolom `role` di auth.users metadata
- Update RLS policies berdasarkan role
- Logging activity per user

### 14. Mobile App Version
**Prioritas**: Rendah

Convert ke mobile app menggunakan:
- React Native
- Capacitor
- Progressive Web App (PWA)

### 15. Customer Feedback
**Prioritas**: Rendah

Rating dan review system:
- Rating per menu item
- Overall experience rating
- Comment/feedback form
- Display average rating di menu

## Bug Fixes dan Improvements Potensial

1. **Error Handling**:
   - Tambah try-catch lebih comprehensive
   - Better error messages untuk user
   - Logging untuk debugging

2. **Loading States**:
   - Skeleton loader untuk better UX
   - Progress indicator saat submit order

3. **Validation**:
   - Tambah validation di backend (database triggers)
   - Form validation yang lebih strict

4. **Performance**:
   - Pagination untuk daftar pesanan
   - Lazy loading untuk images
   - Memoization untuk component optimization

5. **Accessibility**:
   - Keyboard navigation
   - Screen reader support
   - ARIA labels

6. **Security**:
   - Rate limiting untuk prevent spam orders
   - CAPTCHA untuk public forms
   - Audit log untuk admin actions

## Testing Checklist

### Testing Manual:

**Customer Flow**:
- [ ] Dapat memilih meja dengan button atau input manual
- [ ] Dapat melihat menu berdasarkan kategori
- [ ] Dapat menambah item ke keranjang
- [ ] Dapat mengubah quantity di keranjang
- [ ] Dapat submit pesanan dan lihat konfirmasi
- [ ] Toast notification muncul dengan benar

**Admin Flow**:
- [ ] Dapat login dengan kredensial valid
- [ ] Redirect ke login jika akses dashboard tanpa auth
- [ ] Dapat melihat semua pesanan
- [ ] Dapat filter pesanan by status
- [ ] Dapat update status pesanan
- [ ] Dapat melihat laporan penjualan harian
- [ ] Dapat logout

**Edge Cases**:
- [ ] Submit order dengan keranjang kosong (harus error)
- [ ] Login dengan kredensial salah (harus error)
- [ ] Akses admin page tanpa login (harus redirect)
- [ ] Order dengan menu yang tidak ada (harus error)

## Kontak dan Support

Untuk pertanyaan atau issues, silakan buat issue di repository atau hubungi tim developer.

## License

[Sesuaikan dengan license proyek Anda]

---

**Last Updated**: 23 Oktober 2025
**Version**: 1.0.0
**Status**: Production Ready (dengan setup database manual)
