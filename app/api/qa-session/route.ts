import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSupabaseAdmin } from "@/lib/supabaseAdmin"
import { getAdminEmails } from "@/lib/adminAuth"

/**
 * TEMPORARY QA-ONLY route. Establishes an admin session for post-cutover
 * smoke-testing on the live domain. Guarded by the QA_LOGIN_KEY secret.
 * Removed immediately after the final smoke test.
 */
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key")
  const expected = process.env.QA_LOGIN_KEY
  if (!expected || !key || key !== expected) {
    return new NextResponse("forbidden", { status: 403 })
  }

  const adminEmail = getAdminEmails()[0]
  if (!adminEmail) {
    return NextResponse.json({ error: "no ADMIN_EMAILS configured" }, { status: 500 })
  }

  // Generate a magic-link token for the admin via the service-role client.
  const admin = getSupabaseAdmin()
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: adminEmail,
  })
  if (error || !data?.properties?.hashed_token) {
    return NextResponse.json(
      { error: "generateLink failed", detail: error?.message },
      { status: 500 },
    )
  }

  // Verify the OTP through the SSR client so httpOnly auth cookies are set.
  const supabase = await createClient()
  const { error: verifyError } = await supabase.auth.verifyOtp({
    type: "magiclink",
    token_hash: data.properties.hashed_token,
  })
  if (verifyError) {
    return NextResponse.json(
      { error: "verifyOtp failed", detail: verifyError.message },
      { status: 500 },
    )
  }

  const next = req.nextUrl.searchParams.get("next") || "/dashboard/courses"
  return NextResponse.redirect(new URL(next, req.nextUrl.origin), { status: 307 })
}
