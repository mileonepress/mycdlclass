-- =====================================================================
-- PROPOSED MIGRATION 0003 — Release/QA status model + import audit
-- STATUS: PROPOSED / NOT APPLIED TO PRODUCTION.
--         Validated OFF-production only (local PGlite harness).
-- =====================================================================
-- Owner Decision 5: keep the 9 published courses live on the website, but
-- introduce a SEPARATE release/QA status for mobile-store release, without
-- touching courses.status. This is fully additive:
--   * NO update to existing courses rows.
--   * A companion table content_release_state holds the QA/release status.
--   * Website availability continues to read courses.status='published'.
--   * Mobile-store release reads content_release_state.release_status.
--   * Bundle imports default release_status='ready_for_review' and can
--     NEVER auto-publish (no code path flips it to 'approved').
--
-- Also adds the importer's job + audit tables so every dry-run / apply is
-- recorded (who, when, counts, conflicts).
--
-- Additive & idempotent: IF NOT EXISTS; no DROP/TRUNCATE; no mass UPDATE.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. content_release_state — QA/release status decoupled from website
-- ---------------------------------------------------------------------
create table if not exists public.content_release_state (
  id             uuid primary key default gen_random_uuid(),
  entity_type    text not null check (entity_type in ('course','ebook')),
  entity_id      uuid not null,                     -- courses.id or ebooks.id
  -- Website availability is UNCHANGED and still driven by the entity's own
  -- status column. This column governs MOBILE-STORE release only.
  release_status text not null default 'ready_for_review'
                 check (release_status in ('ready_for_review','qa_hold','approved','rejected')),
  qa_notes       text,
  qa_blocker_ref text,                              -- e.g. QA_HOLD.md anchor / question id
  reviewed_by    uuid references auth.users(id),
  reviewed_at    timestamptz,
  updated_by     uuid references auth.users(id),
  updated_at     timestamptz not null default now(),
  created_at     timestamptz not null default now(),
  unique (entity_type, entity_id)
);
create index if not exists content_release_state_lookup_idx
  on public.content_release_state (entity_type, release_status);

alter table public.content_release_state enable row level security;

-- Admins read; service_role manages. No anon/authenticated writes.
drop policy if exists content_release_state_admin_read on public.content_release_state;
create policy content_release_state_admin_read on public.content_release_state
  for select using (public.is_admin());

drop policy if exists content_release_state_service_all on public.content_release_state;
create policy content_release_state_service_all on public.content_release_state
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ---------------------------------------------------------------------
-- 2. Guard: block mobile-store release approval while a QA hold exists.
--    A trigger prevents setting release_status='approved' when an
--    unresolved qa_hold blocker is recorded for the same entity.
-- ---------------------------------------------------------------------
create or replace function public.enforce_qa_hold_before_approve()
returns trigger
language plpgsql
as $$
begin
  if new.release_status = 'approved'
     and coalesce(new.qa_blocker_ref, '') <> ''
     and new.reviewed_at is null then
    raise exception
      'QA hold present (blocker %). Clear semantic QA before mobile-store approval.',
      new.qa_blocker_ref;
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_enforce_qa_hold on public.content_release_state;
create trigger trg_enforce_qa_hold
  before insert or update on public.content_release_state
  for each row execute function public.enforce_qa_hold_before_approve();

-- ---------------------------------------------------------------------
-- 3. content_import_jobs — one row per dry-run or apply attempt
-- ---------------------------------------------------------------------
create table if not exists public.content_import_jobs (
  id             uuid primary key default gen_random_uuid(),
  bundle_name    text not null,
  mode           text not null check (mode in ('dry_run','apply')),
  status         text not null default 'pending'
                 check (status in ('pending','running','succeeded','failed')),
  manifest_json  jsonb,
  summary_json   jsonb,                 -- {new, changed, unchanged, conflicts}
  created_by     uuid references auth.users(id),
  created_at     timestamptz not null default now(),
  finished_at    timestamptz
);
create index if not exists content_import_jobs_created_idx
  on public.content_import_jobs (created_at desc);

alter table public.content_import_jobs enable row level security;

drop policy if exists content_import_jobs_admin_read on public.content_import_jobs;
create policy content_import_jobs_admin_read on public.content_import_jobs
  for select using (public.is_admin());

drop policy if exists content_import_jobs_service_all on public.content_import_jobs;
create policy content_import_jobs_service_all on public.content_import_jobs
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ---------------------------------------------------------------------
-- 4. content_import_rows — per-row dry-run diff (new/changed/unchanged/conflict)
-- ---------------------------------------------------------------------
create table if not exists public.content_import_rows (
  id           uuid primary key default gen_random_uuid(),
  job_id       uuid not null references public.content_import_jobs(id) on delete cascade,
  table_name   text not null,
  stable_id    text not null,
  disposition  text not null check (disposition in ('new','changed','unchanged','conflict')),
  detail_json  jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists content_import_rows_job_idx
  on public.content_import_rows (job_id, table_name, disposition);

alter table public.content_import_rows enable row level security;

drop policy if exists content_import_rows_admin_read on public.content_import_rows;
create policy content_import_rows_admin_read on public.content_import_rows
  for select using (public.is_admin());

drop policy if exists content_import_rows_service_all on public.content_import_rows;
create policy content_import_rows_service_all on public.content_import_rows
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Grants: revoke writes; admin reads happen through service_role in app code.
do $$
declare t text;
begin
  foreach t in array array[
    'content_release_state','content_import_jobs','content_import_rows'
  ] loop
    execute format('revoke all on public.%I from anon, authenticated;', t);
  end loop;
end $$;

-- =====================================================================
-- END PROPOSED MIGRATION 0003 (not applied to production)
-- =====================================================================
