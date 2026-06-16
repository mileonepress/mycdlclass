import { NextResponse } from "next/server"
import { subscribeToKit } from "@/lib/kit"
import { createAdminClient } from "@/lib/supabase/admin"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const { email, firstName, language, source } = await request.json()

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const cleanFirstName = typeof firstName === "string" && firstName.trim() ? firstName.trim() : undefined
    const cleanLanguage = language === "es" || language === "en" ? language : undefined

    // 1) Sync to Kit (fails soft if not configured).
    const result = await subscribeToKit({
      email: normalizedEmail,
      firstName: cleanFirstName,
      fields: source ? { signup_source: String(source) } : undefined,
    })

    // 2) Persist the subscriber in our database (source of truth).
    try {
      const admin = createAdminClient()
      await admin.from("email_subscribers").upsert(
        {
          email: normalizedEmail,
          first_name: cleanFirstName ?? null,
          language: cleanLanguage ?? null,
          kit_subscriber_id: result.subscriberId ?? null,
        },
        { onConflict: "email" },
      )
    } catch (dbErr) {
      console.error("[v0] email_subscribers persist error:", dbErr)
    }

    if (result.skipped) {
      // Kit not configured; still treat as success since we stored the lead.
      return NextResponse.json({ ok: true, note: "kit_not_configured" })
    }

    return NextResponse.json({ ok: result.ok })
  } catch (err) {
    console.error("[v0] subscribe route error:", err)
    return NextResponse.json({ error: "subscribe_failed" }, { status: 500 })
  }
}
