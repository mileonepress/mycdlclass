/**
 * Bulk Content Importer — DESIGN CONTRACT (Checkpoint 1)
 * ---------------------------------------------------------------------------
 * Type-only contract for the seamless bulk import/update center. No runtime
 * logic. Defines the job model, dependency order, dry-run/apply results,
 * conflict accounting, and rollback semantics the Checkpoint 2 implementation
 * must satisfy.
 *
 * Non-negotiable rules encoded here:
 *   - stable-ID upserts (onConflict on uuid / business slug) — never
 *     delete-and-recreate, never duplicate the existing 9-course catalog.
 *   - every imported/changed row defaults to status 'ready_for_review';
 *     publication is a SEPARATE, explicit, audited action after QA.
 *   - server-side jobs only; ZIP parsed server-side from private staging,
 *     never in the browser.
 */

export type LanguageCode = "en" | "es"

/**
 * Dependency-aware import order (parents before children). Matches the live
 * FK graph verified in Checkpoint 1 (all children ON DELETE CASCADE).
 */
export const IMPORT_ORDER = [
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
  // eBook catalog (after proposed migration 0002 is applied)
  "ebooks",
  "ebook_translations",
  "ebook_files",
  "ebook_covers",
  "ebook_store_products",
] as const

export type ImportEntity = (typeof IMPORT_ORDER)[number]

export type JobPhase =
  | "uploaded"
  | "validating"
  | "dry_run"
  | "awaiting_confirmation"
  | "applying"
  | "completed"
  | "failed"
  | "rolled_back"

/** Per-entity accounting produced by both dry-run and apply. */
export interface EntityChangeCounts {
  entity: ImportEntity
  create: number
  update: number
  unchanged: number
  conflict: number
}

export interface ImportConflict {
  entity: ImportEntity
  businessKey: string // slug / composite key
  reason: string // e.g. "status would regress", "checksum mismatch"
}

export interface ValidationIssue {
  entity: ImportEntity
  row: number
  field?: string
  severity: "error" | "warning"
  message: string
}

/** Result of manifest + CSV + checksum validation (no DB writes). */
export interface ValidationReport {
  ok: boolean
  manifestVersion: string | null
  checksumsVerified: boolean
  importOrderVerified: boolean
  issues: ValidationIssue[]
}

/** Result of a dry run (no DB writes) or an applied run. */
export interface ImportRunResult {
  jobId: string
  phase: JobPhase
  dryRun: boolean
  counts: EntityChangeCounts[]
  conflicts: ImportConflict[]
  /** Downloadable row-level error report path (private storage). */
  errorReportPath: string | null
  startedAt: string
  finishedAt: string | null
}

/** Persisted job record (backs import_jobs table; resumable). */
export interface ImportJob {
  id: string
  sourceLabel: string // e.g. bundle filename (no binary committed)
  stagingObjectPath: string // private staging location, server-only
  phase: JobPhase
  cursorEntity: ImportEntity | null // for resumability
  cursorOffset: number
  createdBy: string // admin user id
  createdAt: string
  updatedAt: string
}

/**
 * Importer surface for Checkpoint 2. All methods are server-only and
 * admin-authorized; all applied mutations are audited.
 */
export interface ContentImporter {
  /** Accept a server-side staged ZIP; returns a job in "uploaded". */
  createJob(input: { sourceLabel: string; stagingObjectPath: string; createdBy: string }): Promise<ImportJob>
  validate(jobId: string): Promise<ValidationReport>
  dryRun(jobId: string): Promise<ImportRunResult>
  /** Applies stable-ID upserts in IMPORT_ORDER; content -> 'ready_for_review'. */
  apply(jobId: string): Promise<ImportRunResult>
  /** Resume a partially-applied job from its persisted cursor. */
  resume(jobId: string): Promise<ImportRunResult>
  /** Reverse a completed/failed apply using the audit trail. */
  rollback(jobId: string): Promise<ImportRunResult>
  getJob(jobId: string): Promise<ImportJob | null>
}
