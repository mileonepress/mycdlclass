import "server-only"
import Stripe from "stripe"

let _stripe: Stripe | null = null

/**
 * Lazily instantiate the Stripe client so the module can be imported at build
 * time without the secret key being present. Throws only when actually used.
 */
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set")
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    })
  }
  return _stripe
}
