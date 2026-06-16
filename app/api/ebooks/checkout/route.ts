import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { getEbookProduct } from "@/lib/ebookProducts"

export async function POST(request: Request) {
  try {
    const { slug } = await request.json()

    const product = getEbookProduct(slug)
    if (!product) {
      return NextResponse.json({ error: "Unknown ebook" }, { status: 400 })
    }

    // Ebooks are delivered by email, so a logged-in account is optional.
    // If a user is signed in, tie the purchase to their account.
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const priceInCents = Math.round(Number.parseFloat(product.price) * 100)

    const rawSiteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      new URL(request.url).origin
    const siteUrl = /^https?:\/\//.test(rawSiteUrl)
      ? rawSiteUrl
      : `https://${rawSiteUrl}`

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      ...(user?.email ? { customer_email: user.email } : {}),
      ...(user?.id ? { client_reference_id: user.id } : {}),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: priceInCents,
            product_data: {
              name: `${product.title} (${product.languageLabel}) — CDL Ebook (PDF)`,
            },
          },
        },
      ],
      metadata: {
        ...(user?.id ? { user_id: user.id } : {}),
        ebook_slug: slug,
        language: product.language,
        kind: "ebook",
      },
      success_url: `${siteUrl}/ebooks/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/ebooks`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("[v0] ebook checkout session error:", err)
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 })
  }
}
