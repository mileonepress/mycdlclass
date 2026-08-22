import "server-only"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

/** The currently authenticated Supabase user, or null. */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Returns true if the user holds an entitlement for the given course.
 * Uses the service-role client so the check is reliable regardless of RLS.
 */
export async function hasCourseAccess(userId: string, courseId: string): Promise<boolean> {
  const db = createAdminClient()
  const { data, error } = await db
    .from("course_entitlements")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("[v0] hasCourseAccess error:", error.message)
    return false
  }
  return !!data
}

/**
 * Central gate for a whole course.
 * - Free courses: open to everyone.
 * - Paid courses: only logged-in users with an entitlement.
 */
export async function canAccessCourse(
  course: { id: string; isFree: boolean },
  userId: string | null,
): Promise<boolean> {
  if (course.isFree) return true
  if (!userId) return false
  return hasCourseAccess(userId, course.id)
}

/** All course IDs the user is entitled to. */
export async function getEntitledCourseIds(userId: string): Promise<string[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from("course_entitlements")
    .select("course_id")
    .eq("user_id", userId)

  if (error) {
    console.error("[v0] getEntitledCourseIds error:", error.message)
    return []
  }
  return Array.from(new Set((data || []).map((row) => row.course_id as string)))
}
