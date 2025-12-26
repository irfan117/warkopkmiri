-- =====================================================
-- MIGRATION SQL UNTUK CAFE MANAGEMENT SYSTEM
-- =====================================================
-- File ini berisi semua schema database yang diperlukan
-- untuk sistem manajemen cafe.
--
-- Cara penggunaan:
-- 1. Copy semua isi file ini
-- 2. Paste di Supabase Dashboard → SQL Editor
-- 3. Klik "Run" untuk menjalankan migration
-- 
-- Atau gunakan Supabase CLI:
-- supabase db push
-- =====================================================

-- =====================================================
-- 1. HAPUS OBJEK YANG SUDAH ADA (OPTIONAL - HATI-HATI!)
-- =====================================================
-- Uncomment baris di bawah jika ingin reset database
-- WARNING: Ini akan menghapus semua data yang ada!

-- DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- DROP POLICY IF EXISTS "Anyone can view available menu items" ON menu;
-- DROP POLICY IF EXISTS "Authenticated users can view all menu items" ON menu;
-- DROP POLICY IF EXISTS "Authenticated users can insert menu items" ON menu;
-- DROP POLICY IF EXISTS "Authenticated users can update menu items" ON menu;
-- DROP POLICY IF EXISTS "Authenticated users can delete menu items" ON menu;
-- DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
-- DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
-- DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
-- DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
-- DROP POLICY IF EXISTS "Authenticated users can view all order items" ON order_items;
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS menu CASCADE;

-- =====================================================
-- 2. BUAT TABEL MENU
-- =====================================================
CREATE TABLE IF NOT EXISTS menu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL CHECK (category IN ('minuman', 'makanan', 'snack')),
  image_url text DEFAULT '',
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Komentar untuk dokumentasi
COMMENT ON TABLE menu IS 'Tabel untuk menyimpan data menu makanan dan minuman cafe';
COMMENT ON COLUMN menu.id IS 'ID unik menu (UUID)';
COMMENT ON COLUMN menu.name IS 'Nama menu';
COMMENT ON COLUMN menu.description IS 'Deskripsi menu';
COMMENT ON COLUMN menu.price IS 'Harga menu dalam Rupiah';
COMMENT ON COLUMN menu.category IS 'Kategori menu: minuman, makanan, atau snack';
COMMENT ON COLUMN menu.image_url IS 'URL gambar menu';
COMMENT ON COLUMN menu.available IS 'Status ketersediaan menu (true = tersedia, false = tidak tersedia)';

-- =====================================================
-- 3. BUAT TABEL ORDERS
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number integer NOT NULL CHECK (table_number > 0),
  customer_name text DEFAULT '',
  status text NOT NULL DEFAULT 'menunggu_pembayaran' 
    CHECK (status IN ('menunggu_pembayaran', 'dibayar', 'selesai')),
  total_amount numeric NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Komentar untuk dokumentasi
COMMENT ON TABLE orders IS 'Tabel untuk menyimpan data pesanan pelanggan';
COMMENT ON COLUMN orders.id IS 'ID unik pesanan (UUID)';
COMMENT ON COLUMN orders.table_number IS 'Nomor meja pelanggan';
COMMENT ON COLUMN orders.customer_name IS 'Nama pelanggan (opsional)';
COMMENT ON COLUMN orders.status IS 'Status pesanan: menunggu_pembayaran, dibayar, atau selesai';
COMMENT ON COLUMN orders.total_amount IS 'Total harga pesanan dalam Rupiah';
COMMENT ON COLUMN orders.created_at IS 'Waktu pesanan dibuat';
COMMENT ON COLUMN orders.updated_at IS 'Waktu pesanan terakhir diupdate';

-- =====================================================
-- 4. BUAT TABEL ORDER_ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_id uuid NOT NULL REFERENCES menu(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  created_at timestamptz DEFAULT now()
);

-- Komentar untuk dokumentasi
COMMENT ON TABLE order_items IS 'Tabel untuk menyimpan detail item dalam setiap pesanan';
COMMENT ON COLUMN order_items.id IS 'ID unik item pesanan (UUID)';
COMMENT ON COLUMN order_items.order_id IS 'Referensi ke tabel orders';
COMMENT ON COLUMN order_items.menu_id IS 'Referensi ke tabel menu';
COMMENT ON COLUMN order_items.quantity IS 'Jumlah item yang dipesan';
COMMENT ON COLUMN order_items.price IS 'Harga per item saat pemesanan';
COMMENT ON COLUMN order_items.subtotal IS 'Total harga item (quantity × price)';

-- =====================================================
-- 5. BUAT INDEX UNTUK PERFORMANSI
-- =====================================================
-- Index untuk mempercepat query berdasarkan status pesanan
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Index untuk mempercepat query berdasarkan waktu pesanan
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Index untuk mempercepat query order items berdasarkan order_id
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Index untuk mempercepat query order items berdasarkan menu_id
CREATE INDEX IF NOT EXISTS idx_order_items_menu_id ON order_items(menu_id);

-- Index untuk mempercepat query menu berdasarkan kategori
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu(category);

-- Index untuk mempercepat query menu berdasarkan ketersediaan
CREATE INDEX IF NOT EXISTS idx_menu_available ON menu(available) WHERE available = true;

-- =====================================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. RLS POLICIES UNTUK TABEL MENU
-- =====================================================

-- Policy: Public dapat melihat menu yang tersedia
CREATE POLICY "Anyone can view available menu items"
  ON menu FOR SELECT
  USING (available = true);

-- Policy: User yang sudah login dapat melihat semua menu
CREATE POLICY "Authenticated users can view all menu items"
  ON menu FOR SELECT
  TO authenticated
  USING (true);

-- Policy: User yang sudah login dapat menambah menu
CREATE POLICY "Authenticated users can insert menu items"
  ON menu FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: User yang sudah login dapat mengupdate menu
CREATE POLICY "Authenticated users can update menu items"
  ON menu FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: User yang sudah login dapat menghapus menu
CREATE POLICY "Authenticated users can delete menu items"
  ON menu FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- 8. RLS POLICIES UNTUK TABEL ORDERS
-- =====================================================

-- Policy: Public dapat membuat pesanan baru
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Policy: User yang sudah login dapat melihat semua pesanan
CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

-- Policy: User yang sudah login dapat mengupdate pesanan
CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 9. RLS POLICIES UNTUK TABEL ORDER_ITEMS
-- =====================================================

-- Policy: Public dapat membuat item pesanan
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Policy: User yang sudah login dapat melihat semua item pesanan
CREATE POLICY "Authenticated users can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- 10. FUNCTION UNTUK AUTO-UPDATE updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Komentar untuk dokumentasi
COMMENT ON FUNCTION update_updated_at_column() IS 
  'Function untuk otomatis mengupdate kolom updated_at saat ada perubahan data';

-- =====================================================
-- 11. TRIGGER UNTUK AUTO-UPDATE updated_at
-- =====================================================
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 12. VERIFIKASI MIGRATION
-- =====================================================
-- Query di bawah ini untuk verifikasi bahwa semua objek sudah dibuat dengan benar
-- Uncomment untuk menjalankan verifikasi

-- SELECT 
--   'menu' as table_name, 
--   COUNT(*) as row_count 
-- FROM menu
-- UNION ALL
-- SELECT 
--   'orders' as table_name, 
--   COUNT(*) as row_count 
-- FROM orders
-- UNION ALL
-- SELECT 
--   'order_items' as table_name, 
--   COUNT(*) as row_count 
-- FROM order_items;

-- SELECT 
--   tablename, 
--   indexname 
-- FROM pg_indexes 
-- WHERE schemaname = 'public' 
--   AND tablename IN ('menu', 'orders', 'order_items')
-- ORDER BY tablename, indexname;

-- SELECT 
--   schemaname, 
--   tablename, 
--   policyname 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
--   AND tablename IN ('menu', 'orders', 'order_items')
-- ORDER BY tablename, policyname;

-- =====================================================
-- MIGRATION SELESAI
-- =====================================================
-- Setelah migration ini berhasil, jalankan file seed-menu.sql
-- untuk menambahkan data menu contoh ke database.
