import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { slug } = await request.json()
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "missing_slug" }, { status: 400 })
    }

    // Course purchases are tied to an account — the user must be signed in so
    // we can grant the entitlement to them after payment.
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "auth_required" }, { status: 401 })
    }

    // Look up the course + price SERVER-SIDE. The client never sends a price.
    const admin = createAdminClient()
    const { data: course } = await admin
      .from("courses")
      .select("id, slug, price_cents, status, course_translations ( language_code, title )")
      .eq("slug", slug)
      .eq("status", "published")
      .single()

    if (!course) {
      return NextResponse.json({ error: "unknown_course" }, { status: 400 })
    }

    // Already owns it? Don't let them pay twice.
    const { data: existing } = await admin
      .from("course_entitlements")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: "already_owned" }, { status: 409 })
    }

    const translations = (course as any).course_translations ?? []
    const title =
      translations.find((t: any) => t.language_code === "en")?.title ?? course.slug

    const rawSiteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(request.url).origin
    const siteUrl = /^https?:\/\//.test(rawSiteUrl) ? rawSiteUrl : `https://${rawSiteUrl}`

    const session = await getStripe().checkout.sessions.create(
      {
        mode: "payment",
        customer_email: user.email,
        client_reference_id: user.id,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: course.price_cents,
              product_data: {
                name: `${title} — Interactive CDL Course`,
              },
            },
          },
        ],
        metadata: {
          kind: "course",
          user_id: user.id,
          course_id: course.id,
          course_slug: course.slug,
        },
        success_url: `${siteUrl}/courses/${course.slug}/learn?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/courses/${course.slug}`,
      },
      // Idempotency: a retried request for the same user+course won't double-charge.
      { idempotencyKey: `course_${user.id}_${course.id}` },
    )

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("[v0] course checkout session error:", err)
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 })
  }
}
