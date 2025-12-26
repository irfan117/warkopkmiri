-- Migration: Homepage content management (images, contact, operating hours)
-- Description: Creates tables for managing homepage images, contact info, and operating hours
-- Created: 2024-12-05

-- =============================================
-- TABLE: homepage_images
-- =============================================
create table if not exists public.homepage_images (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('hero', 'about', 'facilities', 'testimonial')),
  image_url text not null,
  alt_text text default '',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.homepage_images is 'Images displayed on homepage sections';
comment on column public.homepage_images.section is 'Section where image is displayed: hero, about, facilities, testimonial';
comment on column public.homepage_images.display_order is 'Order for displaying multiple images in same section';

-- Enable RLS
alter table public.homepage_images enable row level security;

-- Policies: authenticated users can manage all images
create policy "Authenticated users can view homepage images"
  on public.homepage_images
  for select
  to authenticated
  using (true);

create policy "Anyone can view active homepage images"
  on public.homepage_images
  for select
  using (is_active = true);

create policy "Authenticated users can insert homepage images"
  on public.homepage_images
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update homepage images"
  on public.homepage_images
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete homepage images"
  on public.homepage_images
  for delete
  to authenticated
  using (true);

-- =============================================
-- TABLE: contact_info
-- =============================================
create table if not exists public.contact_info (
  id uuid primary key default gen_random_uuid(),
  type text not null unique check (type in ('address', 'phone', 'email', 'map_url')),
  value text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.contact_info is 'Contact information displayed on homepage';
comment on column public.contact_info.type is 'Type of contact: address, phone, email, map_url';

-- Enable RLS
alter table public.contact_info enable row level security;

-- Policies: authenticated users can manage, anyone can view active
create policy "Authenticated users can view contact info"
  on public.contact_info
  for select
  to authenticated
  using (true);

create policy "Anyone can view active contact info"
  on public.contact_info
  for select
  using (is_active = true);

create policy "Authenticated users can insert contact info"
  on public.contact_info
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update contact info"
  on public.contact_info
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete contact info"
  on public.contact_info
  for delete
  to authenticated
  using (true);

-- =============================================
-- TABLE: operating_hours
-- =============================================
create table if not exists public.operating_hours (
  id uuid primary key default gen_random_uuid(),
  day_name text not null unique check (day_name in ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  day_label text not null,
  open_time time not null,
  close_time time not null,
  is_closed boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.operating_hours is 'Operating hours for each day of the week';
comment on column public.operating_hours.day_name is 'Day name in English: monday, tuesday, etc.';
comment on column public.operating_hours.day_label is 'Display label: Senin - Kamis, etc.';

-- Enable RLS
alter table public.operating_hours enable row level security;

-- Policies: authenticated users can manage, anyone can view
create policy "Authenticated users can view operating hours"
  on public.operating_hours
  for select
  to authenticated
  using (true);

create policy "Anyone can view operating hours"
  on public.operating_hours
  for select
  using (true);

create policy "Authenticated users can insert operating hours"
  on public.operating_hours
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update operating hours"
  on public.operating_hours
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete operating hours"
  on public.operating_hours
  for delete
  to authenticated
  using (true);

-- =============================================
-- TRIGGERS: Auto-update updated_at
-- =============================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_homepage_images_updated_at
  before update on public.homepage_images
  for each row
  execute function update_updated_at_column();

create trigger update_contact_info_updated_at
  before update on public.contact_info
  for each row
  execute function update_updated_at_column();

create trigger update_operating_hours_updated_at
  before update on public.operating_hours
  for each row
  execute function update_updated_at_column();

-- =============================================
-- INDEXES
-- =============================================
create index if not exists idx_homepage_images_section on public.homepage_images(section, display_order);
create index if not exists idx_homepage_images_active on public.homepage_images(is_active) where is_active = true;
create index if not exists idx_contact_info_type on public.contact_info(type, display_order);
create index if not exists idx_contact_info_active on public.contact_info(is_active) where is_active = true;
create index if not exists idx_operating_hours_day on public.operating_hours(day_name, display_order);

