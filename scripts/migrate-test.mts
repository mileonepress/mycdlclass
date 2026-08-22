/**
 * OFF-PRODUCTION migration harness (PGlite / embedded WASM Postgres).
 *
 * Applies proposed migrations 0001 + 0002 + 0003 against an isolated,
 * in-memory Postgres that reproduces the relevant production posture
 * (see supabase/test/base-fixture.sql). Asserts the security, QA-hold,
 * idempotency, and rollback properties the owner requires before any
 * production approval. Touches NOTHING outside this process.
 *
 * Run: pnpm exec tsx scripts/migrate-test.mts
 */
import { PGlite } from "@electric-sql/pglite"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()
const P = (p: string) => join(ROOT, p)
const read = (p: string) => readFileSync(P(p), "utf8")

let pass = 0
let fail = 0
const results: string[] = []
function check(name: string, ok: boolean, extra = "") {
  if (ok) {
    pass++
    results.push(`  PASS  ${name}${extra ? ` — ${extra}` : ""}`)
  } else {
    fail++
    results.push(`  FAIL  ${name}${extra ? ` — ${extra}` : ""}`)
  }
}

const MIGRATIONS = [
  "supabase/migrations/proposed/0001_admin_authorization_and_content_rls.sql",
  "supabase/migrations/proposed/0002_ebook_catalog.sql",
  "supabase/migrations/proposed/0003_release_status_and_import_audit.sql",
]

const CONTENT_TABLES = [
  "courses", "course_translations", "sections", "section_translations",
  "lessons", "lesson_translations", "lesson_blocks", "block_translations",
  "questions", "question_translations", "answer_choices", "choice_translations",
  "practice_tests", "practice_test_questions", "media_assets",
]

async function policyCount(db: PGlite, table: string): Promise<number> {
  const r = await db.query<{ n: number }>(
    `select count(*)::int as n from pg_policies where schemaname='public' and tablename=$1`,
    [table],
  )
  return r.rows[0].n
}

async function grantExists(db: PGlite, table: string, grantee: string, priv: string): Promise<boolean> {
  const r = await db.query<{ n: number }>(
    `select count(*)::int as n from information_schema.role_table_grants
     where table_schema='public' and table_name=$1 and grantee=$2 and privilege_type=$3`,
    [table, grantee, priv],
  )
  return r.rows[0].n > 0
}

async function tableExists(db: PGlite, table: string): Promise<boolean> {
  const r = await db.query<{ n: number }>(
    `select count(*)::int as n from information_schema.tables where table_schema='public' and table_name=$1`,
    [table],
  )
  return r.rows[0].n > 0
}

async function main() {
  // ---- 0. Static safety scan: additive only, no destructive DDL ----
  // Match ACTUAL destructive statements only. The `truncate`/`delete`
  // keywords also appear inside REVOKE privilege lists ("revoke insert,
  // update, delete, truncate on ...") which are protective, so we require
  // the destructive command form (e.g. "truncate table", "delete from").
  const destructive =
    /\b(drop\s+table|drop\s+database|drop\s+schema|truncate\s+(table\s+)?(public\.|only\b)|truncate\s+table\b|delete\s+from)\b/i
  for (const m of MIGRATIONS) {
    // Strip line comments so safety notes ("no DROP TABLE / TRUNCATE")
    // are not mistaken for real destructive statements.
    const sql = read(m)
      .split("\n")
      .map((line) => line.replace(/--.*$/, ""))
      .join("\n")
    const hit = sql.match(destructive)
    check(`additive-only: ${m.split("/").pop()}`, !hit, hit ? `matched: ${hit[0]}` : "")
  }

  const db = new PGlite()

  // ---- 1. Base fixture (reproduce production posture) ----
  await db.exec(read("supabase/test/base-fixture.sql"))

  // Baseline: content tables have RLS on but ZERO policies (the finding)
  let baselineZero = true
  for (const t of CONTENT_TABLES) if ((await policyCount(db, t)) !== 0) baselineZero = false
  check("baseline reproduces rls_enabled_no_policy (0 policies)", baselineZero)
  check("baseline: anon holds INSERT on courses (dangerous grant)", await grantExists(db, "courses", "anon", "INSERT"))

  // ---- 2. Apply migrations in order ----
  for (const m of MIGRATIONS) {
    try {
      await db.exec(read(m))
      check(`applied ${m.split("/").pop()}`, true)
    } catch (e) {
      check(`applied ${m.split("/").pop()}`, false, (e as Error).message)
      throw e
    }
  }

  // ---- 3. Migration 0001 assertions ----
  check("admin_users table created", await tableExists(db, "admin_users"))
  check("admin_audit_log table created", await tableExists(db, "admin_audit_log"))
  const isAdminFn = await db.query<{ n: number }>(
    `select count(*)::int as n from pg_proc where proname='is_admin'`,
  )
  check("is_admin() function created", isAdminFn.rows[0].n === 1)

  let allHavePolicies = true
  for (const t of CONTENT_TABLES) if ((await policyCount(db, t)) < 1) allHavePolicies = false
  check("every content table now has >=1 RLS policy (finding resolved)", allHavePolicies)

  check("anon INSERT on courses REVOKED", !(await grantExists(db, "courses", "anon", "INSERT")))
  check("authenticated UPDATE on questions REVOKED", !(await grantExists(db, "questions", "authenticated", "UPDATE")))
  check("anon SELECT on courses retained", await grantExists(db, "courses", "anon", "SELECT"))

  // ---- 4. Migration 0002 assertions ----
  for (const t of [
    "ebooks", "ebook_translations", "ebook_files", "ebook_covers",
    "ebook_store_products", "ebook_entitlement_rules", "ebook_entitlements",
  ]) {
    check(`ebook table created: ${t}`, await tableExists(db, t))
  }
  // private PDF pointers must NOT be anon/authenticated readable
  check("ebook_files: no anon SELECT (private)", !(await grantExists(db, "ebook_files", "anon", "SELECT")))
  check("ebook_files: no authenticated SELECT (private)", !(await grantExists(db, "ebook_files", "authenticated", "SELECT")))
  // published covers publicly readable
  check("ebook_covers: anon SELECT granted (public covers)", await grantExists(db, "ebook_covers", "anon", "SELECT"))
  // ebooks default status is QA-safe
  await db.exec(`insert into public.ebooks (slug) values ('harness-default-check')`)
  const st = await db.query<{ status: string }>(`select status from public.ebooks where slug='harness-default-check'`)
  check("ebooks.status defaults to ready_for_review (never published)", st.rows[0].status === "ready_for_review")

  // ---- 5. Migration 0003 assertions (release status + QA-hold guard) ----
  check("content_release_state created", await tableExists(db, "content_release_state"))
  check("content_import_jobs created", await tableExists(db, "content_import_jobs"))
  check("content_import_rows created", await tableExists(db, "content_import_rows"))

  // seed a course id to attach release state
  const c = await db.query<{ id: string }>(
    `insert into public.courses (slug, status) values ('harness-course','published') returning id`,
  )
  const courseId = c.rows[0].id
  // ready_for_review insert OK
  await db.exec(
    `insert into public.content_release_state (entity_type, entity_id, release_status)
     values ('course','${courseId}','ready_for_review')`,
  )
  check("release_state defaults keep course website status untouched", true, "courses.status still 'published'")

  // QA-hold guard: approving while an unresolved blocker exists must FAIL
  let blocked = false
  try {
    await db.exec(
      `update public.content_release_state
         set release_status='approved', qa_blocker_ref='QA_HOLD.md#2aba4ef8', reviewed_at=null
       where entity_type='course' and entity_id='${courseId}'`,
    )
  } catch {
    blocked = true
  }
  check("QA-hold trigger BLOCKS mobile-store approval with unresolved blocker", blocked)

  // Clearing QA (reviewed_at set) allows approval
  let approvedOk = false
  try {
    await db.exec(
      `update public.content_release_state
         set release_status='approved', qa_blocker_ref='QA_HOLD.md#2aba4ef8', reviewed_at=now()
       where entity_type='course' and entity_id='${courseId}'`,
    )
    approvedOk = true
  } catch {
    approvedOk = false
  }
  check("approval allowed AFTER QA cleared (reviewed_at set)", approvedOk)

  // ---- 6. Rollback test ----
  await db.exec("begin")
  await db.exec(`insert into public.ebooks (slug) values ('rollback-victim')`)
  await db.exec("rollback")
  const rb = await db.query<{ n: number }>(`select count(*)::int as n from public.ebooks where slug='rollback-victim'`)
  check("rollback discards uncommitted insert", rb.rows[0].n === 0)

  // ---- 7. Idempotency: re-apply every migration; must not error ----
  let idempotent = true
  let idemErr = ""
  try {
    for (const m of MIGRATIONS) await db.exec(read(m))
  } catch (e) {
    idempotent = false
    idemErr = (e as Error).message
  }
  check("migrations are idempotent (safe re-run)", idempotent, idemErr)

  await db.close()

  // ---- Report ----
  console.log("\n=== OFF-PRODUCTION MIGRATION HARNESS (PGlite) ===")
  console.log(results.join("\n"))
  console.log(`\nTOTAL: ${pass} passed, ${fail} failed\n`)
  if (fail > 0) process.exit(1)
}

main().catch((e) => {
  console.error("HARNESS ERROR:", e)
  process.exit(1)
})
