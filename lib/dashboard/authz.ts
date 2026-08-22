import "server-only"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/adminAuth"

/**
 * Dashboard authorization (Checkpoint 2).
 *
 * PREVIEW POSTURE (no production migration applied yet):
 *   Admin identity is resolved from the server-verified Supabase session
 *   combined with the ADMIN_EMAILS allowlist (same mechanism the existing
 *   /admin area uses). This requires NO schema change, so the secured
 *   dashboard can be validated in preview without touching production.
 *
 * PRODUCTION POSTURE (after proposed migration 0001 is applied):
 *   Authorization moves to the DB-backed `public.admin_users` role table and
 *   a `requireAdmin()` check enforced in every server action / route handler.
 *   The env allowlist remains as a bootstrap fallback. See
 *   supabase/migrations/proposed/0001_admin_authorization_and_content_rls.sql.
 *
 * This helper is server-only and must be called at the top of every
 * /dashboard page, server action, and route handler.
 */
export interface DashboardAdmin {
  id: string
  email: string
}

export async function getDashboardAdmin(): Promise<DashboardAdmin | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return { id: user.id, email: user.email ?? "" }
}

/** Redirects to /login (non-authed) or / (authed non-admin) when unauthorized. */
export async function requireDashboardAdmin(): Promise<DashboardAdmin> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login?next=/dashboard")
  if (!isAdminEmail(user.email)) redirect("/")
  return { id: user.id, email: user.email ?? "" }
}
