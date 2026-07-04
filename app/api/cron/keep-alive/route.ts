import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Keep-alive cron.
 *
 * Supabase Free-tier projects auto-pause after ~7 days of database
 * inactivity. Vercel Cron hits this route on a schedule so the database
 * receives a lightweight query regularly and never idles into a pause.
 *
 * Secured with CRON_SECRET: Vercel automatically sends
 * `Authorization: Bearer <CRON_SECRET>` when the env var is set.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
    }
  }

  try {
    const db = createAdminClient()
    // Cheapest possible query: count-only, no rows returned.
    const { error } = await db.from("page_views").select("id", { count: "exact", head: true })
    if (error) throw error

    return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
