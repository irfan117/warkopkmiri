# Setup Database

Proyek ini menggunakan Supabase sebagai database. Ikuti langkah-langkah berikut untuk setup database:
projekcafe123
emailremiseh
## 1. Buat Tabel Database

Masuk ke Supabase Dashboard → SQL Editor, lalu jalankan query berikut:

```sql
-- Buat tabel menu
CREATE TABLE IF NOT EXISTS menu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  image_url text DEFAULT '',
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Buat tabel orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number integer NOT NULL CHECK (table_number > 0),
  customer_name text DEFAULT '',
  status text NOT NULL DEFAULT 'menunggu_pembayaran' CHECK (status IN ('menunggu_pembayaran', 'dibayar', 'selesai')),
  total_amount numeric NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Buat tabel order_items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_id uuid NOT NULL REFERENCES menu(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  created_at timestamptz DEFAULT now()
);

-- Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable RLS
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies untuk menu
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

-- RLS Policies untuk orders
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

-- RLS Policies untuk order_items
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

-- Function dan trigger untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 2. Seed Data Menu

Jalankan query dari file `scripts/seed-menu.sql` di SQL Editor untuk menambahkan menu contoh.

## 3. Buat Akun Admin

Di Supabase Dashboard → Authentication → Users, klik "Invite user" atau "Add user" dan buat akun dengan:
- Email: admin@kafe.com (atau email pilihan Anda)
- Password: (pilih password yang kuat)

Atau gunakan SQL berikut untuk membuat user:

```sql
-- Buat user admin (ganti dengan email dan password Anda)
-- Pastikan Anda sudah menginstall extension pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

Lebih mudah membuat user melalui Supabase Dashboard UI.

## 4. Setup Supabase Storage (Opsional - untuk upload gambar menu)

Jika Anda ingin menggunakan fitur upload gambar menu, ikuti instruksi di `SUPABASE_STORAGE_SETUP.md`.

**Catatan**: Fitur upload gambar memerlukan setup Supabase Storage bucket. Jika tidak di-setup, Anda masih bisa menggunakan URL gambar eksternal.

## 5. Enable Realtime (Opsional - untuk real-time updates)

Untuk fitur real-time updates di dashboard, pastikan Realtime sudah di-enable di Supabase:

1. Masuk ke Supabase Dashboard
2. Buka **Database** → **Replication**
3. Enable replication untuk tabel:
   - `orders`
   - `order_items`

Atau jalankan query berikut di SQL Editor:

```sql
-- Enable Realtime untuk tabel orders
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Enable Realtime untuk tabel order_items
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
```

## 6. Verifikasi Setup

1. Cek apakah ketiga tabel sudah terbuat
2. Cek apakah RLS policies sudah aktif
3. Cek apakah data menu sudah terisi
4. Test login admin dengan kredensial yang dibuat
5. (Opsional) Test upload gambar menu jika storage sudah di-setup
6. (Opsional) Test real-time updates jika realtime sudah di-enable
