/**
 * Course Dashboard Adapter — DESIGN CONTRACT (Checkpoint 1)
 * ---------------------------------------------------------------------------
 * Type-only contract for the secured course management dashboard. No runtime
 * logic, no data access, no UI. It exists so Checkpoint 2 can implement
 * against a reviewed, compile-checked shape that is bound to the LIVE schema
 * (lib/supabase/database.types.ts).
 *
 * Live facts encoded here (verified read-only in Checkpoint 1):
 *   - 9 parent course families (public.courses, all course_type='interactive')
 *   - 18 localized offerings (public.course_translations, en=9 / es=9)
 *   - human-readable text lives ONLY in *_translations tables
 *   - stable keys: courses.slug (business) + courses.id (uuid)
 */
import type { Database } from "@/lib/supabase/database.types"

type Tables = Database["public"]["Tables"]
export type CourseRow = Tables["courses"]["Row"]
export type CourseTranslationRow = Tables["course_translations"]["Row"]
export type MediaAssetRow = Tables["media_assets"]["Row"]

export type LanguageCode = "en" | "es"
export type ContentStatus = "draft" | "ready_for_review" | "published" | "archived"

/** Per-language translation completeness for one course family. */
export interface TranslationCompleteness {
  language: LanguageCode
  hasTitle: boolean
  hasShortDescription: boolean
  hasSeo: boolean
  /** 0..1 fraction of expected localized fields present. */
  completeness: number
}

/** One localized offering (a course family rendered in a single language). */
export interface LocalizedCourseOffering {
  courseId: CourseRow["id"]
  slug: CourseRow["slug"]
  language: LanguageCode
  title: string | null
  shortDescription: string | null
  status: ContentStatus
}

/** Aggregated row for the course-family list view (one per parent course). */
export interface CourseFamilySummary {
  id: CourseRow["id"]
  slug: CourseRow["slug"]
  category: CourseRow["category"]
  courseType: CourseRow["course_type"]
  status: ContentStatus
  isFree: CourseRow["is_free"]
  priceCents: CourseRow["price_cents"]
  estimatedMinutes: CourseRow["estimated_minutes"]
  sortOrder: CourseRow["sort_order"]
  coverPath: CourseRow["thumbnail_path"]
  /** Derived counts (computed via joins, never stored). */
  offeringCount: number // localized editions present (target 2: en+es)
  sectionCount: number
  lessonCount: number
  questionCount: number
  practiceTestCount: number
  translations: TranslationCompleteness[]
  /** Store IDs are sourced from the eBook/store mapping in Checkpoint 2. */
  storeProductIds: { apple: string | null; google: string | null }[]
}

/** Full editable tree for a single course family (read side). */
export interface CourseFamilyDetail extends CourseFamilySummary {
  offerings: LocalizedCourseOffering[]
  coverAsset: MediaAssetRow | null
}

/** Catalog header numbers surfaced in the dashboard ("9 families / 18 offerings"). */
export interface CatalogTotals {
  families: number
  localizedOfferings: number
  byStatus: Record<ContentStatus, number>
}

/**
 * Read/write surface the Checkpoint 2 implementation must provide.
 * All methods are server-only (service-role) and admin-authorized.
 * Every mutation writes an admin_audit_log entry and NEVER auto-publishes.
 */
export interface CourseAdminAdapter {
  listCourseFamilies(): Promise<CourseFamilySummary[]>
  getCourseFamily(id: CourseRow["id"]): Promise<CourseFamilyDetail | null>
  getCatalogTotals(): Promise<CatalogTotals>

  updateCourseMeta(
    id: CourseRow["id"],
    patch: Partial<
      Pick<CourseRow, "category" | "is_free" | "price_cents" | "estimated_minutes" | "sort_order" | "thumbnail_path">
    >,
  ): Promise<void>

  upsertTranslation(
    courseId: CourseRow["id"],
    language: LanguageCode,
    patch: Partial<Pick<CourseTranslationRow, "title" | "short_description" | "seo_title" | "seo_description">>,
  ): Promise<void>

  /** Status changes are deliberate and audited; never a side effect of edits. */
  setCourseStatus(id: CourseRow["id"], status: ContentStatus): Promise<void>
}
