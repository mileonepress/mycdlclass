import { diffEntity, hasZeroDuplicates } from "./diff"
import type { EntityChangeCounts, ImportConflict, ImportEntity } from "./diff"
import type { ParsedBundle } from "./parseBundle"

/**
 * Dry-run orchestrator (Checkpoint 2). Pure coordination: it walks the bundle
 * in dependency order and diffs each entity against whatever the injected
 * `fetchExisting` returns. NEVER writes. The injection keeps it runnable
 * against a local Postgres, read-only live data, or an in-memory fixture.
 */

export type FetchExisting = (
  entity: ImportEntity,
  ids: string[],
) => Promise<Map<string, Record<string, unknown>>>

export interface DryRunResult {
  ranAt: string
  entities: EntityChangeCounts[]
  conflicts: ImportConflict[]
  totals: { create: number; update: number; unchanged: number; conflict: number }
  zeroDuplicates: boolean
}

const ORDER: ImportEntity[] = [
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
  "ebooks",
  "ebook_translations",
  "ebook_files",
  "ebook_covers",
]

export async function runDryRun(bundle: ParsedBundle, fetchExisting: FetchExisting): Promise<DryRunResult> {
  const entities: EntityChangeCounts[] = []
  const conflicts: ImportConflict[] = []

  for (const entity of ORDER) {
    const rows = bundle.csv[entity]
    if (!rows?.length) continue
    const ids = rows.map((r) => String(r.id ?? "")).filter(Boolean)
    const existingById = await fetchExisting(entity, ids)
    const { counts, conflicts: c } = diffEntity({ entity, bundleRows: rows, existingById })
    entities.push(counts)
    conflicts.push(...c)
  }

  const totals = entities.reduce(
    (acc, e) => ({
      create: acc.create + e.create,
      update: acc.update + e.update,
      unchanged: acc.unchanged + e.unchanged,
      conflict: acc.conflict + e.conflict,
    }),
    { create: 0, update: 0, unchanged: 0, conflict: 0 },
  )

  return {
    ranAt: new Date().toISOString(),
    entities,
    conflicts,
    totals,
    zeroDuplicates: hasZeroDuplicates(entities),
  }
}
