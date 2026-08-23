import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * QA-hold / release-conflict computation (Decision 5).
 *
 * The staging bundle marks all content `ready_for_review` for mobile-store
 * release. The nine live course families are `published` for the website.
 * These two facts CONFLICT: the content must be QA-cleared before any
 * mobile-store publication, but website availability must NOT change.
 *
 * This helper reads live status (READ-ONLY) and reports, per family, whether a
 * release conflict exists. It NEVER writes and NEVER changes course status.
 * The proposed `release_status` column (migration 0003) is the production home
 * for this state; until it is applied we derive the conflict at read time.
 */

export type ReleaseStatus = "ready_for_review" | "qa_hold" | "approved" | "rejected"

export interface QaHoldRow {
  courseId: string
  slug: string
  liveStatus: string // website availability (unchanged)
  bundleIntent: "ready_for_review"
  releaseStatus: ReleaseStatus // mobile-store release gate (derived; default hold)
  conflict: boolean // live 'published' vs bundle 'ready_for_review'
  blocksMobileRelease: boolean
}

export interface QaHoldSummary {
  rows: QaHoldRow[]
  conflicts: number
  websitePublished: number
  mobileReleaseBlocked: number
}

export async function getQaHoldSummary(): Promise<QaHoldSummary> {
  const db = createAdminClient()
  const { data: courses, error } = await db
    .from("courses")
    .select("id,slug,status")
    .order("sort_order", { ascending: true })

  if (error || !courses) {
    console.log("[v0] getQaHoldSummary error:", error?.message)
    return { rows: [], conflicts: 0, websitePublished: 0, mobileReleaseBlocked: 0 }
  }

  // Authoritative release state is now persisted in content_release_state
  // (migration 0003, populated at the repair checkpoint). Read it and use the
  // stored release_status; fall back to read-time derivation if a row is
  // missing. This helper still NEVER writes and NEVER changes course status.
  const persisted = new Map<string, ReleaseStatus>()
  const { data: releaseRows } = await (db as unknown as {
    from: (t: string) => {
      select: (c: string) => {
        eq: (k: string, v: string) => Promise<{ data: { entity_id: string; release_status: string }[] | null }>
      }
    }
  })
    .from("content_release_state")
    .select("entity_id,release_status")
    .eq("entity_type", "course")
  for (const r of releaseRows ?? []) {
    persisted.set(r.entity_id, r.release_status as ReleaseStatus)
  }

  const rows: QaHoldRow[] = courses.map((c) => {
    const liveStatus = String(c.status)
    const conflict = liveStatus === "published"
    // Prefer the persisted release_status; derive only when no row exists.
    const releaseStatus: ReleaseStatus =
      persisted.get(c.id) ?? (conflict ? "qa_hold" : "ready_for_review")
    return {
      courseId: c.id,
      slug: c.slug,
      liveStatus,
      bundleIntent: "ready_for_review",
      releaseStatus,
      conflict,
      blocksMobileRelease: releaseStatus !== "approved", // held until QA clears/approved
    }
  })

  return {
    rows,
    conflicts: rows.filter((r) => r.conflict).length,
    websitePublished: rows.filter((r) => r.liveStatus === "published").length,
    mobileReleaseBlocked: rows.filter((r) => r.blocksMobileRelease).length,
  }
}
