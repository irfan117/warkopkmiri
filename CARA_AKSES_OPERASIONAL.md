# Panduan Akses Bagian Operasional Cafe

Dokumentasi ini menjelaskan cara mengakses dan menggunakan bagian operasional cafe untuk admin/kasir/pelayan.

## 📋 Daftar Isi

1. [Akses Login Admin](#akses-login-admin)
2. [Navigasi Dashboard](#navigasi-dashboard)
3. [Fitur-fitur Operasional](#fitur-fitur-operasional)
4. [Cara Menggunakan Setiap Fitur](#cara-menggunakan-setiap-fitur)
5. [Tips dan Trik](#tips-dan-trik)

---

## 🔐 Akses Login Admin

### Langkah-langkah Login:

1. **Buka Halaman Login**
   - Buka browser dan akses aplikasi cafe
   - Dari halaman beranda, klik tombol **"Login Admin"** di pojok kanan atas
   - Atau langsung akses URL: `http://localhost:3000/admin/lgion`

2. **Masukkan Kredensial**
   - **Email**: Masukkan email admin yang terdaftar
   - **Password**: Masukkan password admin
   - Klik tombol **"Login"**

3. **Berhasil Login**
   - Setelah login berhasil, Anda akan otomatis diarahkan ke **Dashboard Admin**
   - Jika kredensial salah, akan muncul pesan error

> **Catatan**: Jika belum punya akun admin, buat akun terlebih dahulu melalui Supabase Dashboard atau hubungi developer.

---

## 🧭 Navigasi Dashboard

Setelah login, Anda akan melihat **Sidebar Navigasi** di sebelah kiri layar yang berisi:

### Menu Navigasi:

1. **📊 Dashboard**
   - Menampilkan ringkasan pesanan
   - Status pembayaran (Menunggu, Dibayar, Selesai)
   - Daftar semua pesanan dengan filter

2. **🍽️ Manajemen Menu**
   - Kelola menu makanan dan minuman
   - Tambah, edit, hapus menu
   - Aktifkan/nonaktifkan ketersediaan menu

3. **📈 Laporan Penjualan**
   - Statistik penjualan hari ini
   - Ringkasan revenue berdasarkan status
   - Daftar pesanan terbaru

### Fitur Sidebar:

- **Responsif**: Di mobile, sidebar bisa dibuka/tutup dengan tombol menu (☰)
- **Indikator Aktif**: Menu yang sedang aktif akan ditandai dengan background biru
- **Tombol Logout**: Di bagian bawah sidebar untuk keluar dari sistem

---

## 🎯 Fitur-fitur Operasional

### 1. Dashboard - Kelola Pesanan

**Fungsi**: Monitor dan kelola semua pesanan yang masuk

**Fitur yang tersedia**:
- **Summary Cards**: Menampilkan jumlah pesanan per status
  - Menunggu Pembayaran (merah)
  - Dibayar (biru)
  - Selesai (hijau)

- **Tab Filter**: Filter pesanan berdasarkan status
  - Menunggu Pembayaran
  - Dibayar
  - Selesai

- **Detail Pesanan**: Setiap pesanan menampilkan:
  - Nomor meja
  - Nama pelanggan (jika ada)
  - Daftar item pesanan dengan quantity
  - Total harga
  - Waktu pemesanan

- **Aksi Pesanan**:
  - **"Tandai Dibayar"**: Untuk pesanan yang sudah dibayar
  - **"Tandai Selesai"**: Untuk pesanan yang sudah selesai dan diantar

**Cara Menggunakan**:
1. Buka halaman Dashboard
2. Lihat summary cards untuk overview cepat
3. Pilih tab sesuai status yang ingin dilihat
4. Untuk update status:
   - Pesanan **Menunggu Pembayaran** → Klik "Tandai Dibayar" setelah pelanggan membayar
   - Pesanan **Dibayar** → Klik "Tandai Selesai" setelah makanan diantar ke meja

---

### 2. Manajemen Menu

**Fungsi**: Kelola daftar menu cafe (tambah, edit, hapus, aktifkan/nonaktifkan)

**Fitur yang tersedia**:
- **Daftar Menu**: Tabel yang menampilkan semua menu
  - Nama menu dan deskripsi
  - Kategori (Minuman, Makanan, Snack)
  - Harga
  - Status ketersediaan

- **Tambah Menu Baru**:
  - Klik tombol **"Tambah Menu"** di pojok kanan atas
  - Isi form:
    - Nama Menu (wajib)
    - Deskripsi (opsional)
    - Harga (wajib)
    - Kategori (wajib): Minuman, Makanan, atau Snack
    - URL Gambar (opsional): Link ke gambar menu
    - Status Ketersediaan: Aktifkan/nonaktifkan toggle
  - Klik **"Tambah Menu"** untuk menyimpan

- **Edit Menu**:
  - Klik ikon **Edit (✏️)** pada baris menu yang ingin diedit
  - Form akan terisi dengan data menu yang ada
  - Ubah data yang diperlukan
  - Klik **"Update Menu"** untuk menyimpan perubahan

- **Hapus Menu**:
  - Klik ikon **Hapus (🗑️)** pada baris menu
  - Konfirmasi penghapusan di popup
  - Menu akan dihapus secara permanen

- **Aktifkan/Nonaktifkan Menu**:
  - Klik ikon **Mata (👁️)** untuk toggle status
  - Menu yang **tidak tersedia** tidak akan muncul di halaman pemesanan pelanggan
  - Berguna untuk menandai menu yang sedang habis/tidak tersedia

**Cara Menggunakan**:
1. Buka halaman **Manajemen Menu** dari sidebar
2. Lihat daftar menu yang ada
3. Untuk menambah menu baru:
   - Klik "Tambah Menu"
   - Isi form dengan lengkap
   - Pastikan harga valid (angka positif)
   - Simpan menu
4. Untuk mengedit:
   - Klik ikon edit pada menu yang ingin diubah
   - Ubah data
   - Simpan perubahan
5. Untuk nonaktifkan menu sementara (misalnya habis):
   - Klik ikon mata untuk toggle status
   - Menu akan otomatis tidak muncul di halaman pesan pelanggan

---

### 3. Laporan Penjualan

**Fungsi**: Lihat ringkasan penjualan dan statistik hari ini

**Fitur yang tersedia**:
- **Summary Cards**: 4 kartu statistik
  - **Total Pesanan**: Jumlah semua pesanan hari ini + total revenue
  - **Menunggu Pembayaran**: Pesanan pending + revenue pending
  - **Dibayar**: Pesanan yang sudah dibayar + revenue
  - **Selesai**: Pesanan selesai + revenue

- **Daftar Pesanan Terbaru**: 10 pesanan terakhir hari ini
  - Menampilkan nomor meja
  - Nama pelanggan (jika ada)
  - Total harga
  - Status pesanan
  - Waktu pemesanan

**Cara Menggunakan**:
1. Buka halaman **Laporan Penjualan** dari sidebar
2. Lihat summary cards untuk overview penjualan hari ini
3. Scroll ke bawah untuk melihat daftar pesanan terbaru
4. Data di-refresh setiap kali halaman dibuka

> **Catatan**: Data laporan hanya menampilkan pesanan dari hari ini (mulai jam 00:00)

---

## 💡 Tips dan Trik

### 1. Workflow Operasional Harian

**Pagi Hari (Opening)**:
- Buka Dashboard untuk cek pesanan dari hari sebelumnya yang belum selesai
- Pastikan semua menu tersedia (cek di Manajemen Menu)

**Saat Operasional**:
- Buka Dashboard secara berkala untuk monitor pesanan baru
- Update status pesanan secara real-time:
  - Pelanggan pesan → Status: "Menunggu Pembayaran"
  - Pelanggan bayar → Klik "Tandai Dibayar"
  - Makanan diantar → Klik "Tandai Selesai"

**Sore/Malam (Closing)**:
- Lihat Laporan Penjualan untuk review hari ini
- Pastikan semua pesanan sudah ditangani

### 2. Manajemen Menu

- **Nonaktifkan menu yang habis** dengan cepat menggunakan toggle di tabel
- **Gunakan URL gambar** untuk membuat menu lebih menarik di halaman pesan pelanggan
- **Kategori yang benar** membantu pelanggan menemukan menu lebih mudah

### 3. Troubleshooting

**Tidak bisa login?**
- Pastikan email dan password benar
- Pastikan koneksi internet stabil
- Hubungi admin sistem jika masalah berlanjut

**Menu tidak muncul di halaman pesan?**
- Cek status menu di Manajemen Menu (harus "Tersedia")
- Pastikan menu sudah disimpan dengan benar

**Pesanan tidak ter-update?**
- Refresh halaman Dashboard
- Pastikan koneksi internet stabil

---

## 🔒 Keamanan

- **Jangan share kredensial login** kepada orang yang tidak berwenang
- **Logout setelah selesai** menggunakan tombol logout di sidebar
- **Jangan tinggalkan komputer** dalam keadaan login
- Password sebaiknya diganti secara berkala

---

## 📞 Bantuan

Jika mengalami masalah atau ada pertanyaan:
1. Cek dokumentasi ini terlebih dahulu
2. Hubungi developer/admin sistem
3. Cek log error di browser console (F12)

---

**Selamat menggunakan sistem operasional cafe! 🎉**
