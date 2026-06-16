import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { getCourseProduct } from "@/lib/courseProducts"
import { getCourseBySlug } from "@/lib/supabase/queries"

export async function POST(request: Request) {
  try {
    const { slug, lang } = await request.json()

    const product = getCourseProduct(slug)
    if (!product) {
      return NextResponse.json({ error: "Unknown course" }, { status: 400 })
    }

    // Require an authenticated user so the purchase is tied to an account.
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "auth_required" }, { status: 401 })
    }

    const course = await getCourseBySlug(slug)
    if (!course) {
      return NextResponse.json({ error: "Unknown course" }, { status: 400 })
    }

    const language = lang === "es" ? "es" : "en"
    const courseName = product.name[language] || product.name.en
    const priceInCents = Math.round(Number.parseFloat(product.price) * 100)

    const rawSiteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      new URL(request.url).origin
    // Stripe requires absolute URLs with a protocol.
    const siteUrl = /^https?:\/\//.test(rawSiteUrl)
      ? rawSiteUrl
      : `https://${rawSiteUrl}`

    const langSuffix = language === "es" ? "?lang=es" : ""

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      client_reference_id: user.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: priceInCents,
            product_data: {
              name: `${courseName} — CDL Course`,
            },
          },
        },
      ],
      metadata: {
        user_id: user.id,
        course_slug: slug,
        language,
      },
      success_url: `${siteUrl}/courses/${slug}/success${langSuffix}${
        langSuffix ? "&" : "?"
      }session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/courses/${slug}${langSuffix}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("[v0] checkout session error:", err)
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 })
  }
}
