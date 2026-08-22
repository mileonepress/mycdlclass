import "server-only"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

/**
 * Service-role Supabase client. Bypasses RLS — use ONLY in trusted
 * server contexts (Stripe webhook, post-checkout verification).
 * Never expose this client or its key to the browser.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  )
}
