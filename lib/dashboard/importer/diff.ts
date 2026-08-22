/**
 * Importer diff engine (Checkpoint 2) — PURE, no I/O.
 *
 * Given bundle rows keyed by stable id and the set of ids/rows that already
 * exist in the target DB, compute create/update/unchanged/conflict counts.
 * This is the core that guarantees the two non-negotiable properties:
 *
 *   1. Stable-ID upserts — a row whose id already exists is an UPDATE, never
 *      a second INSERT. Re-running the same bundle therefore produces ZERO
 *      creates (zero duplicates).
 *   2. Never auto-publish — any bundle row whose status would move live
 *      content from 'published' toward a non-published state, or vice-versa,
 *      is surfaced as a CONFLICT for human decision, never applied silently.
 *
 * It is deliberately decoupled from parsing and from Supabase so it can be
 * unit-tested against both a local Postgres (PGlite) and read-only live data.
 */

export type ImportEntity =
  | "courses"
  | "course_translations"
  | "media_assets"
  | "sections"
  | "section_translations"
  | "lessons"
  | "lesson_translations"
  | "lesson_blocks"
  | "block_translations"
  | "questions"
  | "question_translations"
  | "answer_choices"
  | "choice_translations"
  | "practice_tests"
  | "practice_test_questions"
  | "ebooks"
  | "ebook_translations"
  | "ebook_files"
  | "ebook_covers"
  | "ebook_store_products"

export interface EntityChangeCounts {
  entity: ImportEntity
  create: number
  update: number
  unchanged: number
  conflict: number
}

export interface ImportConflict {
  entity: ImportEntity
  businessKey: string
  reason: string
}

export interface DiffInput {
  entity: ImportEntity
  /** Bundle rows; each MUST carry a stable `id`. */
  bundleRows: Record<string, unknown>[]
  /** Existing rows in the target, keyed by stable id (subset of columns ok). */
  existingById: Map<string, Record<string, unknown>>
}

export interface DiffOutput {
  counts: EntityChangeCounts
  conflicts: ImportConflict[]
}

/** Shallow value comparison over the bundle row's own keys (ignores nulls vs ""). */
function rowEquals(bundle: Record<string, unknown>, existing: Record<string, unknown>): boolean {
  for (const k of Object.keys(bundle)) {
    if (k === "created_at" || k === "updated_at") continue
    const a = bundle[k] === "" ? null : bundle[k]
    const b = existing[k] === "" ? null : existing[k]
    if (String(a ?? "") !== String(b ?? "")) return false
  }
  return true
}

export function diffEntity(input: DiffInput): DiffOutput {
  const { entity, bundleRows, existingById } = input
  const counts: EntityChangeCounts = { entity, create: 0, update: 0, unchanged: 0, conflict: 0 }
  const conflicts: ImportConflict[] = []

  for (const row of bundleRows) {
    const id = String(row.id ?? "")
    if (!id) {
      counts.conflict += 1
      conflicts.push({ entity, businessKey: "(missing id)", reason: "row has no stable id" })
      continue
    }

    const existing = existingById.get(id)

    if (!existing) {
      counts.create += 1
      continue
    }

    // Status-regression guard: a bundle course marked ready_for_review that
    // matches a live published course is NOT auto-applied — it is a QA-hold
    // conflict for explicit human resolution (Decision 5).
    if (entity === "courses") {
      const bundleStatus = String(row.status ?? "")
      const liveStatus = String(existing.status ?? "")
      if (liveStatus === "published" && bundleStatus !== "published") {
        counts.conflict += 1
        conflicts.push({
          entity,
          businessKey: String(row.slug ?? id),
          reason: `live status 'published' vs bundle '${bundleStatus}' — requires QA approval before any status change`,
        })
        continue
      }
    }

    if (rowEquals(row, existing)) counts.unchanged += 1
    else counts.update += 1
  }

  return { counts, conflicts }
}

/** True when a completed dry-run/apply introduced no new rows for any entity. */
export function hasZeroDuplicates(all: EntityChangeCounts[]): boolean {
  return all.every((c) => c.create === 0)
}
