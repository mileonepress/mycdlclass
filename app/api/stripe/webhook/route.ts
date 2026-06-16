import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { subscribeToKit } from "@/lib/kit"

// Stripe requires the raw body to verify the signature.
export const runtime = "nodejs"

async function recordPurchase(session: Stripe.Checkout.Session) {
  const admin = createAdminClient()

  const courseSlug = session.metadata?.course_slug
  const userId = session.metadata?.user_id || session.client_reference_id || null
  const language = session.metadata?.language || "en"
  const payerEmail =
    session.customer_details?.email || session.customer_email || null

  if (!courseSlug) {
    console.error("[v0] webhook: missing course_slug in session metadata")
    return
  }

  // Idempotent insert keyed on the Stripe session id.
  const { error } = await admin.from("purchases").upsert(
    {
      user_id: userId,
      course_slug: courseSlug,
      language,
      stripe_session_id: session.id,
      amount: session.amount_total ? session.amount_total / 100 : null,
      currency: session.currency || "usd",
      payer_email: payerEmail,
      status: "completed",
    },
    { onConflict: "stripe_session_id" },
  )

  if (error) {
    console.error("[v0] webhook: failed to record purchase:", error.message)
    return
  }

  // Post-purchase Kit lead capture (fail-soft).
  if (payerEmail) {
    await subscribeToKit({
      email: payerEmail,
      fields: { last_course_purchased: courseSlug, customer_status: "buyer" },
    })
  }
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    console.error("[v0] webhook: missing signature or STRIPE_WEBHOOK_SECRET")
    return NextResponse.json({ error: "config_error" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("[v0] webhook signature verification failed:", err)
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status === "paid") {
      await recordPurchase(session)
    }
  }

  return NextResponse.json({ received: true })
}
