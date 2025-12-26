-- Migration: Initial schema for Cafe Management System
-- Description: Creates tables, indexes, RLS policies, functions, and triggers
-- Created: 2024-01-01

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Tabel menu
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

COMMENT ON TABLE menu IS 'Tabel untuk menyimpan data menu makanan dan minuman cafe';
COMMENT ON COLUMN menu.id IS 'ID unik menu (UUID)';
COMMENT ON COLUMN menu.name IS 'Nama menu';
COMMENT ON COLUMN menu.description IS 'Deskripsi menu';
COMMENT ON COLUMN menu.price IS 'Harga menu dalam Rupiah';
COMMENT ON COLUMN menu.category IS 'Kategori menu: minuman, makanan, atau snack';
COMMENT ON COLUMN menu.image_url IS 'URL gambar menu';
COMMENT ON COLUMN menu.available IS 'Status ketersediaan menu (true = tersedia, false = tidak tersedia)';

-- Tabel orders
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

COMMENT ON TABLE orders IS 'Tabel untuk menyimpan data pesanan pelanggan';
COMMENT ON COLUMN orders.id IS 'ID unik pesanan (UUID)';
COMMENT ON COLUMN orders.table_number IS 'Nomor meja pelanggan';
COMMENT ON COLUMN orders.customer_name IS 'Nama pelanggan (opsional)';
COMMENT ON COLUMN orders.status IS 'Status pesanan: menunggu_pembayaran, dibayar, atau selesai';
COMMENT ON COLUMN orders.total_amount IS 'Total harga pesanan dalam Rupiah';
COMMENT ON COLUMN orders.created_at IS 'Waktu pesanan dibuat';
COMMENT ON COLUMN orders.updated_at IS 'Waktu pesanan terakhir diupdate';

-- Tabel order_items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_id uuid NOT NULL REFERENCES menu(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE order_items IS 'Tabel untuk menyimpan detail item dalam setiap pesanan';
COMMENT ON COLUMN order_items.id IS 'ID unik item pesanan (UUID)';
COMMENT ON COLUMN order_items.order_id IS 'Referensi ke tabel orders';
COMMENT ON COLUMN order_items.menu_id IS 'Referensi ke tabel menu';
COMMENT ON COLUMN order_items.quantity IS 'Jumlah item yang dipesan';
COMMENT ON COLUMN order_items.price IS 'Harga per item saat pemesanan';
COMMENT ON COLUMN order_items.subtotal IS 'Total harga item (quantity × price)';

-- =====================================================
-- CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_id ON order_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu(category);
CREATE INDEX IF NOT EXISTS idx_menu_available ON menu(available) WHERE available = true;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES FOR MENU
-- =====================================================

CREATE POLICY "Anyone can view available menu items"
  ON menu FOR SELECT
  USING (available = true);

CREATE POLICY "Authenticated users can view all menu items"
  ON menu FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert menu items"
  ON menu FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update menu items"
  ON menu FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete menu items"
  ON menu FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- RLS POLICIES FOR ORDERS
-- =====================================================

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- RLS POLICIES FOR ORDER_ITEMS
-- =====================================================

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- FUNCTION AND TRIGGER FOR AUTO-UPDATE updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 
  'Function untuk otomatis mengupdate kolom updated_at saat ada perubahan data';

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
