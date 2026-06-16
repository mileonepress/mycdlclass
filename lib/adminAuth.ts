import "server-only"
import { createClient } from "@/lib/supabase/server"

/**
 * Admin access is granted to emails listed in the ADMIN_EMAILS env var
 * (comma-separated). There is no is_admin column in the schema, so this
 * env-based allowlist keeps owner-only pages locked down without a migration.
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}

/**
 * Returns the current authenticated user only if they are an admin.
 * Returns null otherwise (not logged in, or logged in but not an admin).
 */
export async function getAdminUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return user
}
