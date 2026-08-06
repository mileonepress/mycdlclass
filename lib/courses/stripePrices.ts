import "server-only"

/**
 * Per-course Stripe Price IDs, keyed by course slug and resolved from env vars.
 *
 * When a course's Price ID env var is set to a valid `price_...` value, checkout
 * uses that fixed Stripe Price. Otherwise the checkout route falls back to
 * building a dynamic line item from the course's `price_cents` in the database,
 * so every course keeps working even before its Price ID is configured.
 */
const PRICE_ENV_BY_SLUG: Record<string, string> = {
  "general-knowledge": "STRIPE_GENERAL_KNOWLEDGE_PRICE_ID",
  "air-brakes": "STRIPE_AIR_BRAKES_PRICE_ID",
  "combination-vehicles": "STRIPE_COMBINATION_VEHICLES_PRICE_ID",
  hazmat: "STRIPE_HAZMAT_PRICE_ID",
  "pre-trip-inspection": "STRIPE_PRE_TRIP_INSPECTION_PRICE_ID",
  passenger: "STRIPE_PASSENGER_PRICE_ID",
  "school-bus": "STRIPE_SCHOOL_BUS_PRICE_ID",
  tanker: "STRIPE_TANKER_PRICE_ID",
  "doubles-triples": "STRIPE_DOUBLES_TRIPLES_PRICE_ID",
}

/** Returns a valid Stripe Price ID for the slug, or null to use dynamic pricing. */
export function getStripePriceId(slug: string): string | null {
  const envName = PRICE_ENV_BY_SLUG[slug]
  if (!envName) return null
  const priceId = process.env[envName]?.trim()
  return priceId && priceId.startsWith("price_") ? priceId : null
}
