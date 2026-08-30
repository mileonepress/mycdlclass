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
 * Creates a new account and sends a branded confirmation email through Resend
 * (not Supabase SMTP). Uses the admin API's generateLink to both create the
 * unconfirmed user and mint the confirmation token, then emails the on-domain
 * /auth/confirm link.
 */
export async function POST(request: Request) {
  let email = ""
  let password = ""
  let next = "/account"
  try {
    const body = await request.json()
    email = String(body?.email ?? "")
      .trim()
      .toLowerCase()
    password = String(body?.password ?? "")
    next = safeNext(body?.next)
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 })
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "weak_password" }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.generateLink({
      type: "signup",
      email,
      password,
    })

    if (error) {
      // Most common case: the email already has an account. Tell the user in a
      // friendly, actionable way rather than leaking a raw error.
      const msg = error.message?.toLowerCase() ?? ""
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        return NextResponse.json({ ok: true, alreadyRegistered: true })
      }
      console.error("[v0] signup: generateLink error:", error.message)
      return NextResponse.json({ error: "signup_failed" }, { status: 500 })
    }

    const tokenHash = data?.properties?.hashed_token
    if (!tokenHash) {
      console.error("[v0] signup: missing hashed_token from generateLink")
      return NextResponse.json({ error: "signup_failed" }, { status: 500 })
    }

    const actionUrl = `${siteUrl()}/auth/confirm?token_hash=${encodeURIComponent(
      tokenHash,
    )}&type=signup&next=${encodeURIComponent(next)}`

    const sent = await sendSignupConfirmationEmail(email, actionUrl)
    if (!sent) {
      console.error("[v0] signup: confirmation email failed for", email)
      return NextResponse.json({ error: "email_failed" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[v0] signup: unexpected error:", err)
    return NextResponse.json({ error: "signup_failed" }, { status: 500 })
  }
}
