import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * eBook storage access layer (Checkpoint 2, Decision 3).
 *
 * Target design implemented here:
 *   - Public cover images  -> `public-assets` bucket (stable public URL).
 *   - Private PDF eBooks    -> `ebook-files` bucket (server-side entitlement
 *     check, then a SHORT-LIVED signed URL). PDFs are never publicly listable.
 *
 * PREVIEW SAFETY: this module is READ/SIGN ONLY. There is NO upload / move /
 * delete path here, so preview cannot mutate production storage. Uploads land
 * in a separate, production-approved migration step. Vercel Blob remains a
 * read-only fallback until every migrated object is checksum-verified.
 */

export const COVER_BUCKET = "public-assets"
export const EBOOK_BUCKET = "ebook-files"
const SIGNED_URL_TTL_SECONDS = 60 // short-lived

/** Stable public URL for a cover image in `public-assets`. */
export function coverPublicUrl(storagePath: string): string {
  const db = createAdminClient()
  const { data } = db.storage.from(COVER_BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

/**
 * Verify the user is entitled to this eBook, then return a short-lived signed
 * URL for the private PDF. Returns null when the object is not present in the
 * target storage yet (expected in preview, since files are uploaded during the
 * production-approved migration, not during Checkpoint 2).
 */
export async function getEntitledEbookUrl(params: {
  userId: string
  ebookSlug: string
  language: "en" | "es"
  storagePath: string
}): Promise<{ url: string } | { error: "not_entitled" | "not_available" }> {
  const { userId, ebookSlug, language, storagePath } = params
  const entitled = await userHasEbookEntitlement(userId, ebookSlug)
  if (!entitled) return { error: "not_entitled" }

  const db = createAdminClient()
  const { data, error } = await db.storage
    .from(EBOOK_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS, { download: `${ebookSlug}-${language}.pdf` })

  if (error || !data?.signedUrl) {
    console.log(`[v0] ebook signed-url unavailable (${storagePath}):`, error?.message ?? "no object")
    return { error: "not_available" }
  }
  return { url: data.signedUrl }
}

/**
 * Entitlement check. The paid interactive course entitlement INCLUDES the
 * matching PDF eBook (approved catalog convention), so eBook access is granted
 * when the user is entitled to the eBook's parent course. Read-only.
 */
export async function userHasEbookEntitlement(userId: string, ebookSlug: string): Promise<boolean> {
  if (!userId) return false
  const db = createAdminClient()

  // eBook slug == parent course slug (verified in the staging bundle).
  const { data: course } = await db.from("courses").select("id,is_free").eq("slug", ebookSlug).maybeSingle()
  if (!course) return false
  if (course.is_free) return true

  const { data: ent, error } = await db
    .from("course_entitlements")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", course.id)
    .maybeSingle()

  if (error) {
    console.log("[v0] entitlement lookup error:", error.message)
    return false
  }
  return !!ent
}
