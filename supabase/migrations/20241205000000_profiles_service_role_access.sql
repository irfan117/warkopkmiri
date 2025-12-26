-- Migration: Allow service role to manage profiles for auth trigger
-- Description: Adds permissive policies for the service role so the
--              handle_new_user trigger can upsert profiles without being
--              blocked by RLS. Keeps user-scoped access for normal sessions.
-- Created: 2025-12-05

-- Allow Supabase service role to fully manage profiles (needed for auth trigger)
create policy "Service role manage profiles"
  on public.profiles
  for all
  to service_role
  using (true)
  with check (true);

-- Reassert user-scoped policies (no-op if already correct, ensures both branches)
alter policy "Insert own profile"
  on public.profiles
  with check (auth.uid() = id);

alter policy "Update own profile"
  on public.profiles
  using (auth.uid() = id)
  with check (auth.uid() = id);


