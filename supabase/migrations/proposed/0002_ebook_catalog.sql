-- =====================================================================
-- PROPOSED MIGRATION 0002 — eBook catalog (RECONCILED to staging bundle)
-- STATUS: PROPOSED / NOT APPLIED TO PRODUCTION.
--         Validated OFF-production only (local PGlite harness) in
--         Checkpoint 2. Production application requires separate approval.
-- =====================================================================
-- Reconciled against the REAL staging-bundle CSV headers in
-- MyCDLClass_App_Content_Staging_Bundle_2026-08-20.zip:
--   ebooks.csv            id,course_id,slug,category,cover_asset_id,status,sort_order,created_at,updated_at
--   ebook_translations.csv id,ebook_id,language_code,title,subtitle,description,seo_title,seo_description
--   ebook_files.csv       id,ebook_id,language_code,version_number,storage_bucket,storage_path,file_name,mime_type,file_size_bytes,page_count,checksum_sha256,downloadable,offline_allowed,status,published_at
--   ebook_covers.csv      id,ebook_id,storage_bucket,storage_path,mime_type,width_px,height_px,status,alt_text_en,alt_text_es,source_file_note   (9 rows: one per family, bilingual alt)
--   ebook_entitlements.csv id,ebook_id,access_product_key,access_type,platform,active,notes   (18 RULE rows, NOT per-user)
--   catalog/store_product_mapping.csv -> ebook_store_products (18 rows, unique apple/google ids)
--
-- Design rules honored:
--   * Mirrors the normalized/bilingual course pattern already in prod.
--   * PDFs private (ebook-files bucket); covers public (public-assets).
--   * QA-safe: status defaults to 'ready_for_review', NEVER 'published'.
--   * Non-destructive: public.ebook_purchases (history) left untouched;
--     a nullable link column is added to per-user entitlements, not a rewrite.
--   * Additive & idempotent: IF NOT EXISTS; no DROP TABLE / TRUNCATE /
--     destructive mass UPDATE.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ebook_covers — one public cover per family (target: 9 rows)
--    Created before ebooks because ebooks.cover_asset_id references it.
-- ---------------------------------------------------------------------
create table if not exists public.ebook_covers (
  id              uuid primary key default gen_random_uuid(),
  ebook_id        uuid,                                   -- FK added after ebooks exists (see step 8)
  storage_bucket  text not null default 'public-assets',  -- PUBLIC bucket
  storage_path    text not null,                          -- e.g. ebook-covers/<slug>.webp
  mime_type       text not null default 'image/webp',
  width_px        integer,
  height_px       integer,
  status          text not null default 'ready_for_review'
                  check (status in ('draft','ready_for_review','approved','published','archived')),
  alt_text_en     text,
  alt_text_es     text,
  source_file_note text,
  checksum_sha256 text,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2. ebooks — parent product family (target: 9 rows)
-- ---------------------------------------------------------------------
create table if not exists public.ebooks (
  id             uuid primary key default gen_random_uuid(),
  course_id      uuid references public.courses(id) on delete set null,  -- matching interactive course
  slug           text not null unique,                                   -- stable business key
  category       text,
  cover_asset_id uuid references public.ebook_covers(id) on delete set null,
  status         text not null default 'ready_for_review'                -- << QA-safe default
                 check (status in ('draft','ready_for_review','approved','published','archived')),
  sort_order     integer not null default 0,
  -- Pricing is uniform ($14.99) and enforced server-side (lib/pricing.ts);
  -- stored here for catalog display + audit, defaulting to the app constant.
  price_cents    integer not null default 1499 check (price_cents >= 0),
  currency       text not null default 'usd',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. ebook_translations — localized copy (target: 18 rows = 9 x {en,es})
-- ---------------------------------------------------------------------
create table if not exists public.ebook_translations (
  id              uuid primary key default gen_random_uuid(),
  ebook_id        uuid not null references public.ebooks(id) on delete cascade,
  language_code   text not null check (language_code in ('en','es')),
  title           text,
  subtitle        text,
  description     text,
  seo_title       text,
  seo_description text,
  unique (ebook_id, language_code)
);

-- ---------------------------------------------------------------------
-- 4. ebook_files — private PDF per localized edition (target: 18 rows)
-- ---------------------------------------------------------------------
create table if not exists public.ebook_files (
  id              uuid primary key default gen_random_uuid(),
  ebook_id        uuid not null references public.ebooks(id) on delete cascade,
  language_code   text not null check (language_code in ('en','es')),
  version_number  integer not null default 1,
  storage_bucket  text not null default 'ebook-files',    -- PRIVATE bucket
  storage_path    text not null,                          -- e.g. <slug>/<slug>-<lang>-v1.pdf
  file_name       text,
  mime_type       text not null default 'application/pdf',
  file_size_bytes bigint,
  page_count      integer,
  checksum_sha256 text,
  downloadable    boolean not null default true,
  offline_allowed boolean not null default true,
  status          text not null default 'ready_for_review'
                  check (status in ('draft','ready_for_review','ready_for_upload','approved','published','archived')),
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  unique (ebook_id, language_code, version_number)
);

-- ---------------------------------------------------------------------
-- 5. ebook_store_products — unique Apple/Google IDs per localized edition
--    Source: catalog/store_product_mapping.csv (18 rows).
--    com.mycdlclass.appname.tier14.99 is a TIER reference, never reused.
-- ---------------------------------------------------------------------
create table if not exists public.ebook_store_products (
  id                 uuid primary key default gen_random_uuid(),
  ebook_id           uuid not null references public.ebooks(id) on delete cascade,
  language_code      text not null check (language_code in ('en','es')),
  catalog_sku        text unique,
  apple_product_id   text unique,
  google_product_id  text unique,
  price_usd          numeric(10,2) not null default 14.99,
  currency           text not null default 'USD',
  purchase_model     text default 'one-time permanent access',
  includes_matching_ebook boolean not null default true,
  provided_apple_id_reference text,     -- do-not-reuse tier reference
  release_gate       text,
  created_at         timestamptz not null default now(),
  unique (ebook_id, language_code)
);

-- ---------------------------------------------------------------------
-- 6. ebook_entitlement_rules — product-key access RULES (target: 18 rows)
--    From ebook_entitlements.csv. These are catalog RULES (which product
--    key grants which ebook), NOT per-user grants.
-- ---------------------------------------------------------------------
create table if not exists public.ebook_entitlement_rules (
  id                 uuid primary key default gen_random_uuid(),
  ebook_id           uuid not null references public.ebooks(id) on delete cascade,
  access_product_key text not null,               -- e.g. course-general-knowledge
  access_type        text not null default 'included_with_course'
                     check (access_type in ('included_with_course','standalone_purchase','grant')),
  platform           text not null default 'all',
  active             boolean not null default true,
  notes              text,
  created_at         timestamptz not null default now(),
  unique (ebook_id, access_product_key)
);

-- ---------------------------------------------------------------------
-- 7. ebook_entitlements — PER-USER grants (runtime; NOT in the bundle)
--    Written only by the server (purchase webhook / course-bundle grant).
--    Non-destructively links to historical public.ebook_purchases.
-- ---------------------------------------------------------------------
create table if not exists public.ebook_entitlements (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  ebook_id          uuid not null references public.ebooks(id) on delete cascade,
  language_code     text check (language_code in ('en','es')),
  source            text not null default 'purchase'
                    check (source in ('purchase','course_bundle','grant','migration')),
  ebook_purchase_id uuid references public.ebook_purchases(id) on delete set null,
  granted_by        uuid references auth.users(id),
  created_at        timestamptz not null default now(),
  unique (user_id, ebook_id, language_code)
);

-- ---------------------------------------------------------------------
-- 8. Deferred FK: ebook_covers.ebook_id -> ebooks.id (both now exist)
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_schema='public' and table_name='ebook_covers'
      and constraint_name='ebook_covers_ebook_id_fkey'
  ) then
    alter table public.ebook_covers
      add constraint ebook_covers_ebook_id_fkey
      foreign key (ebook_id) references public.ebooks(id) on delete cascade;
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 9. Indexes
-- ---------------------------------------------------------------------
create index if not exists ebooks_status_idx            on public.ebooks (status, sort_order);
create index if not exists ebooks_course_id_idx         on public.ebooks (course_id);
create index if not exists ebooks_cover_asset_id_idx    on public.ebooks (cover_asset_id);
create index if not exists ebook_translations_lang_idx  on public.ebook_translations (language_code);
create index if not exists ebook_translations_ebook_idx on public.ebook_translations (ebook_id);
create index if not exists ebook_files_lookup_idx       on public.ebook_files (ebook_id, language_code, status);
create index if not exists ebook_covers_ebook_idx       on public.ebook_covers (ebook_id);
create index if not exists ebook_store_products_ebook_idx on public.ebook_store_products (ebook_id);
create index if not exists ebook_entitlement_rules_key_idx on public.ebook_entitlement_rules (access_product_key);
create index if not exists ebook_entitlements_user_idx  on public.ebook_entitlements (user_id, ebook_id);

-- ---------------------------------------------------------------------
-- 10. Least-privilege RLS
-- ---------------------------------------------------------------------
alter table public.ebooks                  enable row level security;
alter table public.ebook_translations      enable row level security;
alter table public.ebook_files             enable row level security;
alter table public.ebook_covers            enable row level security;
alter table public.ebook_store_products    enable row level security;
alter table public.ebook_entitlement_rules enable row level security;
alter table public.ebook_entitlements      enable row level security;

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

-- Private PDF pointers: service_role only. Signed URLs are minted
-- server-side AFTER an entitlement check.
drop policy if exists ebook_files_service_all on public.ebook_files;
create policy ebook_files_service_all on public.ebook_files
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Store products + entitlement rules: server/admin only (not storefront).
drop policy if exists ebook_store_products_service_all on public.ebook_store_products;
create policy ebook_store_products_service_all on public.ebook_store_products
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists ebook_entitlement_rules_service_all on public.ebook_entitlement_rules;
create policy ebook_entitlement_rules_service_all on public.ebook_entitlement_rules
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Per-user entitlements: a user reads ONLY their own; writes server-only.
drop policy if exists ebook_entitlements_self_read on public.ebook_entitlements;
create policy ebook_entitlements_self_read on public.ebook_entitlements
  for select using (auth.uid() = user_id);

drop policy if exists ebook_entitlements_service_write on public.ebook_entitlements;
create policy ebook_entitlements_service_write on public.ebook_entitlements
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ---------------------------------------------------------------------
-- 11. Grants — revoke writes from anon/authenticated (least privilege)
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  -- public-readable catalog tables
  foreach t in array array['ebooks','ebook_translations','ebook_covers'] loop
    execute format('revoke insert, update, delete, truncate on public.%I from anon, authenticated;', t);
    execute format('grant select on public.%I to anon, authenticated;', t);
  end loop;
  -- server-only tables: no anon/authenticated access at all
  foreach t in array array['ebook_files','ebook_store_products','ebook_entitlement_rules'] loop
    execute format('revoke all on public.%I from anon, authenticated;', t);
  end loop;
  -- per-user entitlements: authenticated may read own rows via RLS; no writes; no anon
  execute 'revoke insert, update, delete, truncate on public.ebook_entitlements from anon, authenticated;';
  execute 'grant select on public.ebook_entitlements to authenticated;';
  execute 'revoke all on public.ebook_entitlements from anon;';
end $$;

-- =====================================================================
-- END PROPOSED MIGRATION 0002 (reconciled; not applied to production)
-- =====================================================================
