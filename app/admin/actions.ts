"use server"

import { revalidatePath } from "next/cache"
import { getAdminUser } from "@/lib/adminAuth"
import { createAdminClient } from "@/lib/supabase/admin"
import { findUserByEmail } from "@/lib/adminUsers"
import { getEbookProduct } from "@/lib/ebookProducts"

type ActionState = { ok: boolean; message: string }

/**
 * Grant a user a free ebook (records a completed ebook purchase + token).
 * Admin-only. The buyer can then re-download via their email link or account.
 */
export async function grantEbookAccess(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminUser()
  if (!admin) return { ok: false, message: "Not authorized." }

  const email = String(formData.get("email") || "").trim()
  const slug = String(formData.get("ebook_slug") || "").trim()
  if (!email || !slug) {
    return { ok: false, message: "Please provide an email and select an ebook." }
  }
  const product = getEbookProduct(slug)
  if (!product) return { ok: false, message: "Unknown ebook." }

  const user = await findUserByEmail(email)
  const crypto = await import("crypto")
  const token = crypto.randomBytes(24).toString("hex")

  const db = createAdminClient()
  const { error } = await db.from("ebook_purchases").upsert(
    {
      user_id: user?.id || null,
      ebook_slug: slug,
      language: product.language,
      payer_email: email,
      amount: 0,
      currency: "usd",
      status: "completed",
      stripe_session_id: `admin_grant_${email}_${slug}`,
      download_token: token,
      granted_by: admin.email,
    },
    { onConflict: "stripe_session_id" },
  )

  if (error) {
    console.error("[v0] grantEbookAccess error:", error.message)
    return { ok: false, message: `Failed to grant ebook: ${error.message}` }
  }

  // Email the secure download link to the recipient.
  const { sendEbookEmail } = await import("@/lib/ebookDelivery")
  await sendEbookEmail(email, product.title, product.languageLabel, token)

  revalidatePath("/admin/access")
  return {
    ok: true,
    message: `Granted "${product.title} (${product.languageLabel})" to ${email} and emailed the download link.`,
  }
}
