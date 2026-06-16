import { createClient } from "@/lib/supabase/server"
import { getCourseProduct } from "@/lib/courseProducts"

/**
 * A course is "paid" if it appears in the course product catalog.
 * Free courses are open to everyone.
 */
export function isPaidCourse(slug: string): boolean {
  return getCourseProduct(slug) !== null
}

/**
 * Returns true if the given user has a completed purchase for the course slug.
 * Uses the caller's RLS-scoped client; users can only read their own purchases.
 */
export async function hasPurchased(userId: string, slug: string): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("course_slug", slug)
    .eq("status", "completed")
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("[v0] hasPurchased error:", error.message)
    return false
  }
  return !!data
}

/**
 * Central access check used to gate paid course content.
 * - Free courses: always accessible.
 * - Paid courses: accessible only to logged-in users with a completed purchase.
 */
export async function canAccessCourse(
  slug: string,
  userId: string | null,
): Promise<boolean> {
  if (!isPaidCourse(slug)) return true
  if (!userId) return false
  return hasPurchased(userId, slug)
}

/**
 * Returns the set of paid course slugs the user has purchased.
 */
export async function getPurchasedSlugs(userId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("purchases")
    .select("course_slug")
    .eq("user_id", userId)
    .eq("status", "completed")

  if (error) {
    console.error("[v0] getPurchasedSlugs error:", error.message)
    return []
  }
  return Array.from(new Set((data || []).map((row) => row.course_slug)))
}
