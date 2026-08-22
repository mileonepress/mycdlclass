# Checkpoint 1 — Schema Drift Report

**Branch:** `feat/admin-content-import` (cut from `mycdlclass-content-dashboard` @ `9b86f19`)
**Live Supabase project:** production (`aibndllvunylmxborsad`)
**Scope:** Read-only reconciliation of committed SQL vs. the live production schema. No production changes.

---

## 1. Summary

The committed `supabase/schema.sql` (now `supabase/legacy/schema.legacy.sql`) describes an early, **flat, single-language** course model. The live production database is a **normalized, bilingual (en/es)** model with 22 public tables. The drift is total for the course/content domain: the legacy file and production share almost no column shape.

The authoritative source of truth going forward is:

- `lib/supabase/database.types.ts` — generated from the live schema
- `supabase/reference/live-schema-snapshot.sql` — schema-only structural snapshot
- this report

---

## 2. Table inventory (live, 22 tables)

**Course content (normalized):**
`courses`, `course_translations`, `sections`, `section_translations`, `lessons`, `lesson_translations`, `lesson_blocks`, `block_translations`, `questions`, `question_translations`, `answer_choices`, `choice_translations`, `practice_tests`, `practice_test_questions`, `media_assets`

**Entitlements / progress / commerce:**
`course_entitlements`, `course_lesson_progress`, `course_quiz_attempts`, `subscriptions`, `ebook_purchases`

**Admin / analytics:**
`email_subscribers`, `page_views`

**eBook catalog tables (`ebooks`, `ebook_translations`, `ebook_files`, `ebook_covers`, `ebook_entitlements`): DO NOT EXIST.** eBooks are currently hardcoded in `lib/ebookProducts.js`. Only `ebook_purchases` is persisted.

---

## 3. `courses` — legacy vs live (the core drift)

| Legacy `schema.sql` column | Live production `courses` column | Notes |
|---|---|---|
| `title text` | — | moved to `course_translations.title` |
| `description text` | — | moved to `course_translations.description` |
| `content text` | — | replaced by `sections`→`lessons`→`lesson_blocks` |
| `video_url text` | — | replaced by `media_assets` |
| `is_published boolean` | `status text` | status is `'draft' \| 'ready_for_review' \| 'published'` (free text in DB) |
| `price numeric` | `price_cents integer` | integer cents |
| — | `slug text` | stable business key |
| — | `category text` | |
| — | `course_type text` | all live rows = `interactive` |
| — | `is_free boolean` | |
| — | `estimated_minutes` / duration fields | |
| `id uuid` | `id uuid` | both UUID — stable-ID upserts are viable |

### Critical column defaults (verified from live introspection)

- **`courses.status` DEFAULT `'published'`** — this is the mechanism by which imported courses auto-publish. Any importer MUST set `status` explicitly to `'ready_for_review'` and NOT rely on the column default.
- **`courses.price_cents` DEFAULT `2999`** ($29.99) — drifts from the application's single-price constant `STUDY_GUIDE_PRICE_CENTS = 1499` ($14.99) in `lib/pricing.ts`. Importer/adapter must set price explicitly.

---

## 4. Live row counts vs. expected staging bundle (all EXACT matches)

| Table | Live count | Expected | Match |
|---|---|---|---|
| courses | 9 | 9 | ✅ |
| course_translations | 18 | 18 | ✅ |
| sections | 40 | 40 | ✅ |
| section_translations | 80 | 80 | ✅ |
| lessons | 40 | 40 | ✅ |
| lesson_translations | 80 | 80 | ✅ |
| lesson_blocks | 40 | 40 | ✅ |
| block_translations | 80 | 80 | ✅ |
| practice_tests | 40 | 40 | ✅ |
| questions | 1086 | 1086 | ✅ |
| question_translations | 2172 | 2172 | ✅ |
| answer_choices | 3578 | 3578 | ✅ |
| choice_translations | 7156 | 7156 | ✅ |
| practice_test_questions | 1086 | 1086 | ✅ |
| media_assets | 9 | 9 | ✅ |

**Publish status:** all 9 courses `status='published'`; all 9 `course_type='interactive'`.
**Translations by language:** en=9, es=9. Every course is fully bilingual.

---

## 5. Other legacy SQL files reconciled

| File | Status | Action taken |
|---|---|---|
| `supabase/schema.sql` | Obsolete flat model | Moved → `supabase/legacy/schema.legacy.sql` + DO-NOT-APPLY header |
| `supabase/seed-practice-questions.sql` | Targets non-existent flat `questions` shape (`option_a..d`, `is_published`) | Moved → `supabase/legacy/seed-practice-questions.legacy.sql` + header |
| `supabase/admin-panel-setup.sql` | **Matches production** (`email_subscribers`, `page_views`, service-role RLS) | Kept as-is |

---

## 6. Compatibility conclusion

- Course reads already work because `lib/supabase/courseCatalog.ts` uses the **service-role** client (bypasses RLS). The generated types now match this shape.
- Stable UUIDs + unique slugs exist across content tables → **idempotent upsert-based import is viable** without re-keying.
- The eBook catalog requires **new tables** (proposed migration `0002_ebook_catalog.sql`, unapplied).
- No production schema was altered in Checkpoint 1.
