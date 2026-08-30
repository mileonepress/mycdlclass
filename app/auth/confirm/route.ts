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
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null

  // Password recovery must land on the reset-password screen; everything else
  // (signup confirmation, email change, magic link) defaults to the account area.
  const next =
    searchParams.get("next") ?? (type === "recovery" ? "/reset-password" : "/account")

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
