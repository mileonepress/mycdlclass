import "server-only"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { subscribeToKit } from "@/lib/kit"

/**
 * Fallback grant used by the success page. Verifies a Stripe Checkout session
 * directly with Stripe (so it can't be spoofed via the URL) and records the
 * purchase if it isn't already. Returns whether the session is a paid match
 * for the given course slug.
 */
export async function verifyAndGrantSession(
  sessionId: string,
  expectedSlug: string,
): Promise<boolean> {
  let session: Stripe.Checkout.Session
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId)
  } catch (err) {
    console.error("[v0] verifySession: retrieve failed:", err)
    return false
  }

  if (session.payment_status !== "paid") return false
  const courseSlug = session.metadata?.course_slug
  if (!courseSlug || courseSlug !== expectedSlug) return false

  const userId = session.metadata?.user_id || session.client_reference_id || null
  const payerEmail =
    session.customer_details?.email || session.customer_email || null

  const admin = createAdminClient()
  const { error } = await admin.from("purchases").upsert(
    {
      user_id: userId,
      course_slug: courseSlug,
      language: session.metadata?.language || "en",
      stripe_session_id: session.id,
      amount: session.amount_total ? session.amount_total / 100 : null,
      currency: session.currency || "usd",
      payer_email: payerEmail,
      status: "completed",
    },
    { onConflict: "stripe_session_id" },
  )

  if (error) {
    console.error("[v0] verifySession: upsert failed:", error.message)
    return false
  }

  if (payerEmail) {
    await subscribeToKit({
      email: payerEmail,
      fields: { last_course_purchased: courseSlug, customer_status: "buyer" },
    })
  }

  return true
}
