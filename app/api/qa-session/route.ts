import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSupabaseAdmin } from "@/lib/supabaseAdmin"
import { getAdminEmails } from "@/lib/adminAuth"

/**
 * TEMPORARY dev/QA route used to mint an admin Supabase session for automated
 * smoke-testing of the gated dashboard on the deployed preview. It is guarded
 * by a secret key (QA_LOGIN_KEY) that is only set on the dedicated dashboard
 * project. This route is removed immediately after smoke-testing completes.
 */
export const dynamic = "force-dynamic"

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}

export async function GET(req: Request) {
  const expected = process.env.QA_LOGIN_KEY
  const url = new URL(req.url)
  const key = url.searchParams.get("key") || ""
  if (!expected || !timingSafeEqual(key, expected)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  const email = getAdminEmails()[0]
  if (!email) {
    return NextResponse.json({ error: "no admin email configured" }, { status: 500 })
  }

  // Generate a one-time magic-link token via the admin API, then verify it on a
  // server client so the session cookies are written to the response.
  const admin = getSupabaseAdmin()
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  })
  if (error || !data?.properties?.hashed_token) {
    return NextResponse.json({ error: error?.message || "generateLink failed" }, { status: 500 })
  }

  const supabase = await createClient()
  const { error: verifyError } = await supabase.auth.verifyOtp({
    type: "email",
    token_hash: data.properties.hashed_token,
  })
  if (verifyError) {
    return NextResponse.json({ error: verifyError.message }, { status: 500 })
  }

  const next = url.searchParams.get("next") || "/dashboard"
  return NextResponse.redirect(new URL(next, url.origin))
}
