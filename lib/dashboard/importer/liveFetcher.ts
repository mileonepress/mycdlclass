import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"
import type { FetchExisting } from "./dryRun"
import type { ImportEntity } from "./diff"

/**
 * READ-ONLY existing-row fetcher against the LIVE primary Supabase project.
 * Used by the importer dry-run in preview. Performs SELECT-only queries in
 * batches; it can NEVER write. eBook entities are not yet present in
 * production (migration 0002 unapplied), so they resolve to empty — every
 * eBook row is correctly reported as a CREATE in preview.
 */

// Live tables (interactive content already in production). eBook tables are
// intentionally excluded until 0002 is applied.
const LIVE_TABLES: ReadonlySet<ImportEntity> = new Set([
  "courses",
  "course_translations",
  "media_assets",
  "sections",
  "section_translations",
  "lessons",
  "lesson_translations",
  "lesson_blocks",
  "block_translations",
  "questions",
  "question_translations",
  "answer_choices",
  "choice_translations",
  "practice_tests",
  "practice_test_questions",
])

// For courses we also need `status` to evaluate the QA-hold conflict.
const EXTRA_COLS: Partial<Record<ImportEntity, string>> = { courses: "status,slug" }

// Keep well under PostgREST URL length limits: each id in an `.in()` filter
// adds ~37 chars to the query string, so batch conservatively.
const BATCH = 80

export const fetchExistingLive: FetchExisting = async (entity, ids) => {
  const out = new Map<string, Record<string, unknown>>()
  if (!LIVE_TABLES.has(entity) || ids.length === 0) return out

  const db = createAdminClient()
  const cols = ["id", EXTRA_COLS[entity]].filter(Boolean).join(",")

  for (let i = 0; i < ids.length; i += BATCH) {
    const chunk = ids.slice(i, i + BATCH)
    const { data, error } = await db
      .from(entity as string)
      .select(cols)
      .in("id", chunk)
    if (error) {
      console.error(`[v0] fetchExistingLive ${entity} error:`, error.message)
      continue
    }
    for (const row of data ?? []) {
      const r = row as Record<string, unknown>
      out.set(String(r.id), r)
    }
  }
  return out
}
