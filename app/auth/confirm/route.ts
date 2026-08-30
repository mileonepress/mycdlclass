import { type NextRequest, NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"

/**
 * Branded email-confirmation endpoint.
 *
 * Supabase email templates are configured to link here on mycdlclass.com
 * (e.g. .../auth/confirm?token_hash=...&type=signup&next=/account) instead of
 * exposing the raw supabase.co verify URL. We exchange the token hash for a
 * session, then send the customer straight to their intended destination.
 *
 * Redirects are built relative to the incoming request origin so the same
 * route works on www, the apex domain, Vercel previews, and localhost without
 * a hardcoded host.
 */

/** Only allow same-site, single-segment-safe relative paths as `next`. */
function safeNextPath(value: string | null, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback
  return value
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const requestedNext = searchParams.get("next")

  const redirect = (path: string) => NextResponse.redirect(new URL(path, origin))

  if (!token_hash || !type) {
    return redirect("/login?mode=login&error=missing_confirmation_token")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({ type, token_hash })

  if (error) {
    // Recovery links reopen the "forgot password" flow so the user can request
    // a fresh link; everything else returns to the standard login screen.
    const destination =
      type === "recovery" ? "/login?mode=forgot" : "/login?mode=login"
    return redirect(`${destination}&error=invalid_or_expired_link`)
  }

  // Password recovery must land on the reset-password screen; everything else
  // (signup confirmation, email change, magic link) defaults to the account area.
  const fallback = type === "recovery" ? "/reset-password" : "/account"
  return redirect(safeNextPath(requestedNext, fallback))
}
