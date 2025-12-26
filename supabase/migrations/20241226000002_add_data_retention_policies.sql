-- Migration: Add data retention policies for orders
-- Description: Implements auto-delete for order data older than 1 month
--              as mentioned in changelog for version 1.2.0
-- Created: 2024-12-26

-- Create a function to delete old orders (older than 30 days)
CREATE OR REPLACE FUNCTION delete_old_orders()
RETURNS void AS $$
BEGIN
  -- Delete orders older than 30 days
  -- Note: This will cascade delete to order_items due to the foreign key constraint
  DELETE FROM orders 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a comment for the function
COMMENT ON FUNCTION delete_old_orders() IS 
  'Function to automatically delete orders older than 30 days for data retention';

-- Optionally, create a scheduled job to run this function periodically
-- This requires the pg_cron extension which may not be available in all Supabase projects
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- 
-- SELECT cron.schedule(
--   'delete-old-orders', 
--   '0 1 * * *',  -- Run daily at 1 AM
--   $$SELECT delete_old_orders()$$
-- );