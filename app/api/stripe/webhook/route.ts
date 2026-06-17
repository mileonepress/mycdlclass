import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe"
import { recordAndDeliverEbook } from "@/lib/ebookDelivery"

// Stripe requires the raw body to verify the signature.
export const runtime = "nodejs"

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
      // Only ebooks are sold; deliver the secure download by email.
      if (session.metadata?.kind === "ebook") {
        await recordAndDeliverEbook(session)
      }
    }
  }

  return NextResponse.json({ received: true })
}
