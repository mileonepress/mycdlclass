import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Finds a Supabase auth user by email using the service-role admin API.
 * Pages through users (most stores are small enough) and matches
 * case-insensitively. Returns null if no user is found.
 */
export async function findUserByEmail(
  email: string,
): Promise<{ id: string; email: string } | null> {
  const target = email.trim().toLowerCase()
  if (!target) return null

  const admin = createAdminClient()
  const perPage = 1000
  // Cap the scan to avoid runaway loops on very large stores.
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) {
      console.error("[v0] findUserByEmail error:", error.message)
      return null
    }
    const users = data?.users || []
    const match = users.find((u) => (u.email || "").toLowerCase() === target)
    if (match) return { id: match.id, email: match.email || target }
    if (users.length < perPage) break
  }
  return null
}
