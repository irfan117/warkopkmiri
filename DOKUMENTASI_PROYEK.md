# 📚 Dokumentasi Proyek - Sistem Manajemen Kafe

**Nama Proyek**: Kemiri Cafe - Cafe Management System
**Versi**: 1.0.0  
**Tanggal Update**: Desember 2024  
**Status**: ✅ Production Ready (dengan beberapa fitur tambahan yang bisa dikembangkan)

---

## 📋 Daftar Isi

1. [Ringkasan Proyek](#ringkasan-proyek)
2. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
3. [Status Perkembangan Saat Ini](#status-perkembangan-saat-ini)
4. [Fitur yang Sudah Diimplementasikan](#fitur-yang-sudah-diimplementasikan)
5. [Struktur Database](#struktur-database)
6. [Struktur Proyek](#struktur-proyek)
7. [Cara Menjalankan Proyek](#cara-menjalankan-proyek)
8. [Pengembangan Selanjutnya](#pengembangan-selanjutnya)
9. [Rekomendasi Prioritas](#rekomendasi-prioritas)

---

## 🎯 Ringkasan Proyek

Sistem manajemen kafe berbasis web yang memungkinkan:
- **Pelanggan** untuk memesan menu secara digital tanpa perlu login
- **Admin/Kasir/Pelayan** untuk mengelola pesanan, menu, dan melihat laporan penjualan

Aplikasi ini dirancang untuk meningkatkan efisiensi operasional kafe dengan sistem pemesanan digital yang user-friendly dan dashboard admin yang komprehensif.

---

## 🛠 Teknologi yang Digunakan

### Frontend
- **Framework**: Next.js 13.5.1 (App Router)
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.3
- **UI Components**: ShadCN UI (Radix UI primitives)
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts (untuk visualisasi data)

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (siap digunakan untuk upload gambar)
- **Real-time**: Supabase Realtime (siap digunakan)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript

---

## 📊 Status Perkembangan Saat Ini

### ✅ Fitur Core (100% Selesai)
- [x] Landing page dengan desain modern
- [x] Sistem pemesanan pelanggan (tanpa login)
- [x] Pilih meja dan input nama pelanggan
- [x] Menu ordering dengan kategori
- [x] Keranjang belanja dengan quantity management
- [x] Submit pesanan ke database
- [x] Halaman konfirmasi pesanan
- [x] Admin authentication (login/logout)
- [x] Admin dashboard untuk kelola pesanan
- [x] Update status pesanan (menunggu pembayaran → dibayar → selesai)
- [x] Manajemen menu (CRUD lengkap)
- [x] Laporan penjualan harian
- [x] Row Level Security (RLS) policies
- [x] Responsive design (mobile & desktop)

### 🔄 Fitur Tambahan yang Bisa Dikembangkan
- [ ] Upload gambar menu (saat ini hanya URL)
- [ ] Real-time updates untuk dashboard
- [ ] Print receipt/nota
- [ ] Filter dan search pesanan
- [ ] Kitchen Display System (KDS)
- [ ] Payment gateway integration
- [ ] Inventory management
- [ ] Multi-language support
- [ ] Customer feedback/rating system
- [ ] Table management system
- [ ] Staff management dengan role-based access
- [ ] Advanced analytics & reporting
- [ ] Export data ke Excel/CSV

**Progress Keseluruhan**: ~75% dari fitur core sudah selesai dan production-ready

---

## ✨ Fitur yang Sudah Diimplementasikan

### 1. Halaman Pelanggan (Public Access)

#### a. Homepage (`/`)
**Status**: ✅ Selesai

Fitur:
- Landing page dengan desain modern dan animasi
- Particle background effect
- Hero section dengan call-to-action
- Section "Tentang Kami" dengan grid gambar
- Section "Fasilitas" dengan 6 fasilitas utama
- Section testimonial
- Section lokasi & kontak dengan Google Maps
- Form kontak/feedback
- Navigation bar dengan scroll effect
- Responsive design untuk semua device

**Teknologi**: Next.js App Router, Tailwind CSS, Canvas API untuk animasi

#### b. Pilih Meja (`/order/select-table`)
**Status**: ✅ Selesai

Fitur:
- Quick select buttons untuk meja 1-12
- Input manual untuk nomor meja lainnya
- Input nama pelanggan (opsional)
- Validasi nomor meja harus > 0
- Navigasi ke halaman menu dengan parameter URL

**User Flow**: Homepage → Pilih Meja → Menu Ordering

#### c. Menu Ordering (`/order/menu`)
**Status**: ✅ Selesai

Fitur:
- Tab filter berdasarkan kategori (minuman, makanan, snack)
- Grid card untuk setiap menu item
- Menampilkan nama, deskripsi, dan harga
- Keranjang belanja dengan fitur:
  - Tambah item ke keranjang
  - Update quantity (tambah/kurangi)
  - Lihat subtotal per item
  - Lihat total keseluruhan
  - Sticky cart di bagian bawah
- Submit pesanan ke database
- Toast notifications untuk feedback
- Validasi keranjang tidak kosong
- Redirect ke halaman success setelah submit

**Data Flow**: 
- Fetch menu dari Supabase (hanya yang `available = true`)
- Create order di tabel `orders`
- Create order_items di tabel `order_items`
- Calculate total amount otomatis

#### d. Order Success (`/order/success`)
**Status**: ✅ Selesai

Fitur:
- Konfirmasi pesanan berhasil
- Tampilan detail pesanan (meja, nama, total)
- Tombol kembali ke homepage
- Fetch order data dari database berdasarkan orderId

### 2. Halaman Admin (Protected - Perlu Login)

#### a. Admin Layout (`/admin/layout.tsx`)
**Status**: ✅ Selesai

Fitur:
- Sidebar navigation dengan 3 menu utama
- Responsive sidebar (mobile-friendly)
- Authentication check untuk semua halaman admin
- Admin role check (menggunakan tabel `profiles.is_admin`)
- Logout functionality
- Loading states
- Active route indicator

**Menu Navigasi**:
1. Dashboard (`/admin/dashboard`)
2. Manajemen Menu (`/admin/menu`)
3. Laporan Penjualan (`/admin/sales`)

#### b. Login Page (`/admin/login`)
**Status**: ✅ Selesai

Fitur:
- Form login dengan email dan password
- Menggunakan Supabase Auth
- Error handling untuk kredensial salah
- Redirect ke dashboard setelah login berhasil
- Validasi form
- Toast notifications

**Security**: 
- Check admin role dari tabel `profiles`
- Auto logout jika bukan admin

#### c. Dashboard (`/admin/dashboard`)
**Status**: ✅ Selesai

Fitur:
- **Summary Cards**: 3 kartu statistik
  - Menunggu Pembayaran (merah)
  - Dibayar (biru)
  - Selesai (hijau)
- **Tab Filter**: Filter pesanan berdasarkan status
- **Detail Pesanan**: Setiap pesanan menampilkan:
  - Nomor meja
  - Nama pelanggan (jika ada)
  - Daftar item pesanan dengan quantity
  - Subtotal per item
  - Total harga
  - Waktu pemesanan
  - Status badge
- **Aksi Pesanan**:
  - "Tandai Dibayar" untuk status `menunggu_pembayaran`
  - "Tandai Selesai" untuk status `dibayar`
- Real-time data fetch (refresh manual)
- Loading states
- Empty state handling

**Data Flow**:
- Fetch semua orders dengan join ke order_items dan menu
- Group by status untuk summary cards
- Update status dengan Supabase update

#### d. Manajemen Menu (`/admin/menu`)
**Status**: ✅ Selesai (Fitur ini sudah diimplementasikan!)

Fitur:
- **Daftar Menu**: Tabel yang menampilkan semua menu
  - Nama menu dan deskripsi
  - Kategori dengan badge
  - Harga (format Rupiah)
  - Status ketersediaan
- **Tambah Menu Baru**:
  - Dialog form dengan validasi
  - Input: nama, deskripsi, harga, kategori, URL gambar, status
  - Validasi harga harus angka positif
- **Edit Menu**:
  - Dialog form pre-filled dengan data existing
  - Update semua field
- **Hapus Menu**:
  - Konfirmasi sebelum hapus
  - Hard delete dari database
- **Toggle Available/Unavailable**:
  - Quick toggle dengan icon Eye/EyeOff
  - Menu yang unavailable tidak muncul di halaman pemesanan
- **CRUD Lengkap**: Create, Read, Update, Delete semua berfungsi

**Catatan**: Fitur ini sudah lengkap dan berfungsi dengan baik!

#### e. Laporan Penjualan (`/admin/sales`)
**Status**: ✅ Selesai

Fitur:
- **Summary Cards**: 4 kartu statistik
  - Total Pesanan + Total Revenue
  - Menunggu Pembayaran + Revenue Pending
  - Dibayar + Revenue Paid
  - Selesai + Revenue Completed
- **Daftar Pesanan Terbaru**: 10 pesanan terakhir hari ini
  - Nomor meja
  - Nama pelanggan
  - Total harga
  - Status
  - Waktu pemesanan
- Data difilter berdasarkan tanggal hari ini (mulai jam 00:00)
- Format Rupiah untuk semua nilai uang

**Data Flow**:
- Fetch orders dari hari ini (created_at >= today 00:00)
- Calculate metrics per status
- Sort by created_at descending
- Limit 10 untuk recent orders

### 3. Database & Security

#### a. Database Schema
**Status**: ✅ Selesai

**Tabel `menu`**:
- `id` (uuid, PK)
- `name` (text)
- `description` (text)
- `price` (numeric)
- `category` (text: minuman, makanan, snack)
- `image_url` (text)
- `available` (boolean)
- `created_at` (timestamptz)

**Tabel `orders`**:
- `id` (uuid, PK)
- `table_number` (integer)
- `customer_name` (text)
- `status` (text: menunggu_pembayaran, dibayar, selesai)
- `total_amount` (numeric)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Tabel `order_items`**:
- `id` (uuid, PK)
- `order_id` (uuid, FK ke orders)
- `menu_id` (uuid, FK ke menu)
- `quantity` (integer)
- `price` (numeric)
- `subtotal` (numeric)
- `created_at` (timestamptz)

**Tabel `profiles`** (untuk admin check):
- `id` (uuid, FK ke auth.users)
- `is_admin` (boolean)

#### b. Row Level Security (RLS)
**Status**: ✅ Selesai

**Menu Table**:
- Public: Bisa lihat menu yang `available = true`
- Authenticated: Bisa lihat semua menu, insert, update, delete

**Orders Table**:
- Public: Bisa create orders
- Authenticated: Bisa lihat semua orders, update orders

**Order Items Table**:
- Public: Bisa create order_items
- Authenticated: Bisa lihat semua order_items

#### c. Database Functions & Triggers
**Status**: ✅ Selesai

- Auto-update `updated_at` pada tabel orders saat ada perubahan
- Index untuk performa query (status, created_at, order_id)

---

## 🗂 Struktur Proyek

```
cafee/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage (landing page)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── order/                    # Customer ordering flow
│   │   ├── select-table/
│   │   │   └── page.tsx         # Pilih meja
│   │   ├── menu/
│   │   │   └── page.tsx         # Menu ordering
│   │   └── success/
│   │       └── page.tsx         # Order success
│   └── admin/                    # Admin panel
│       ├── layout.tsx            # Admin layout dengan sidebar
│       ├── login/
│       │   └── page.tsx         # Admin login
│       ├── dashboard/
│       │   └── page.tsx         # Order management
│       ├── menu/
│       │   └── page.tsx         # Menu management (CRUD)
│       └── sales/
│           └── page.tsx         # Sales report
├── components/
│   └── ui/                      # ShadCN UI components (40+ components)
├── lib/
│   ├── supabase.ts              # Supabase client & types
│   └── utils.ts                 # Utility functions (cn, etc)
├── hooks/
│   └── use-toast.ts             # Toast hook
├── scripts/
│   ├── migration.sql            # Database migration
│   └── seed-menu.sql            # Seed data untuk menu
├── supabase/
│   └── migrations/              # Supabase migrations
├── package.json                  # Dependencies
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.js                # Next.js configuration
├── DATABASE_SETUP.md             # Database setup guide
├── CARA_AKSES_OPERASIONAL.md    # User guide untuk admin
├── PENGEMBANGAN_PROYEK.md        # Development notes (outdated)
└── DOKUMENTASI_PROYEK.md         # This file
```

---

## 🚀 Cara Menjalankan Proyek

### Prerequisites
- Node.js 18+ dan npm
- Akun Supabase (gratis)
- Git (opsional)

### 1. Setup Database
Ikuti instruksi di `DATABASE_SETUP.md`:
- Buat tabel di Supabase SQL Editor
- Jalankan seed data untuk menu (`scripts/seed-menu.sql`)
- Buat akun admin di Supabase Dashboard → Authentication

### 2. Environment Variables
Buat file `.env.local` di root project:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
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

---

## 🔮 Pengembangan Selanjutnya

### Prioritas Tinggi 🔴

#### 1. Upload dan Manajemen Gambar Menu
**Status**: ❌ Belum diimplementasikan

**Deskripsi**: 
Saat ini menu hanya bisa menggunakan URL gambar eksternal. Perlu implementasi upload gambar langsung ke Supabase Storage.

**Yang Perlu Dilakukan**:
- Setup Supabase Storage bucket untuk gambar menu
- Implementasi upload component dengan drag & drop
- Preview gambar sebelum upload
- Image optimization dan resizing
- Update form menu management untuk upload file
- Display gambar di halaman menu ordering

**Teknologi**:
- Supabase Storage
- `react-dropzone` untuk upload UI
- Next.js Image component untuk optimasi

**Estimasi**: 2-3 hari

#### 2. Real-time Updates untuk Dashboard
**Status**: ❌ Belum diimplementasikan

**Deskripsi**:
Dashboard admin saat ini perlu refresh manual untuk melihat pesanan baru. Dengan Supabase Realtime, dashboard bisa auto-update.

**Yang Perlu Dilakukan**:
- Subscribe ke changes di tabel `orders`
- Auto-refresh dashboard saat ada pesanan baru
- Live update status pesanan
- Notifikasi suara untuk pesanan baru (opsional)

**Teknologi**:
- Supabase Realtime subscriptions
- WebSocket connections

**Estimasi**: 1-2 hari

#### 3. Print Receipt / Nota
**Status**: ❌ Belum diimplementasikan

**Deskripsi**:
Fitur print untuk nota pelanggan dan kitchen order.

**Yang Perlu Dilakukan**:
- Design template nota
- Implementasi print functionality
- Print untuk pelanggan (receipt)
- Print untuk dapur (kitchen order)
- PDF export (opsional)

**Teknologi**:
- `react-to-print` atau `jsPDF`
- CSS untuk print styling

**Estimasi**: 2-3 hari

### Prioritas Sedang 🟡

#### 4. Filter dan Search Pesanan
**Status**: ❌ Belum diimplementasikan

**Fitur**:
- Search pesanan by nomor meja atau nama pelanggan
- Filter by tanggal (range date picker)
- Filter by status
- Filter by range harga
- Sort by waktu/total amount

**Estimasi**: 2 hari

#### 5. Kitchen Display System (KDS)
**Status**: ❌ Belum diimplementasikan

**Deskripsi**:
Layar khusus untuk dapur untuk melihat pesanan yang perlu diproses.

**Fitur**:
- Tampilan pesanan yang perlu diproses
- Status: new, cooking, ready
- Timer untuk tracking cooking time
- Alert untuk pesanan yang lama
- Fullscreen mode untuk display
- Update status dari KDS

**Estimasi**: 3-4 hari

#### 6. Payment Gateway Integration
**Status**: ❌ Belum diimplementasikan

**Deskripsi**:
Integrasi dengan payment provider untuk cashless payment.

**Provider Options**:
- Midtrans
- Xendit
- QRIS
- Dana/OVO/GoPay

**Estimasi**: 5-7 hari (tergantung provider)

#### 7. Advanced Reporting & Analytics
**Status**: ❌ Belum diimplementasikan

**Fitur**:
- Chart/grafik penjualan (menggunakan Recharts - sudah installed)
- Best selling items
- Peak hours analysis
- Weekly/monthly reports
- Export to Excel/CSV
- Revenue trends

**Estimasi**: 4-5 hari

### Prioritas Rendah 🟢

#### 8. Table Management System
**Status**: ❌ Belum diimplementasikan

**Fitur**:
- Tabel `tables` untuk daftar meja
- Status meja (available, occupied, reserved)
- Kapasitas meja (jumlah kursi)
- Visual map meja
- Merging tables untuk group besar

**Estimasi**: 3-4 hari

#### 9. Inventory Management
**Status**: ❌ Belum diimplementasikan

**Fitur**:
- Track bahan baku dan stock
- Tabel `inventory` untuk bahan baku
- Tabel `recipe` untuk hubungan menu dengan bahan
- Auto-deduct stock saat ada pesanan
- Low stock alert
- Purchase order system

**Estimasi**: 5-7 hari

#### 10. Customer Feedback System
**Status**: ❌ Belum diimplementasikan

**Fitur**:
- Rating per menu item
- Overall experience rating
- Comment/feedback form
- Display average rating di menu
- Review management untuk admin

**Estimasi**: 3-4 hari

#### 11. Multi-language Support
**Status**: ❌ Belum diimplementasikan

**Fitur**:
- English
- Bahasa Indonesia (current)
- Language switcher

**Teknologi**: `next-intl` atau `i18next`

**Estimasi**: 2-3 hari

#### 12. Staff Management dengan Role-based Access
**Status**: ❌ Belum diimplementasikan

**Fitur**:
- Multi-user admin dengan role berbeda
- Super Admin (full access)
- Kasir (order & payment only)
- Waiter (order only)
- Chef (kitchen display only)
- Activity logging per user

**Estimasi**: 4-5 hari

---

## 🎯 Rekomendasi Prioritas

### Fase 1: Essential Features (1-2 minggu)
1. ✅ **Upload Gambar Menu** - Meningkatkan visual appeal
2. ✅ **Real-time Updates** - Meningkatkan UX admin
3. ✅ **Print Receipt** - Essential untuk operasional

### Fase 2: Operational Improvements (2-3 minggu)
4. ✅ **Filter & Search Pesanan** - Meningkatkan efisiensi
5. ✅ **Kitchen Display System** - Critical untuk operasional dapur
6. ✅ **Advanced Reporting** - Untuk analisis bisnis

### Fase 3: Business Growth (3-4 minggu)
7. ✅ **Payment Gateway** - Meningkatkan convenience
8. ✅ **Table Management** - Untuk kafe yang lebih besar
9. ✅ **Customer Feedback** - Untuk improvement

### Fase 4: Advanced Features (4+ minggu)
10. ✅ **Inventory Management** - Untuk kontrol stock
11. ✅ **Staff Management** - Untuk multi-user
12. ✅ **Multi-language** - Untuk ekspansi

---

## 📝 Catatan Penting

### Bug Fixes & Improvements yang Disarankan

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
   - Pagination untuk daftar pesanan (jika banyak)
   - Lazy loading untuk images
   - Memoization untuk component optimization

5. **Accessibility**:
   - Keyboard navigation
   - Screen reader support
   - ARIA labels

6. **Security**:
   - Rate limiting untuk prevent spam orders
   - CAPTCHA untuk public forms (opsional)
   - Audit log untuk admin actions

---

## 📞 Kontak & Support

Untuk pertanyaan atau issues terkait proyek ini:
- Cek dokumentasi yang ada (`DATABASE_SETUP.md`, `CARA_AKSES_OPERASIONAL.md`)
- Review code comments di file-file penting
- Hubungi developer untuk support lebih lanjut

---

## 📄 License

[Sesuaikan dengan license proyek Anda]

---

**Last Updated**: Desember 2024  
**Version**: 1.0.0  
**Status**: ✅ Production Ready dengan fitur core lengkap

---

## 🎉 Kesimpulan

Proyek ini sudah memiliki **fitur core yang lengkap dan production-ready**. Sistem pemesanan pelanggan dan dashboard admin sudah berfungsi dengan baik. 

**Yang sudah sangat baik**:
- ✅ User experience yang smooth
- ✅ UI/UX yang modern dan responsive
- ✅ Security dengan RLS policies
- ✅ CRUD menu management yang lengkap
- ✅ Laporan penjualan yang informatif

**Yang bisa dikembangkan**:
- 🔄 Upload gambar untuk meningkatkan visual appeal
- 🔄 Real-time updates untuk better UX
- 🔄 Print receipt untuk operasional
- 🔄 Kitchen Display System untuk efisiensi dapur
- 🔄 Payment gateway untuk cashless payment

Proyek ini siap digunakan untuk operasional kafe dan bisa dikembangkan lebih lanjut sesuai kebutuhan bisnis.

