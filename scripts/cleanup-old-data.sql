-- Script untuk cleanup data lama (opsional, bisa dijalankan manual)
-- Hapus pesanan selesai yang lebih dari 30 hari

-- Hapus order_items yang terkait dengan orders yang sudah dihapus
DELETE FROM order_items
WHERE order_id IN (
  SELECT id FROM orders
  WHERE status = 'selesai'
  AND created_at < NOW() - INTERVAL '30 days'
);

-- Hapus orders yang sudah selesai lebih dari 30 hari
DELETE FROM orders
WHERE status = 'selesai'
AND created_at < NOW() - INTERVAL '30 days';

-- Catatan: Script ini sudah otomatis dijalankan di sales page
-- Tapi bisa juga dijalankan manual via Supabase SQL Editor jika diperlukan

