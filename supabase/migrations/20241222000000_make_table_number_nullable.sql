-- Migration: Make table_number nullable in orders table
-- Description: Allows orders without specifying a table number for simplified ordering
-- Created: 2024-12-22

-- Alter table to make table_number nullable
ALTER TABLE orders ALTER COLUMN table_number DROP NOT NULL;

-- Update comment
COMMENT ON COLUMN orders.table_number IS 'Nomor meja pelanggan (opsional)';