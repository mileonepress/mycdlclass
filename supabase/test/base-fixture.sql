-- =====================================================================
-- BASE FIXTURE for the OFF-PRODUCTION migration harness (PGlite).
-- Reproduces the RELEVANT production posture so migrations 0001/0002/0003
-- can be applied and asserted in isolation:
--   * auth schema + auth.users + auth.uid()/auth.role() stubs
--   * anon / authenticated / service_role roles
--   * the 15 content tables (minimal columns) with RLS ENABLED but
--     NO policies, and broad INSERT/UPDATE/DELETE grants to anon +
--     authenticated  (the exact findings migration 0001 remediates)
--   * courses.status DEFAULT 'published' (the auto-publish driver)
--   * ebook_purchases (history table referenced by 0002)
-- Structure only — NO production data. Local test use ONLY.
-- =====================================================================

-- Supabase-like roles (no-ops in single-user PGlite, but needed for grants)
do $$ begin if not exists (select 1 from pg_roles where rolname='anon') then create role anon; end if; end $$;
do $$ begin if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated; end if; end $$;
do $$ begin if not exists (select 1 from pg_roles where rolname='service_role') then create role service_role; end if; end $$;

-- Minimal auth schema + JWT helper stubs
create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text
);
create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create or replace function auth.role() returns text language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claim.role', true), ''), 'anon') $$;

-- ---------------------------------------------------------------------
-- Content tables (minimal columns needed by the migrations)
-- ---------------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text,
  course_type text,
  status text default 'published',      -- reproduces auto-publish default
  price_cents integer not null default 2999,
  sort_order integer default 0,
  updated_at timestamptz default now()
);
create table if not exists public.course_translations (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  language_code text not null,
  title text,
  unique (course_id, language_code)
);
create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  section_key text, status text default 'published'
);
create table if not exists public.section_translations (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  language_code text not null, title text
);
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  lesson_key text, status text default 'published'
);
create table if not exists public.lesson_translations (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  language_code text not null, title text
);
create table if not exists public.lesson_blocks (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  block_key text, status text default 'published'
);
create table if not exists public.block_translations (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references public.lesson_blocks(id) on delete cascade,
  language_code text not null
);
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  question_key text, correct_answer_key text, status text default 'published'
);
create table if not exists public.question_translations (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  language_code text not null, question_text text
);
create table if not exists public.answer_choices (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  answer_key text
);
create table if not exists public.choice_translations (
  id uuid primary key default gen_random_uuid(),
  answer_choice_id uuid not null references public.answer_choices(id) on delete cascade,
  language_code text not null, answer_text text
);
create table if not exists public.practice_tests (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  test_key text, selection_mode text, status text default 'published'
);
create table if not exists public.practice_test_questions (
  id uuid primary key default gen_random_uuid(),
  practice_test_id uuid not null references public.practice_tests(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade
);
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  asset_key text, storage_bucket text, storage_path text, status text default 'published'
);
create table if not exists public.ebook_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid, ebook_slug text not null, language text,
  status text not null default 'completed', created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Reproduce the production RLS/grants posture the migrations remediate:
--   RLS ENABLED on every content table, NO policies, broad write grants.
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'courses','course_translations','sections','section_translations',
    'lessons','lesson_translations','lesson_blocks','block_translations',
    'questions','question_translations','answer_choices','choice_translations',
    'practice_tests','practice_test_questions','media_assets'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('grant select, insert, update, delete, truncate on public.%I to anon, authenticated;', t);
  end loop;
end $$;
