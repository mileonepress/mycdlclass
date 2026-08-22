-- =====================================================================
-- PROPOSED MIGRATION 0001 — Admin authorization + content RLS remediation
-- STATUS: PROPOSED / NOT APPLIED. Do NOT run against production in
--         Checkpoint 1. For review only.
-- =====================================================================
-- Goals:
--   1. Introduce a server-verified admin model (private admin_users table
--      + is_admin() helper) to replace the ADMIN_EMAILS env allowlist.
--   2. Close the two live security findings from the RLS/grants audit:
--        (a) content tables with RLS ENABLED but ZERO policies
--            -> anon/authenticated read returns 0 rows (breaks any
--               non-service-role reader; masks the real posture).
--        (b) EVERY public table grants INSERT/UPDATE/DELETE/TRUNCATE to
--            anon and authenticated. RLS currently mitigates, but the
--            grants themselves are dangerous and must be revoked.
--   3. Add an admin mutation audit trail.
--
-- Safety properties:
--   * Idempotent where practical (IF NOT EXISTS / DROP POLICY IF EXISTS).
--   * No DROP TABLE / TRUNCATE / destructive rewrites.
--   * Does NOT grant admin to anyone (no seed rows).
--   * Read policies are least-privilege: public may read only 'published'
--     content; writes remain server-only (service_role) or admin.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Admin membership (private, server-checked)
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'admin'
              check (role in ('admin','super_admin','content_editor')),
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users(id)
);

alter table public.admin_users enable row level security;

-- Only service role manages membership; admins may read the roster.
-- (SELECT policy references is_admin(), defined below.)
drop policy if exists admin_users_service_all on public.admin_users;
create policy admin_users_service_all
  on public.admin_users for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Helper: is the current JWT an admin? SECURITY DEFINER so it can read
-- admin_users without the caller needing direct table access.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = auth.uid()
  );
$$;

-- Least privilege: is_admin() is referenced INSIDE RLS policies (evaluated
-- as the policy owner), so it does NOT need to be directly callable over
-- PostgREST RPC by anon/authenticated. Revoke EXECUTE from those roles to
-- clear advisor lints 0028/0029; service_role retains it for server code.
revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to service_role;

drop policy if exists admin_users_admin_read on public.admin_users;
create policy admin_users_admin_read
  on public.admin_users for select
  using (public.is_admin());

-- ---------------------------------------------------------------------
-- 2. Admin mutation audit trail
-- ---------------------------------------------------------------------
create table if not exists public.admin_audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references auth.users(id),
  action      text not null,            -- e.g. 'course.update','ebook.publish'
  entity      text not null,            -- table/domain affected
  entity_id   text,                     -- uuid/slug of affected row
  before_json jsonb,
  after_json  jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists admin_audit_log_created_at_idx
  on public.admin_audit_log (created_at desc);
create index if not exists admin_audit_log_entity_idx
  on public.admin_audit_log (entity, entity_id);

alter table public.admin_audit_log enable row level security;

drop policy if exists admin_audit_service_all on public.admin_audit_log;
create policy admin_audit_service_all
  on public.admin_audit_log for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists admin_audit_admin_read on public.admin_audit_log;
create policy admin_audit_admin_read
  on public.admin_audit_log for select
  using (public.is_admin());

-- ---------------------------------------------------------------------
-- 3. Content RLS remediation  [RECONCILED WITH LIVE PROD 2026-08-22]
--    Pre-flight baseline of production revealed that MOST content tables
--    ALREADY carry correct read policies:
--      * status-gated published read: courses, sections, lessons,
--        lesson_blocks, practice_tests, media_assets
--          -> policy "read <table>", using (status = 'published')
--      * read-all on translations: course_translations,
--        section_translations, lesson_translations, block_translations
--          -> policy "read <table> translations", using (true)
--    Only FIVE tables are genuinely RLS-enabled-with-ZERO-policies (the
--    actual advisor `rls_enabled_no_policy` findings):
--        questions, question_translations, answer_choices,
--        choice_translations, practice_test_questions
--
--    Therefore this step remediates ONLY those five, and does so
--    defensively: it SKIPS any table that already has a SELECT policy so
--    it can never create a duplicate/overlapping policy (which would trip
--    the `multiple_permissive_policies` performance lint). Existing
--    policies are left exactly as-is.
-- ---------------------------------------------------------------------

-- questions has a status column -> published-only read (only if none exists)
do $$
begin
  execute 'alter table public.questions enable row level security';
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='questions' and cmd='SELECT'
  ) then
    execute 'create policy questions_read_published on public.questions
             for select using (status = ''published'')';
  end if;
end $$;

-- Child/translation/join tables with NO status column -> read-all,
-- created ONLY when the table currently has no SELECT policy.
do $$
declare t text;
begin
  foreach t in array array[
    'question_translations','answer_choices',
    'choice_translations','practice_test_questions'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
    if not exists (
      select 1 from pg_policies
      where schemaname='public' and tablename=t and cmd='SELECT'
    ) then
      execute format(
        'create policy %I on public.%I for select using (true);',
        t||'_read_all', t
      );
    end if;
  end loop;
end $$;
-- NOTE: A stricter policy joining answer_choices/*_translations to the
-- parent's published status is preferable long-term, but is deferred to
-- avoid heavy per-row subqueries before adapter profiling. Matches the
-- read-all posture already live on the sibling translation tables.

-- ---------------------------------------------------------------------
-- 4. Revoke dangerous write grants from anon/authenticated
--    Audit finding: anon + authenticated hold INSERT/UPDATE/DELETE/
--    TRUNCATE on all public tables. Revoke write; keep SELECT (RLS still
--    constrains rows). Service role is unaffected.
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
    execute format('revoke insert, update, delete, truncate on public.%I from anon, authenticated;', t);
    execute format('grant select on public.%I to anon, authenticated;', t);
  end loop;
end $$;

-- =====================================================================
-- END PROPOSED MIGRATION 0001 (not applied)
-- =====================================================================
