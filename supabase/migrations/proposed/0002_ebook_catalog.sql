-- =====================================================================
-- PROPOSED MIGRATION 0002 — eBook catalog (5 tables)
-- STATUS: PROPOSED / NOT APPLIED. Do NOT run against production in
--         Checkpoint 1. For review only.
-- =====================================================================
-- Creates the five missing eBook catalog tables:
--   ebooks, ebook_translations, ebook_files, ebook_covers, ebook_entitlements
--
-- Contract source: MyCDLClass_App_Content_Staging_Bundle_2026-08-20.zip
--   NOTE: the staging ZIP was NOT available in the Checkpoint 1
--   environment (see storage-env-inventory.md). Column contract below is
--   derived from the Checkpoint instructions' specification (9 parent
--   eBooks; 18 en/es localized editions; $14.99 one-time; unique Apple/
--   Google IDs from catalog/store_product_mapping.csv; Supabase Storage
--   buckets public-assets [covers] and ebook-files [PDFs]; checksums).
--   Final column names/keys MUST be reconciled against the real CSV
--   headers in Checkpoint 2 before this migration is applied.
--
-- Design rules honored:
--   * Mirrors the existing normalized/bilingual course pattern.
--   * Parent (ebooks) + *_translations for localized text.
--   * PDFs are private (no public policy); covers are public-readable.
--   * Entitlements are NEVER client-creatable (service_role/admin only).
--   * Non-destructive relationship to existing public.ebook_purchases
--     (that historical table is left untouched; a nullable link column
--      is added, not a rewrite).
--   * Idempotent (IF NOT EXISTS); no DROP/TRUNCATE.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ebooks — parent product family (target: 9 rows)
-- ---------------------------------------------------------------------
create table if not exists public.ebooks (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,                 -- stable business key
  course_id      uuid references public.courses(id) on delete set null, -- optional link to matching course
  category       text,
  price_cents    integer not null default 1499         -- $14.99 (matches lib/pricing.ts)
                 check (price_cents >= 0),
  currency       text not null default 'usd',
  status         text not null default 'ready_for_review'  -- << QA-safe default, NOT 'published'
                 check (status in ('draft','ready_for_review','published','archived')),
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2. ebook_translations — localized copy (target: 18 rows = 9 x {en,es})
-- ---------------------------------------------------------------------
create table if not exists public.ebook_translations (
  id               uuid primary key default gen_random_uuid(),
  ebook_id         uuid not null references public.ebooks(id) on delete cascade,
  language_code    text not null check (language_code in ('en','es')),
  title            text,
  short_description text,
  description      text,
  seo_title        text,
  seo_description  text,
  unique (ebook_id, language_code)
);

-- ---------------------------------------------------------------------
-- 3. ebook_files — private PDF per localized edition (target: 18 rows)
-- ---------------------------------------------------------------------
create table if not exists public.ebook_files (
  id             uuid primary key default gen_random_uuid(),
  ebook_id       uuid not null references public.ebooks(id) on delete cascade,
  language_code  text not null check (language_code in ('en','es')),
  version        text not null default 'v1',
  storage_bucket text not null default 'ebook-files',   -- PRIVATE bucket
  storage_path   text not null,                         -- e.g. <slug>/<lang>/<file>.pdf
  mime_type      text not null default 'application/pdf',
  byte_size      bigint,
  checksum_sha256 text,                                 -- from bundle checksums
  status         text not null default 'ready_for_review'
                 check (status in ('draft','ready_for_review','published','archived')),
  created_at     timestamptz not null default now(),
  -- one active file per (ebook, language, version)
  unique (ebook_id, language_code, version)
);

-- ---------------------------------------------------------------------
-- 4. ebook_covers — public cover image per localized edition (target: 18)
-- ---------------------------------------------------------------------
create table if not exists public.ebook_covers (
  id             uuid primary key default gen_random_uuid(),
  ebook_id       uuid not null references public.ebooks(id) on delete cascade,
  language_code  text not null check (language_code in ('en','es')),
  storage_bucket text not null default 'public-assets',  -- PUBLIC bucket
  storage_path   text not null,                          -- e.g. covers/<slug>-<lang>.png
  mime_type      text not null default 'image/png',
  alt_text       text,
  checksum_sha256 text,
  created_at     timestamptz not null default now(),
  unique (ebook_id, language_code)
);

-- ---------------------------------------------------------------------
-- 5. store_product_map — unique Apple/Google IDs per localized edition
--    (spec: catalog/store_product_mapping.csv; every ID globally unique;
--     com.mycdlclass.appname.tier14.99 is a TIER reference, not reusable)
-- ---------------------------------------------------------------------
create table if not exists public.ebook_store_products (
  id                uuid primary key default gen_random_uuid(),
  ebook_id          uuid not null references public.ebooks(id) on delete cascade,
  language_code     text not null check (language_code in ('en','es')),
  apple_product_id  text unique,
  google_product_id text unique,
  price_tier        text,                    -- e.g. 'tier14.99' (reference only)
  created_at        timestamptz not null default now(),
  unique (ebook_id, language_code)
);

-- ---------------------------------------------------------------------
-- 6. ebook_entitlements — per-user grants (NEVER client-created)
-- ---------------------------------------------------------------------
create table if not exists public.ebook_entitlements (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  ebook_id          uuid not null references public.ebooks(id) on delete cascade,
  language_code     text check (language_code in ('en','es')),
  source            text not null default 'purchase'
                    check (source in ('purchase','course_bundle','grant','migration')),
  ebook_purchase_id uuid references public.ebook_purchases(id) on delete set null, -- non-destructive link to history
  granted_by        uuid references auth.users(id),
  created_at        timestamptz not null default now(),
  unique (user_id, ebook_id, language_code)
);

-- Indexes for catalog, entitlement, and file lookup
create index if not exists ebooks_status_idx           on public.ebooks (status, sort_order);
create index if not exists ebook_translations_lang_idx on public.ebook_translations (language_code);
create index if not exists ebook_files_lookup_idx      on public.ebook_files (ebook_id, language_code, status);
create index if not exists ebook_covers_lookup_idx     on public.ebook_covers (ebook_id, language_code);
create index if not exists ebook_entitlements_user_idx on public.ebook_entitlements (user_id, ebook_id);

-- ---------------------------------------------------------------------
-- 7. Least-privilege RLS
-- ---------------------------------------------------------------------
alter table public.ebooks              enable row level security;
alter table public.ebook_translations  enable row level security;
alter table public.ebook_files         enable row level security;
alter table public.ebook_covers        enable row level security;
alter table public.ebook_store_products enable row level security;
alter table public.ebook_entitlements  enable row level security;

-- Public may read PUBLISHED catalog + translations + covers only.
drop policy if exists ebooks_read_published on public.ebooks;
create policy ebooks_read_published on public.ebooks
  for select using (status = 'published');

drop policy if exists ebook_translations_read on public.ebook_translations;
create policy ebook_translations_read on public.ebook_translations
  for select using (
    exists (select 1 from public.ebooks e
            where e.id = ebook_translations.ebook_id and e.status = 'published')
  );

drop policy if exists ebook_covers_read on public.ebook_covers;
create policy ebook_covers_read on public.ebook_covers
  for select using (
    exists (select 1 from public.ebooks e
            where e.id = ebook_covers.ebook_id and e.status = 'published')
  );

-- ebook_files (PDF pointers) are NOT publicly readable. No anon/authenticated
-- SELECT policy: only service_role (importer + entitlement-checked download
-- route) may read. Signed URLs are minted server-side after entitlement check.
drop policy if exists ebook_files_service_all on public.ebook_files;
create policy ebook_files_service_all on public.ebook_files
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- store products: readable by admins/service only (not needed by storefront).
drop policy if exists ebook_store_products_service_all on public.ebook_store_products;
create policy ebook_store_products_service_all on public.ebook_store_products
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Entitlements: a user may READ ONLY their own; writes are service_role only.
drop policy if exists ebook_entitlements_self_read on public.ebook_entitlements;
create policy ebook_entitlements_self_read on public.ebook_entitlements
  for select using (auth.uid() = user_id);

drop policy if exists ebook_entitlements_service_write on public.ebook_entitlements;
create policy ebook_entitlements_service_write on public.ebook_entitlements
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Grants: revoke writes; storefront reads flow through RLS SELECT policies.
do $$
declare t text;
begin
  foreach t in array array[
    'ebooks','ebook_translations','ebook_covers'
  ] loop
    execute format('revoke insert, update, delete, truncate on public.%I from anon, authenticated;', t);
    execute format('grant select on public.%I to anon, authenticated;', t);
  end loop;
  -- private / server-only tables: no anon/authenticated write, no anon read
  foreach t in array array['ebook_files','ebook_store_products'] loop
    execute format('revoke all on public.%I from anon, authenticated;', t);
  end loop;
  -- entitlements: authenticated may read (own rows via RLS), no writes
  execute 'revoke insert, update, delete, truncate on public.ebook_entitlements from anon, authenticated;';
  execute 'grant select on public.ebook_entitlements to authenticated;';
  execute 'revoke all on public.ebook_entitlements from anon;';
end $$;

-- =====================================================================
-- END PROPOSED MIGRATION 0002 (not applied)
-- =====================================================================
