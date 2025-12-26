-- Migration: Revert profiles trigger to original functionality
-- Description: After review, the automatic admin assignment appears to be
--              a core feature of the cafe management system, so we're
--              keeping the original behavior where new users are auto-assigned as admins
-- Created: 2024-12-26

-- Restore the original function that auto-assigns admin status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
begin
  -- Create profile for new auth user and mark as admin (original behavior)
  insert into public.profiles (id, email, is_admin)
  values (new.id, new.email, true)
  on conflict (id) do update set email = excluded.email, is_admin = excluded.is_admin;
  return new;
end;
$$ language plpgsql security definer;

-- Update the comment for clarity
comment on function public.handle_new_user() is
  'Function to create user profile when new auth user is created; auto-assigns admin status';