// PayPal NCP (No-Code Payments) hosted payment links.
//
// IMPORTANT: The button IDs live in lib/courseProducts.js as the single source
// of truth (already verified per course + language). This module just turns
// those IDs into full NCP payment URLs, so the two can never drift apart.
//
// Seamless return flow: each NCP link's "Return URL" is configured in the
// PayPal dashboard to point at the matching success page, e.g.
//   English: https://www.mycdlclass.com/courses/<slug>/success
//   Spanish: https://www.mycdlclass.com/courses/<slug>/success?lang=es

import { getCourseProduct, getHostedButtonId } from "@/lib/courseProducts";

const NCP_BASE = "https://www.paypal.com/ncp/payment/";

// Returns the full PayPal NCP payment URL for a course in the requested
// language, falling back to English when a Spanish link is unavailable.
export function getPayPalHostedButton(slug, lang = "en") {
  const product = getCourseProduct(slug);
  const id = getHostedButtonId(product, lang);
  return id ? `${NCP_BASE}${id}` : null;
}
