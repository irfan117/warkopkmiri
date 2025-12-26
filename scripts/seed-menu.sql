-- Seed data untuk tabel menu
-- Jalankan query ini di Supabase SQL Editor untuk menambahkan data menu contoh

INSERT INTO menu (name, description, price, category, available) VALUES
-- Minuman
('Kopi Hitam', 'Kopi hitam original tanpa gula', 15000, 'minuman', true),
('Cappuccino', 'Espresso dengan steamed milk dan foam', 25000, 'minuman', true),
('Caffe Latte', 'Espresso dengan susu panas', 28000, 'minuman', true),
('Americano', 'Espresso dengan air panas', 20000, 'minuman', true),
('Es Teh Manis', 'Teh manis dingin segar', 10000, 'minuman', true),
('Jus Jeruk', 'Jus jeruk segar tanpa gula', 18000, 'minuman', true),
('Chocolate', 'Coklat panas creamy', 22000, 'minuman', true),
('Matcha Latte', 'Teh hijau Jepang dengan susu', 30000, 'minuman', true),

-- Makanan
('Nasi Goreng', 'Nasi goreng spesial dengan telur', 25000, 'makanan', true),
('Mie Goreng', 'Mie goreng pedas dengan sayuran', 23000, 'makanan', true),
('Sandwich Club', 'Sandwich dengan ayam, sayur, dan telur', 28000, 'makanan', true),
('Pasta Carbonara', 'Pasta dengan saus creamy dan beef bacon', 35000, 'makanan', true),
('Nasi Ayam Geprek', 'Nasi dengan ayam crispy geprek pedas', 30000, 'makanan', true),
('Spaghetti Bolognese', 'Spaghetti dengan saus daging cincang', 32000, 'makanan', true),

-- Snack
('French Fries', 'Kentang goreng crispy', 15000, 'snack', true),
('Onion Rings', 'Bawang bombay goreng tepung', 18000, 'snack', true),
('Chicken Wings', 'Sayap ayam goreng crispy (5 pcs)', 25000, 'snack', true),
('Croissant', 'Roti croissant butter segar', 20000, 'snack', true),
('Waffle', 'Waffle dengan madu dan mentega', 22000, 'snack', true),
('Donut', 'Donut lembut dengan topping coklat', 12000, 'snack', true);
