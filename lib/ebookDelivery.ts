import "server-only"
import crypto from "crypto"
import type Stripe from "stripe"
import { Resend } from "resend"
import { createAdminClient } from "@/lib/supabase/admin"
import { getEbookProduct } from "@/lib/ebookProducts"

const FROM_EMAIL = "MyCDLClass Ebooks <onboarding@resend.dev>"

function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || ""
  if (!raw) return ""
  return /^https?:\/\//.test(raw) ? raw : `https://${raw}`
}

/**
 * Records a completed ebook purchase (idempotent on the Stripe session id),
 * generates a secure download token, and emails the buyer a private,
 * purchase-verified download link. Safe to call from both the webhook and the
 * success-page fallback.
 */
export async function recordAndDeliverEbook(
  session: Stripe.Checkout.Session,
): Promise<{ ok: boolean; token: string | null; slug: string | null }> {
  const ebookSlug = session.metadata?.ebook_slug
  if (!ebookSlug) {
    console.error("[v0] ebook delivery: missing ebook_slug in metadata")
    return { ok: false, token: null, slug: null }
  }

  const product = getEbookProduct(ebookSlug)
  if (!product) {
    console.error("[v0] ebook delivery: unknown ebook slug", ebookSlug)
    return { ok: false, token: null, slug: ebookSlug }
  }

  const admin = createAdminClient()
  const userId = session.metadata?.user_id || session.client_reference_id || null
  const payerEmail =
    session.customer_details?.email || session.customer_email || null

  // Reuse an existing token if this session was already processed.
  const { data: existing } = await admin
    .from("ebook_purchases")
    .select("download_token")
    .eq("stripe_session_id", session.id)
    .maybeSingle()

  const token = existing?.download_token || crypto.randomBytes(24).toString("hex")

  const { error } = await admin.from("ebook_purchases").upsert(
    {
      user_id: userId,
      ebook_slug: ebookSlug,
      language: product.language,
      stripe_session_id: session.id,
      amount: session.amount_total ? session.amount_total / 100 : null,
      currency: session.currency || "usd",
      payer_email: payerEmail,
      status: "completed",
      download_token: token,
    },
    { onConflict: "stripe_session_id" },
  )

  if (error) {
    console.error("[v0] ebook delivery: upsert failed:", error.message)
    return { ok: false, token: null, slug: ebookSlug }
  }

  if (payerEmail) {
    await sendEbookEmail(payerEmail, product.title, product.languageLabel, token)
  }

  return { ok: true, token, slug: ebookSlug }
}

/**
 * Sends (or re-sends) the secure download email for an ebook purchase.
 */
export async function sendEbookEmail(
  to: string,
  title: string,
  languageLabel: string,
  token: string,
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.error("[v0] ebook delivery: RESEND_API_KEY not set, cannot email")
    return false
  }

  const base = siteUrl()
  const downloadUrl = `${base}/api/ebooks/download?token=${encodeURIComponent(token)}`

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your CDL ebook: ${title} (${languageLabel})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0D2B45">
          <h2 style="color:#0D2B45">Thank you for your purchase!</h2>
          <p>Your CDL prep ebook is ready to download:</p>
          <p style="font-size:18px;font-weight:bold;margin:16px 0">${title} <span style="color:#16A34A">(${languageLabel})</span></p>
          <p>
            <a href="${downloadUrl}"
               style="display:inline-block;background:#16A34A;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold">
              Download your PDF
            </a>
          </p>
          <p style="font-size:13px;color:#64748b;margin-top:24px">
            This is a private download link tied to your purchase. Keep this email so you can
            re-download your ebook anytime. If the button doesn't work, copy and paste this URL:
          </p>
          <p style="font-size:12px;color:#64748b;word-break:break-all">${downloadUrl}</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
          <p style="font-size:12px;color:#94a3b8">MyCDLClass — Bilingual CDL training &amp; practice tests.</p>
        </div>
      `,
      text:
        `Thank you for your purchase!\n\n` +
        `Your CDL prep ebook is ready: ${title} (${languageLabel})\n\n` +
        `Download your PDF: ${downloadUrl}\n\n` +
        `This is a private download link tied to your purchase. Keep this email to re-download anytime.\n\n` +
        `MyCDLClass`,
    })
    return true
  } catch (err) {
    console.error("[v0] ebook delivery: Resend send error:", err)
    return false
  }
}
