import { NextResponse } from "next/server"
import { getAdminUser, getAdminEmails } from "@/lib/adminAuth"

export const dynamic = "force-dynamic"

/**
 * Owner-only health check for the Stripe payment + webhook configuration.
 * Reports which env vars are present (never their values) and whether the
 * Stripe secret key is a live or test key, so you can confirm go-live readiness.
 */
export async function GET() {
  // If no admin is configured, refuse rather than leak config publicly.
  if (getAdminEmails().length > 0) {
    const admin = await getAdminUser()
    if (!admin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }
  }

  const secret = process.env.STRIPE_SECRET_KEY || ""
  const mode = secret.startsWith("sk_live_")
    ? "live"
    : secret.startsWith("sk_test_")
      ? "test"
      : "unknown"

  const checks = {
    stripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
    stripePublishableKey: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    stripeWebhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    supabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  }

  const webhookReady = checks.stripeSecretKey && checks.stripeWebhookSecret
  const goLiveReady = webhookReady && mode === "live"

  return NextResponse.json({
    mode,
    webhookReady,
    goLiveReady,
    checks,
    notes: {
      webhook: checks.stripeWebhookSecret
        ? "STRIPE_WEBHOOK_SECRET is set."
        : "STRIPE_WEBHOOK_SECRET is MISSING — webhook events will be rejected. Purchases still grant access via the success-page fallback.",
      mode:
        mode === "live"
          ? "Live keys detected — real payments will be charged."
          : mode === "test"
            ? "Test/sandbox keys detected — only test cards work; no real money is charged."
            : "Could not determine key mode.",
    },
  })
}
