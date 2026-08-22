-- =====================================================================
-- LEGACY / OBSOLETE SCHEMA REFERENCE — DO NOT APPLY, DO NOT TRUST
-- =====================================================================
-- This file describes an EARLY, FLAT course model that DOES NOT match
-- the current production database (Supabase project: production).
--
-- Why it is retained:
--   * Historical reference only.
--   * The current production schema is fully normalized and bilingual.
--
-- Authoritative sources of truth going forward:
--   * lib/supabase/database.types.ts          (generated from live schema)
--   * supabase/reference/live-schema-snapshot.sql  (schema-only snapshot)
--   * docs/checkpoint-1/schema-drift-report.md (drift analysis)
--
-- Key drift (see drift report for full detail):
--   * public.courses here has title/description/content/video_url/is_published;
--     PRODUCTION public.courses is slug/category/course_type/status/... with
--     all human-readable text in public.course_translations.
--   * This file knows nothing about sections, lessons, lesson_blocks,
--     questions, answer_choices, practice_tests, media_assets, or any of
--     the *_translations tables that hold the real 9-course catalog.
--   * The RLS policies below grant broad authenticated INSERT/UPDATE and
--     are NOT how production should be secured.
--
-- DO NOT run this against production. Retained for audit trail only.
-- =====================================================================

create extension if not exists "pgcrypto";

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  content text,
  video_url text,
  resource_url text,
  sort_order integer default 0,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, course_id)
);

create table if not exists public.ebook_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  ebook_slug text not null,
  language text,
  stripe_session_id text unique,
  amount numeric,
  currency text default 'usd',
  payer_email text,
  status text not null default 'completed',
  download_token text,
  granted_by text,
  created_at timestamptz not null default now()
);

create index if not exists ebook_purchases_created_at_idx on public.ebook_purchases (created_at desc);
create index if not exists ebook_purchases_download_token_idx on public.ebook_purchases (download_token);
create index if not exists ebook_purchases_status_idx on public.ebook_purchases (status);

create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  language text,
  kit_subscriber_id text,
  created_at timestamptz not null default now()
);

create index if not exists email_subscribers_created_at_idx on public.email_subscribers (created_at desc);

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

alter table public.subscriptions enable row level security;
alter table public.courses enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.page_views enable row level security;
alter table public.email_subscribers enable row level security;
alter table public.ebook_purchases enable row level security;

drop policy if exists "Service role can manage ebook purchases" on public.ebook_purchases;
create policy "Service role can manage ebook purchases"
on public.ebook_purchases for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Users can read own ebook purchases" on public.ebook_purchases;
create policy "Users can read own ebook purchases"
on public.ebook_purchases for select
to authenticated
using (auth.uid() = user_id);

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

drop policy if exists "Users can read own subscription" on public.subscriptions;
create policy "Users can read own subscription"
on public.subscriptions for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Service role can manage subscriptions" on public.subscriptions;
create policy "Service role can manage subscriptions"
on public.subscriptions for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Anyone authenticated can read published courses" on public.courses;
create policy "Anyone authenticated can read published courses"
on public.courses for select
to authenticated
using (is_published = true);

drop policy if exists "Authenticated users can insert courses" on public.courses;
create policy "Authenticated users can insert courses"
on public.courses for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update courses" on public.courses;
create policy "Authenticated users can update courses"
on public.courses for update
to authenticated
using (true)
with check (true);

drop policy if exists "Users can read own progress" on public.lesson_progress;
create policy "Users can read own progress"
on public.lesson_progress for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can manage own progress" on public.lesson_progress;
create policy "Users can manage own progress"
on public.lesson_progress for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into public.courses (title, description, content, sort_order, is_published)
values
('CDL Foundations', 'Understand CDL classes, permits, endorsements, and basic training expectations.', 'Start here before moving into inspection and driving safety lessons.', 1, true),
('Pre-Trip Inspection', 'Learn a simple inspection flow for truck, trailer, coupling, lights, brakes, and cab.', 'Use this lesson as a static checklist and memorization guide.', 2, true),
('Air Brakes and Road Safety', 'Review air brake tests, pressure checks, stopping distance, and defensive driving basics.', 'Add your final air brake training content here.', 3, true)
on conflict do nothing;
