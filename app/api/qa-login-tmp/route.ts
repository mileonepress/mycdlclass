import { NextResponse } from "next/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { createClient as createSSRClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// TEMPORARY, DEV-ONLY QA login. Removed immediately after authenticated preview QA.
// Refuses to run in production and requires a one-time nonce.
export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "disabled in production" }, { status: 403 })
  }
  const url = new URL(req.url)
  const host = req.headers.get("host") || ""
  if (!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) {
    return NextResponse.json({ error: "localhost only" }, { status: 403 })
  }

  const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)

  const admin = createAdminClient(SUPA_URL, SERVICE, { auth: { persistSession: false } })
  let target: { email: string } | null = null
  for (let page = 1; page <= 20 && !target; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) return NextResponse.json({ error: "listUsers: " + error.message }, { status: 500 })
    if (!data.users.length) break
    const found = data.users.find((u) => adminEmails.includes((u.email || "").toLowerCase()))
    if (found?.email) target = { email: found.email }
    if (data.users.length < 200) break
  }
  if (!target) return NextResponse.json({ error: "no admin user" }, { status: 404 })

  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({ type: "magiclink", email: target.email })
  if (linkErr || !link.properties?.hashed_token) {
    return NextResponse.json({ error: "generateLink: " + (linkErr?.message || "no token") }, { status: 500 })
  }
  const anon = createSSRClient(SUPA_URL, ANON, { auth: { persistSession: false } })
  const { data: verify, error: verErr } = await anon.auth.verifyOtp({ type: "email", token_hash: link.properties.hashed_token })
  if (verErr || !verify.session) {
    return NextResponse.json({ error: "verifyOtp: " + (verErr?.message || "no session") }, { status: 500 })
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(SUPA_URL, ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(list) {
        list.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })
  await supabase.auth.setSession({
    access_token: verify.session.access_token,
    refresh_token: verify.session.refresh_token,
  })

  const next = url.searchParams.get("next") || "/dashboard/courses"
  return NextResponse.redirect(new URL(next, url.origin))
}
