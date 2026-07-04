import { NextResponse } from "next/server"
import { getAdminUser } from "@/lib/adminAuth"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Escape a single CSV cell (RFC 4180). */
function cell(value: unknown): string {
  if (value == null) return ""
  const s = String(value)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(cell).join(",")]
  for (const row of rows) lines.push(row.map(cell).join(","))
  return lines.join("\r\n")
}

export async function GET(request: Request) {
  // Owner-only.
  const admin = await getAdminUser()
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const type = new URL(request.url).searchParams.get("type") || "purchases"
  const db = createAdminClient()
  const stamp = new Date().toISOString().slice(0, 10)

  if (type === "subscribers") {
    const { data, error } = await db
      .from("email_subscribers")
      .select("email, first_name, language, kit_subscriber_id, created_at")
      .order("created_at", { ascending: false })
      .limit(10000)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const csv = toCsv(
      ["email", "first_name", "language", "kit_subscriber_id", "created_at"],
      (data || []).map((r) => [r.email, r.first_name, r.language, r.kit_subscriber_id, r.created_at]),
    )
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="subscribers-${stamp}.csv"`,
      },
    })
  }

  // Default: purchases.
  const { data, error } = await db
    .from("ebook_purchases")
    .select("created_at, ebook_slug, language, payer_email, amount, currency, status, granted_by, stripe_session_id")
    .order("created_at", { ascending: false })
    .limit(10000)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const csv = toCsv(
    ["created_at", "ebook_slug", "language", "payer_email", "amount", "currency", "status", "source", "stripe_session_id"],
    (data || []).map((r) => [
      r.created_at,
      r.ebook_slug,
      r.language,
      r.payer_email,
      r.amount,
      r.currency,
      r.status,
      r.granted_by ? `admin:${r.granted_by}` : r.stripe_session_id ? "stripe" : "",
      r.stripe_session_id,
    ]),
  )
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="purchases-${stamp}.csv"`,
    },
  })
}
