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

alter table public.subscriptions enable row level security;
alter table public.courses enable row level security;
alter table public.lesson_progress enable row level security;

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
