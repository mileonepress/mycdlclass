// Single source of truth for study-guide pricing.
//
// Every product (downloadable ebooks AND interactive courses) is sold as a
// one-time $14.99 purchase tied to the same Stripe product so all sales roll
// up under one catalog entry in the Stripe dashboard.

// The Stripe Product every checkout line item is attached to.
export const STUDY_GUIDE_STRIPE_PRODUCT_ID = "prod_UdKQRAbk4IAzIS"

// One-time price, in cents (what Stripe charges).
export const STUDY_GUIDE_PRICE_CENTS = 1499

// Display string without the currency symbol, e.g. "14.99".
export const STUDY_GUIDE_PRICE_USD = (STUDY_GUIDE_PRICE_CENTS / 100).toFixed(2)
