import "server-only"
import type Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Record a course entitlement from a paid Stripe Checkout session.
 * Idempotent: a repeated webhook or a success-page verify for the same
 * session will not create duplicate rows.
 */
export async function grantCourseEntitlement(session: Stripe.Checkout.Session): Promise<boolean> {
  const userId = session.metadata?.user_id || session.client_reference_id || undefined
  const courseId = session.metadata?.course_id || undefined
  const courseSlug = session.metadata?.course_slug || undefined

  if (!userId || !courseId) {
    console.error("[v0] grantCourseEntitlement: missing user_id or course_id", {
      userId,
      courseId,
      courseSlug,
    })
    return false
  }

  const db = createAdminClient()

  // Already granted for this checkout session?
  const { data: existing } = await db
    .from("course_entitlements")
    .select("id")
    .eq("stripe_session_id", session.id)
    .limit(1)
    .maybeSingle()
  if (existing) return true

  const { error } = await db.from("course_entitlements").insert({
    user_id: userId,
    course_id: courseId,
    source: "stripe",
    stripe_session_id: session.id,
    amount_cents: session.amount_total ?? null,
    currency: session.currency ?? "usd",
  })

  if (error) {
    console.error("[v0] grantCourseEntitlement insert error:", error.message)
    return false
  }
  return true
}

/**
 * Verify a checkout session directly with Stripe and grant access.
 * Used by the success page as a fallback in case the webhook is delayed.
 */
export async function verifyAndGrantSession(
  sessionId: string,
  getStripe: () => Stripe,
): Promise<boolean> {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== "paid") return false
    return grantCourseEntitlement(session)
  } catch (err) {
    console.error("[v0] verifyAndGrantSession error:", err)
    return false
  }
}
