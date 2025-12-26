-- Migration: Create storage bucket for homepage images
-- Description: Creates storage bucket and policies for homepage images
-- Created: 2024-12-05

-- Create bucket (if not exists via Supabase Dashboard)
-- Note: Bucket creation must be done via Supabase Dashboard or API
-- This migration only creates the policies

-- Drop existing policies if they exist (ignore errors)
drop policy if exists "Public can view homepage images" on storage.objects;
drop policy if exists "Authenticated users can upload homepage images" on storage.objects;
drop policy if exists "Authenticated users can update homepage images" on storage.objects;
drop policy if exists "Authenticated users can delete homepage images" on storage.objects;

-- Policy untuk public read (semua orang bisa melihat gambar)
create policy "Public can view homepage images"
on storage.objects for select
using (bucket_id = 'homepage-images');

-- Policy untuk authenticated users upload
create policy "Authenticated users can upload homepage images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'homepage-images');

-- Policy untuk authenticated users update
create policy "Authenticated users can update homepage images"
on storage.objects for update
to authenticated
using (bucket_id = 'homepage-images')
with check (bucket_id = 'homepage-images');

-- Policy untuk authenticated users delete
create policy "Authenticated users can delete homepage images"
on storage.objects for delete
to authenticated
using (bucket_id = 'homepage-images');

