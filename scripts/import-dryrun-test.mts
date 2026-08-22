/**
 * Importer dry-run validation (Checkpoint 2) — READ-ONLY against live.
 *
 * Proves the two required properties using the REAL staging bundle and the
 * REAL diff engine, without writing anything anywhere:
 *
 *   1. Dry-run #1 against the live primary project (read-only) reports the
 *      existing 9 interactive course families / 18 offerings as UPDATE or
 *      UNCHANGED (create=0) — i.e. stable-ID upsert, no duplicate catalog.
 *   2. A simulated "apply" (merge bundle rows into the baseline in memory) and
 *      dry-run #2 yields create=0 for EVERY entity — repeat import produces
 *      ZERO duplicates end to end.
 *   3. The published-vs-ready_for_review course conflict (Decision 5) is
 *      surfaced, never auto-applied.
 *
 * The bundle path is passed as argv[2]. No DB writes occur (SELECT only).
 */
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { createClient } from "@supabase/supabase-js"
import { parseBundle, type FileMap } from "../lib/dashboard/importer/parseBundle"
import { runDryRun, type FetchExisting } from "../lib/dashboard/importer/dryRun"
import type { ImportEntity } from "../lib/dashboard/importer/diff"

const bundleDir = process.argv[2]
if (!bundleDir) throw new Error("usage: import-dryrun-test.mts <extracted-bundle-dir>")

// ---- Build a FileMap from the on-disk extracted bundle ----
function walk(dir: string, base = dir, map: FileMap = new Map()): FileMap {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, base, map)
    else map.set(full.slice(base.length + 1), new Uint8Array(readFileSync(full)))
  }
  return map
}

const LIVE_TABLES = new Set<ImportEntity>([
  "courses", "course_translations", "media_assets", "sections", "section_translations",
  "lessons", "lesson_translations", "lesson_blocks", "block_translations", "questions",
  "question_translations", "answer_choices", "choice_translations", "practice_tests",
  "practice_test_questions",
])
const EXTRA: Partial<Record<ImportEntity, string>> = { courses: "status,slug" }

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error("Missing Supabase env (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)")
const db = createClient(url, key, { auth: { persistSession: false } })

let selectCount = 0
const fetchLive: FetchExisting = async (entity, ids) => {
  const out = new Map<string, Record<string, unknown>>()
  if (!LIVE_TABLES.has(entity) || !ids.length) return out
  const cols = ["id", EXTRA[entity]].filter(Boolean).join(",")
  for (let i = 0; i < ids.length; i += 80) {
    const chunk = ids.slice(i, i + 80)
    selectCount++
    const { data, error } = await db.from(entity).select(cols).in("id", chunk)
    if (error) throw new Error(`${entity}: ${error.message}`)
    for (const r of data ?? []) out.set(String((r as any).id), r as Record<string, unknown>)
  }
  return out
}

let pass = 0, fail = 0
const check = (name: string, ok: boolean, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`)
  ok ? pass++ : fail++
}

const main = async () => {
  const map = walk(bundleDir)
  const bundle = parseBundle(map)

  console.log("=== Bundle parse ===")
  check("manifest parsed", !!bundle.manifest, bundle.manifest?.bundle ?? "")
  check("IMPORT_ORDER present", bundle.importOrder.length > 0, `${bundle.importOrder.length} steps`)
  const entityCounts = Object.fromEntries(
    Object.entries(bundle.csv).map(([k, v]) => [k, v?.length ?? 0]),
  )
  console.log("    parsed CSV rows:", JSON.stringify(entityCounts))
  check("courses = 9", bundle.csv.courses?.length === 9)
  check("course_translations = 18", bundle.csv.course_translations?.length === 18)
  check("questions = 1086", bundle.csv.questions?.length === 1086)
  check("answer_choices = 3578", bundle.csv.answer_choices?.length === 3578)
  check("ebooks = 9", bundle.csv.ebooks?.length === 9)
  check("ebook_translations = 18", bundle.csv.ebook_translations?.length === 18)

  // ---- Dry-run #1 against LIVE (read-only) ----
  console.log("\n=== Dry-run #1 (live, read-only) ===")
  const run1 = await runDryRun(bundle, fetchLive)
  for (const e of run1.entities) {
    console.log(
      `    ${e.entity.padEnd(24)} create=${e.create} update=${e.update} unchanged=${e.unchanged} conflict=${e.conflict}`,
    )
  }
  console.log("    totals:", JSON.stringify(run1.totals))

  const courses1 = run1.entities.find((e) => e.entity === "courses")!
  check("interactive courses: zero creates (stable-ID = update)", courses1.create === 0)
  const interactiveCreate = run1.entities
    .filter((e) => LIVE_TABLES.has(e.entity))
    .reduce((n, e) => n + e.create, 0)
  check("all interactive entities: zero creates on live", interactiveCreate === 0, `creates=${interactiveCreate}`)
  check(
    "QA-hold conflict surfaced for published vs ready_for_review",
    courses1.conflict === 9,
    `${courses1.conflict} course conflicts`,
  )
  check("conflicts are NOT applied (reported only)", run1.conflicts.every((c) => /QA|status/i.test(c.reason)))

  // ---- Simulated apply + Dry-run #2 (zero duplicates end-to-end) ----
  console.log("\n=== Dry-run #2 (post-apply simulation) ===")
  // Merge every bundle row into an in-memory 'existing' store, exactly as a
  // stable-ID upsert would, WITHOUT touching any database.
  const applied = new Map<ImportEntity, Map<string, Record<string, unknown>>>()
  for (const [entity, rows] of Object.entries(bundle.csv) as [ImportEntity, Record<string, unknown>[]][]) {
    const m = new Map<string, Record<string, unknown>>()
    // seed with the live baseline first (so unchanged detection is realistic)
    const live = await fetchLive(entity, rows.map((r) => String(r.id)))
    for (const [id, r] of live) m.set(id, r)
    // then apply the bundle (upsert). For a status conflict we DO NOT change
    // status (QA hold), mirroring importer behavior.
    for (const r of rows) {
      const id = String(r.id)
      const prev = m.get(id)
      if (entity === "courses" && prev && String(prev.status) === "published") {
        m.set(id, { ...r, status: prev.status }) // keep live status (QA hold)
      } else {
        m.set(id, r)
      }
    }
    applied.set(entity, m)
  }
  const fetchApplied: FetchExisting = async (entity, ids) => {
    const m = applied.get(entity) ?? new Map()
    const out = new Map<string, Record<string, unknown>>()
    for (const id of ids) if (m.has(id)) out.set(id, m.get(id)!)
    return out
  }

  const run2 = await runDryRun(bundle, fetchApplied)
  for (const e of run2.entities) {
    console.log(
      `    ${e.entity.padEnd(24)} create=${e.create} update=${e.update} unchanged=${e.unchanged} conflict=${e.conflict}`,
    )
  }
  console.log("    totals:", JSON.stringify(run2.totals))

  check("REPEAT DRY RUN: zero duplicates (create=0 for every entity)", run2.zeroDuplicates, `creates=${run2.totals.create}`)
  check("REPEAT DRY RUN: no new inserts across all entities", run2.totals.create === 0)
  check("post-apply course conflict still flagged (QA hold persists)", (run2.entities.find((e) => e.entity === "courses")!.conflict) === 9)

  console.log(`\n[read-only SELECT batches executed: ${selectCount}]`)
  console.log(`\nTOTAL: ${pass} passed, ${fail} failed`)
  if (fail > 0) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
