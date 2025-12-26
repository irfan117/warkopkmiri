-- Migration: Add order_type and delivery_address to orders table
-- Description: Enables tracking of dine-in vs delivery orders

-- Add order_type column (default 'dine_in' for existing orders)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type text DEFAULT 'dine_in' CHECK (order_type IN ('dine_in', 'delivery'));

-- Add delivery_address column for delivery orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address text;

-- Create index for filtering by order_type
CREATE INDEX IF NOT EXISTS idx_orders_order_type ON orders(order_type);

COMMENT ON COLUMN orders.order_type IS 'Tipe pesanan: dine_in (di tempat) atau delivery (dari rumah)';
COMMENT ON COLUMN orders.delivery_address IS 'Alamat pengiriman untuk pesanan delivery';
