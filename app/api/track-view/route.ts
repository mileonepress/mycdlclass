import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Paths we never want to record as marketing/traffic page views.
const IGNORED_PREFIXES = ["/admin", "/login", "/api", "/_next"]

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      path?: string
      referrer?: string
      sessionId?: string
    }

    const path = typeof body.path === "string" ? body.path.slice(0, 512) : null
    if (!path || IGNORED_PREFIXES.some((p) => path.startsWith(p))) {
      // Silently accept but do not record ignored paths.
      return NextResponse.json({ ok: true, skipped: true })
    }

    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 512) : null
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 64) : null

    // Best-effort geo + UA from request headers (populated on Vercel).
    const country = request.headers.get("x-vercel-ip-country")
    const userAgent = request.headers.get("user-agent")?.slice(0, 512) || null

    const db = createAdminClient()
    const { error } = await db.from("page_views").insert({
      path,
      referrer: referrer || null,
      session_id: sessionId,
      country: country || null,
      user_agent: userAgent,
    })

    if (error) {
      console.log("[v0] track-view insert error:", error.message)
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.log("[v0] track-view error:", (err as Error).message)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
