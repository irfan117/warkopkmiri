-- Migration: Remove homepage content management tables
-- Description: Removes tables for homepage_images, contact_info, and operating_hours
--              as these features are being removed to focus on core cafe management
--              functionality (menu, orders, order_items)
-- Created: 2024-12-26

-- =============================================
-- DROP TRIGGERS
-- =============================================
DROP TRIGGER IF EXISTS update_homepage_images_updated_at ON public.homepage_images;
DROP TRIGGER IF EXISTS update_contact_info_updated_at ON public.contact_info;
DROP TRIGGER IF EXISTS update_operating_hours_updated_at ON public.operating_hours;

-- =============================================
-- DROP POLICIES
-- =============================================
DROP POLICY IF EXISTS "Authenticated users can view homepage images" ON public.homepage_images;
DROP POLICY IF EXISTS "Anyone can view active homepage images" ON public.homepage_images;
DROP POLICY IF EXISTS "Authenticated users can insert homepage images" ON public.homepage_images;
DROP POLICY IF EXISTS "Authenticated users can update homepage images" ON public.homepage_images;
DROP POLICY IF EXISTS "Authenticated users can delete homepage images" ON public.homepage_images;

DROP POLICY IF EXISTS "Authenticated users can view contact info" ON public.contact_info;
DROP POLICY IF EXISTS "Anyone can view active contact info" ON public.contact_info;
DROP POLICY IF EXISTS "Authenticated users can insert contact info" ON public.contact_info;
DROP POLICY IF EXISTS "Authenticated users can update contact info" ON public.contact_info;
DROP POLICY IF EXISTS "Authenticated users can delete contact info" ON public.contact_info;

DROP POLICY IF EXISTS "Authenticated users can view operating hours" ON public.operating_hours;
DROP POLICY IF EXISTS "Anyone can view operating hours" ON public.operating_hours;
DROP POLICY IF EXISTS "Authenticated users can insert operating hours" ON public.operating_hours;
DROP POLICY IF EXISTS "Authenticated users can update operating hours" ON public.operating_hours;
DROP POLICY IF EXISTS "Authenticated users can delete operating hours" ON public.operating_hours;

-- =============================================
-- DROP INDEXES
-- =============================================
DROP INDEX IF EXISTS idx_homepage_images_section;
DROP INDEX IF EXISTS idx_homepage_images_active;
DROP INDEX IF EXISTS idx_contact_info_type;
DROP INDEX IF EXISTS idx_contact_info_active;
DROP INDEX IF EXISTS idx_operating_hours_day;

-- =============================================
-- DROP TABLES
-- =============================================
DROP TABLE IF EXISTS public.homepage_images;
DROP TABLE IF EXISTS public.contact_info;
DROP TABLE IF EXISTS public.operating_hours;

-- =============================================
-- DROP STORAGE POLICIES
-- =============================================
-- Drop storage policies for homepage-images bucket
DROP POLICY IF EXISTS "Public can view homepage images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload homepage images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update homepage images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete homepage images" ON storage.objects;

-- Note: The storage bucket itself needs to be deleted separately via Supabase Dashboard if no longer needed