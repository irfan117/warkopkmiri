-- Migration: Add missing update and delete policies for profiles table
-- Description: Adds update and delete policies to allow users to modify their own profiles,
--              which is needed for the auto-create trigger's on conflict update.
-- Created: 2025-11-04

-- Add update policy for profiles
create policy "Update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Add delete policy for profiles (optional but consistent)
create policy "Delete own profile"
  on public.profiles
  for delete
  using (auth.uid() = id);