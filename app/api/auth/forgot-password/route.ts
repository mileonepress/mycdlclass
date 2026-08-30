import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendPasswordResetEmail, siteUrl } from "@/lib/authEmails"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Sends a branded password-reset email through Resend (not Supabase SMTP).
 *
 * We generate the recovery link with the admin API, then deliver our own
 * branded email that points at the on-domain /auth/confirm route. Always
 * responds with a generic success so the endpoint can't be used to discover
 * which emails have accounts.
 */
export async function POST(request: Request) {
  let email: string
  try {
    const body = await request.json()
    email = String(body?.email ?? "")
      .trim()
      .toLowerCase()
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 })
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
    })

    // Non-existent accounts (and other soft errors) fall through to the same
    // generic success below — we never reveal whether the email is registered.
    const tokenHash = data?.properties?.hashed_token
    if (!error && tokenHash) {
      const actionUrl = `${siteUrl()}/auth/confirm?token_hash=${encodeURIComponent(
        tokenHash,
      )}&type=recovery&next=${encodeURIComponent("/reset-password")}`
      const sent = await sendPasswordResetEmail(email, actionUrl)
      if (!sent) {
        console.error("[v0] forgot-password: email send failed for", email)
      }
    } else if (error) {
      console.error("[v0] forgot-password: generateLink error:", error.message)
    }
  } catch (err) {
    console.error("[v0] forgot-password: unexpected error:", err)
  }

  return NextResponse.json({ ok: true })
}
