import "server-only"
import type Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStripe } from "@/lib/stripe"

/**
 * Grants a course entitlement after a successful Stripe checkout. Runs only
 * from the verified webhook (service-role client), so it is the single trusted
 * writer of the course_entitlements table. Idempotent via the unique
 * stripe_session_id / (user_id, course_id) constraints.
 */
export async function grantCourseEntitlement(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id
  const courseId = session.metadata?.course_id

  if (!userId || !courseId) {
    console.error("[v0] course webhook: missing user_id or course_id in metadata")
    return
  }

  const admin = createAdminClient()
  const { error } = await admin.from("course_entitlements").upsert(
    {
      user_id: userId,
      course_id: courseId,
      source: "purchase",
      stripe_session_id: session.id,
      amount_cents: session.amount_total ?? null,
      currency: session.currency ?? "usd",
    },
    { onConflict: "user_id,course_id", ignoreDuplicates: true },
  )

  if (error) {
    console.error("[v0] grantCourseEntitlement error:", error.message)
    return
  }

  console.log(`[v0] granted course ${courseId} to user ${userId}`)
}

/**
 * Success-page fallback: verifies a checkout session directly with Stripe and
 * grants the entitlement if it is paid and belongs to this user. Makes the
 * post-purchase flow reliable even when the webhook has not been configured.
 * Returns true if the user now owns the course.
 */
export async function verifyAndGrantFromSession(
  sessionId: string,
  userId: string,
  courseId: string,
): Promise<boolean> {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)

    const matchesUser = session.metadata?.user_id === userId || session.client_reference_id === userId
    const matchesCourse = session.metadata?.course_id === courseId
    const paid = session.payment_status === "paid"

    if (paid && matchesUser && matchesCourse) {
      await grantCourseEntitlement(session)
      return true
    }
    return false
  } catch (err) {
    console.error("[v0] verifyAndGrantFromSession error:", err)
    return false
  }
}
