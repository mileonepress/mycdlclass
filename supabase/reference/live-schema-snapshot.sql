-- =====================================================================
-- LIVE SCHEMA SNAPSHOT (public) — REFERENCE ONLY, DO NOT APPLY
-- =====================================================================
-- Captured for Checkpoint 1 by read-only introspection of the production
-- Supabase project (information_schema + pg_catalog). Structure only:
-- contains NO data rows, NO customer/auth/payment data, NO secrets.
--
-- Purpose: human-readable, code-review-friendly description of what
-- ACTUALLY exists in production today, so reviewers can compare against
-- the obsolete supabase/legacy/schema.legacy.sql.
--
-- This is a descriptive snapshot, NOT a migration. Every table below
-- ALREADY EXISTS in production. Do not run this file. The authoritative
-- machine-readable contract is lib/supabase/database.types.ts.
--
-- Conventions observed in production:
--   * All primary keys are uuid.
--   * Content lives in base tables; human-readable/localized text lives
--     in *_translations tables keyed by (parent_id, language_code).
--   * Publishable content tables carry status text DEFAULT 'published'.
--   * Child rows cascade-delete from their parent (ON DELETE CASCADE).
-- =====================================================================

-- ------------------------------------------------------------------ --
-- CORE COURSE CATALOG (normalized, bilingual en/es)
-- ------------------------------------------------------------------ --

-- courses (9 rows) — parent course family
--   id uuid PK
--   slug text NOT NULL              -- stable business key
--   category text
--   course_type text               -- live data: all 'interactive'
--   thumbnail_path text
--   is_free boolean DEFAULT false
--   status text DEFAULT 'published' -- << AUTO-PUBLISH DEFAULT (see drift report)
--   version text
--   sort_order integer DEFAULT 0
--   estimated_minutes integer
--   passing_score integer DEFAULT 80
--   price_cents integer NOT NULL DEFAULT 2999  -- << DEFAULT $29.99, app constant is $14.99 (drift)
--   updated_at timestamptz DEFAULT now()

-- course_translations (18 rows = 9 x {en,es})
--   id uuid PK
--   course_id uuid NOT NULL -> courses(id) ON DELETE CASCADE
--   language_code text NOT NULL     -- 'en' | 'es'
--   title text
--   short_description text
--   seo_title text
--   seo_description text

-- sections (40 rows)
--   id uuid PK
--   course_id uuid NOT NULL -> courses(id) ON DELETE CASCADE
--   section_key text
--   sort_order integer DEFAULT 0
--   status text DEFAULT 'published'

-- section_translations (80 rows)
--   id uuid PK
--   section_id uuid NOT NULL -> sections(id) ON DELETE CASCADE
--   language_code text NOT NULL
--   title text
--   description text

-- lessons (40 rows)
--   id uuid PK
--   section_id uuid NOT NULL -> sections(id) ON DELETE CASCADE
--   lesson_key text
--   lesson_type text
--   sort_order integer DEFAULT 0
--   estimated_minutes integer
--   is_preview boolean DEFAULT false
--   status text DEFAULT 'published'
--   version text

-- lesson_translations (80 rows)
--   id uuid PK
--   lesson_id uuid NOT NULL -> lessons(id) ON DELETE CASCADE
--   language_code text NOT NULL
--   title text
--   summary text
--   learning_objectives text

-- lesson_blocks (40 rows)
--   id uuid PK
--   lesson_id uuid NOT NULL -> lessons(id) ON DELETE CASCADE
--   block_key text
--   block_type text
--   content_json jsonb
--   sort_order integer DEFAULT 0
--   status text DEFAULT 'published'
--   media_asset_id uuid            -- (no FK constraint observed in prod)

-- block_translations (80 rows)
--   id uuid PK
--   block_id uuid NOT NULL -> lesson_blocks(id) ON DELETE CASCADE
--   language_code text NOT NULL
--   content_json jsonb
--   alt_text text
--   caption text

-- ------------------------------------------------------------------ --
-- ASSESSMENTS
-- ------------------------------------------------------------------ --

-- questions (1,086 rows)
--   id uuid PK
--   course_id uuid NOT NULL -> courses(id) ON DELETE CASCADE
--   section_id uuid -> sections(id) ON DELETE CASCADE
--   lesson_id uuid -> lessons(id) ON DELETE CASCADE
--   question_key text
--   question_type text
--   difficulty text
--   correct_answer_key text        -- letter/key of correct answer_choice
--   sort_order integer DEFAULT 0
--   status text DEFAULT 'published'

-- question_translations (2,172 rows)
--   id uuid PK
--   question_id uuid NOT NULL -> questions(id) ON DELETE CASCADE
--   language_code text NOT NULL
--   question_text text
--   explanation text
--   study_reference text

-- answer_choices (3,578 rows)
--   id uuid PK
--   question_id uuid NOT NULL -> questions(id) ON DELETE CASCADE
--   answer_key text                -- e.g. 'A'/'B'/'C'/'D'
--   sort_order integer DEFAULT 0

-- choice_translations (7,156 rows)
--   id uuid PK
--   answer_choice_id uuid NOT NULL -> answer_choices(id) ON DELETE CASCADE
--   language_code text NOT NULL
--   answer_text text

-- practice_tests (40 rows)
--   id uuid PK
--   course_id uuid NOT NULL -> courses(id) ON DELETE CASCADE
--   test_key text
--   test_type text
--   question_count integer
--   passing_score integer DEFAULT 80
--   time_limit_minutes integer
--   selection_mode text
--   status text DEFAULT 'published'

-- practice_test_questions (1,086 rows) — join table
--   id uuid PK
--   practice_test_id uuid NOT NULL -> practice_tests(id) ON DELETE CASCADE
--   question_id uuid NOT NULL -> questions(id) ON DELETE CASCADE
--   sort_order integer DEFAULT 0
--   weight numeric DEFAULT 1

-- ------------------------------------------------------------------ --
-- MEDIA
-- ------------------------------------------------------------------ --

-- media_assets (9 rows)
--   id uuid PK
--   course_id uuid -> courses(id) ON DELETE CASCADE
--   asset_key text
--   asset_type text
--   storage_bucket text
--   storage_path text
--   mime_type text
--   language_code text
--   downloadable boolean DEFAULT false
--   offline_allowed boolean DEFAULT false
--   status text DEFAULT 'published'
--   alt_text_en text
--   alt_text_es text

-- ------------------------------------------------------------------ --
-- COMMERCE / PROGRESS / OPS (already in production)
-- ------------------------------------------------------------------ --

-- course_entitlements
--   id uuid PK DEFAULT gen_random_uuid()
--   user_id uuid NOT NULL           -- references auth.users(id) in prod
--   course_id uuid NOT NULL -> courses(id) ON DELETE CASCADE
--   source text NOT NULL DEFAULT 'purchase'
--   stripe_session_id text
--   amount_cents integer
--   currency text DEFAULT 'usd'
--   created_at timestamptz NOT NULL DEFAULT now()

-- ebook_purchases  (PRIVATE — customer/payment data; excluded from row-count manifest)
--   id uuid PK DEFAULT gen_random_uuid()
--   user_id uuid
--   ebook_slug text NOT NULL
--   language text
--   stripe_session_id text
--   amount numeric
--   currency text DEFAULT 'usd'
--   payer_email text
--   status text NOT NULL DEFAULT 'completed'
--   download_token text
--   granted_by text
--   created_at timestamptz NOT NULL DEFAULT now()

-- course_lesson_progress   (PRIVATE — per-user)
-- course_quiz_attempts     (PRIVATE — per-user)
-- subscriptions            (PRIVATE — per-user billing)
-- email_subscribers        (PRIVATE — see supabase/admin-panel-setup.sql, current)
-- page_views               (analytics — see supabase/admin-panel-setup.sql, current)

-- =====================================================================
-- END SNAPSHOT — reference only.
-- =====================================================================
