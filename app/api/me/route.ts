import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/adminAuth"

export const dynamic = "force-dynamic"

/**
 * Lightweight session probe for client components (e.g. the site header).
 * Reports whether someone is logged in and whether they are an admin,
 * WITHOUT exposing the ADMIN_EMAILS list to the browser.
 */
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ loggedIn: false, email: null, isAdmin: false })
  }

  return NextResponse.json({
    loggedIn: true,
    email: user.email ?? null,
    isAdmin: isAdminEmail(user.email),
  })
}
