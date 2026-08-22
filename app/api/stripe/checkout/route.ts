import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { getCourseDetail } from "@/lib/supabase/courseCatalog"
import { hasCourseAccess } from "@/lib/access"

export async function POST(request: Request) {
  try {
    const { slug, lang } = await request.json()
    const language = lang === "es" ? "es" : "en"

    // Require an authenticated user so the purchase is tied to an account.
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "auth_required" }, { status: 401 })
    }

    const course = await getCourseDetail(slug, language)
    if (!course) {
      return NextResponse.json({ error: "Unknown course" }, { status: 400 })
    }
    if (course.isFree) {
      return NextResponse.json({ error: "Course is free" }, { status: 400 })
    }
    if (!course.priceCents || course.priceCents <= 0) {
      return NextResponse.json({ error: "Course is not purchasable" }, { status: 400 })
    }

    // If already entitled, no need to pay again.
    if (await hasCourseAccess(user.id, course.id)) {
      return NextResponse.json({ error: "already_owned" }, { status: 409 })
    }

    const rawSiteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(request.url).origin
    const siteUrl = /^https?:\/\//.test(rawSiteUrl) ? rawSiteUrl : `https://${rawSiteUrl}`
    const langSuffix = language === "es" ? "?lang=es" : ""

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
              unit_amount: course.priceCents,
              product_data: {
                name: `${course.title} — CDL Training Course`,
              },
            },
          },
        ],
        metadata: {
          kind: "course",
          user_id: user.id,
          course_id: course.id,
          course_slug: course.slug,
          language,
        },
        success_url: `${siteUrl}/training-courses/${course.slug}/success${langSuffix}${
          langSuffix ? "&" : "?"
        }session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/training-courses/${course.slug}${langSuffix}`,
      },
      // Idempotency: a retry for the same user+course won't create a 2nd session.
      { idempotencyKey: `course_${course.id}_${user.id}` },
    )

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("[v0] course checkout session error:", err)
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 })
  }
}
