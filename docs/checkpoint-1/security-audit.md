# Checkpoint 1 — RLS & Authorization Security Audit

**Live Supabase project:** production (`aibndllvunylmxborsad`)
**Method:** Read-only introspection of `pg_class.relrowsecurity`, `pg_policies`, and `information_schema.role_table_grants`. No changes applied.

---

## 1. Headline findings

1. **RLS is ENABLED on all 22 public tables** (no table has RLS disabled). Good baseline.
2. **CRITICAL — every one of the 22 tables grants `INSERT`/`UPDATE`/`DELETE`/`TRUNCATE` to `anon` and `authenticated`.** RLS is currently the *only* thing standing between the public anon key and destructive writes. Table-level privileges should be revoked for `anon`/`authenticated` on content tables so that security does not depend solely on policy coverage.
3. **HIGH — 5 content tables have RLS enabled but ZERO policies**, so with default-deny they return/accept nothing for anon/authenticated:
   `answer_choices`, `choice_translations`, `practice_test_questions`, `question_translations`, `questions`.
   The public storefront only works because reads go through the **service-role** client (`lib/supabase/courseCatalog.ts`), which bypasses RLS. A browser/anon-key dashboard would see empty quizzes and answers.
4. **Admin identity is an env allowlist**, not a database role. `lib/adminAuth.ts` checks `ADMIN_EMAILS` against `supabase.auth.getUser()` server-side (good — it is server-verified), but there is no `admin_users` table and no DB-enforced admin boundary.
5. **`middleware.ts` does not gate `/admin` (or a future `/dashboard`).** It only refreshes the session via `lib/supabase/proxy.ts`. Each admin page self-guards with `redirect()`. This works but is not defense-in-depth.

---

## 2. Detail: RLS on with zero policies

| Table | RLS enabled | Policy count | Effect for anon/authenticated |
|---|---|---|---|
| answer_choices | yes | 0 | default-deny (0 rows) |
| choice_translations | yes | 0 | default-deny (0 rows) |
| practice_test_questions | yes | 0 | default-deny (0 rows) |
| question_translations | yes | 0 | default-deny (0 rows) |
| questions | yes | 0 | default-deny (0 rows) |

All other content tables have RLS enabled and at least one policy.

## 3. Detail: over-broad table privileges

All 22 tables (`courses`, `course_translations`, `sections`, `section_translations`, `lessons`, `lesson_translations`, `lesson_blocks`, `block_translations`, `questions`, `question_translations`, `answer_choices`, `choice_translations`, `practice_tests`, `practice_test_questions`, `media_assets`, `course_entitlements`, `course_lesson_progress`, `course_quiz_attempts`, `subscriptions`, `ebook_purchases`, `email_subscribers`, `page_views`) grant write privileges to `anon` and/or `authenticated`.

> The exposure is mitigated today only because most tables also have restrictive/read-only policies. On the 5 zero-policy tables the write grant is currently blocked by default-deny — but the grant itself is inappropriate and should be revoked.

---

## 4. Remediation (proposed, UNAPPLIED — `supabase/migrations/proposed/0001_admin_authorization_and_content_rls.sql`)

1. Create `public.admin_users(user_id uuid pk, role text, created_at)` + a `SECURITY DEFINER` `public.is_admin()` helper.
2. `REVOKE` INSERT/UPDATE/DELETE/TRUNCATE from `anon`/`authenticated` on all content tables (writes go only through the service-role adapter).
3. Add explicit **read policies** (`select` for `anon`/`authenticated`) to the 5 zero-policy tables so a future anon-key surface can read published content, plus admin-write policies gated on `is_admin()`.
4. Application-layer follow-ups (later checkpoints, not SQL):
   - `requireAdmin()` helper backed by `admin_users`, used by every `/dashboard` page, server action, and route handler.
   - Gate `/dashboard/*` in `middleware.ts`.
   - Keep `SUPABASE_SERVICE_ROLE_KEY` strictly server-side (already true).

**Nothing in this section was executed. All statements are staged for review under `supabase/migrations/proposed/`.**
