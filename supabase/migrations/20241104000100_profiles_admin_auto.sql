-- Migration: Profiles table and auto-admin trigger
-- Description: Creates public.profiles, RLS policies, and auth.users trigger to automatically
--              create a profile for each new user with is_admin = true (as per project needs).
-- Created: 2025-11-04

-- =============================================
-- TABLE: profiles
-- =============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Profiles linked to auth.users; holds admin flag';

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies: allow user to read/insert their own row
create policy "Read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- =============================================
-- FUNCTION + TRIGGER: auto-create profile with admin flag
-- =============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create profile for new auth user and mark as admin
  insert into public.profiles (id, email, is_admin)
  values (new.id, new.email, true)
  on conflict (id) do update set email = excluded.email, is_admin = excluded.is_admin;
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if present, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
