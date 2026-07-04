-- =====================================================================
-- Admin Panel Setup (Traffic Analytics + Subscribers)
-- ---------------------------------------------------------------------
-- Safe to run multiple times. Paste this whole file into the Supabase
-- SQL Editor (Dashboard -> SQL Editor -> New query -> Run).
-- This creates the two tables the admin panel needs and locks them down
-- so only trusted server code (service role) can read/write them.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Newsletter / email subscribers
-- ---------------------------------------------------------------------
create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  language text,
  kit_subscriber_id text,
  created_at timestamptz not null default now()
);

create index if not exists email_subscribers_created_at_idx
  on public.email_subscribers (created_at desc);

-- ---------------------------------------------------------------------
-- Page views / traffic analytics
-- ---------------------------------------------------------------------
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  session_id text,
  country text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx on public.page_views (path);
create index if not exists page_views_session_idx on public.page_views (session_id);

-- ---------------------------------------------------------------------
-- Row Level Security: service role only (server code uses service key)
-- ---------------------------------------------------------------------
alter table public.email_subscribers enable row level security;
alter table public.page_views enable row level security;

drop policy if exists "Service role can manage subscribers" on public.email_subscribers;
create policy "Service role can manage subscribers"
  on public.email_subscribers for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Service role can manage page views" on public.page_views;
create policy "Service role can manage page views"
  on public.page_views for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Done. You should see both tables under Table Editor after running.
