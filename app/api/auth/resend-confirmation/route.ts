import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendSignupConfirmationEmail, siteUrl } from "@/lib/authEmails"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** Only allow same-site relative paths for the post-confirm destination. */
function safeNext(value: unknown): string {
  const v = typeof value === "string" ? value : ""
  if (!v.startsWith("/") || v.startsWith("//")) return "/account"
  return v
}

/**
 * Resends a branded account-confirmation email through Resend (not Supabase
 * SMTP) for people whose original signup link expired.
 *
 * We can't regenerate a "signup" link without the user's password, so we mint
 * a magic link instead: verifying it via /auth/confirm both confirms the
 * (unconfirmed) email and signs the user in, which is exactly what the
 * confirmation step needs to accomplish. Always responds with a generic
 * success so the endpoint can't be used to discover which emails have accounts.
 */
export async function POST(request: Request) {
  let email = ""
  let next = "/account"
  try {
    const body = await request.json()
    email = String(body?.email ?? "")
      .trim()
      .toLowerCase()
    next = safeNext(body?.next)
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 })
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    })

    // Non-existent accounts (and other soft errors) fall through to the same
    // generic success below — we never reveal whether the email is registered.
    const tokenHash = data?.properties?.hashed_token
    if (!error && tokenHash) {
      const actionUrl = `${siteUrl()}/auth/confirm?token_hash=${encodeURIComponent(
        tokenHash,
      )}&type=magiclink&next=${encodeURIComponent(next)}`
      const sent = await sendSignupConfirmationEmail(email, actionUrl)
      if (!sent) {
        console.error("[v0] resend-confirmation: email send failed for", email)
      }
    } else if (error) {
      console.error("[v0] resend-confirmation: generateLink error:", error.message)
    }
  } catch (err) {
    console.error("[v0] resend-confirmation: unexpected error:", err)
  }

  return NextResponse.json({ ok: true })
}
