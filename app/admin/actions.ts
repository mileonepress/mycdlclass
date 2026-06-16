"use server"

import { revalidatePath } from "next/cache"
import { getAdminUser } from "@/lib/adminAuth"
import { createAdminClient } from "@/lib/supabase/admin"
import { findUserByEmail } from "@/lib/adminUsers"
import { getCourseProduct } from "@/lib/courseProducts"
import { getEbookProduct } from "@/lib/ebookProducts"

type ActionState = { ok: boolean; message: string }

/**
 * Grant a user free access to a paid course by inserting a completed purchase
 * record (amount 0). Looks the user up by email. Admin-only.
 */
export async function grantCourseAccess(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminUser()
  if (!admin) return { ok: false, message: "Not authorized." }

  const email = String(formData.get("email") || "").trim()
  const slug = String(formData.get("course_slug") || "").trim()
  const language = String(formData.get("language") || "en") === "es" ? "es" : "en"

  if (!email || !slug) {
    return { ok: false, message: "Please provide an email and select a course." }
  }
  const product = getCourseProduct(slug)
  if (!product) return { ok: false, message: "Unknown course." }

  const user = await findUserByEmail(email)
  if (!user) {
    return {
      ok: false,
      message: `No account found for ${email}. The user must sign up first.`,
    }
  }

  const db = createAdminClient()
  const { error } = await db.from("purchases").upsert(
    {
      user_id: user.id,
      course_slug: slug,
      language,
      payer_email: user.email,
      amount: 0,
      currency: "usd",
      status: "completed",
      stripe_session_id: `admin_grant_${user.id}_${slug}`,
    },
    { onConflict: "stripe_session_id" },
  )

  if (error) {
    console.error("[v0] grantCourseAccess error:", error.message)
    return { ok: false, message: `Failed to grant access: ${error.message}` }
  }

  revalidatePath("/admin/access")
  return { ok: true, message: `Granted ${product.name[language]} access to ${user.email}.` }
}

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

/**
 * Create a new course. Admin-only. Uses only columns that exist on the
 * courses table.
 */
export async function createCourse(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminUser()
  if (!admin) return { ok: false, message: "Not authorized." }

  const title = String(formData.get("title") || "").trim()
  const slug = String(formData.get("slug") || "").trim()
  if (!title || !slug) {
    return { ok: false, message: "Title and slug are required." }
  }

  const db = createAdminClient()
  const { error } = await db.from("courses").insert({
    title,
    slug,
    spanish_title: String(formData.get("spanish_title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    icon: String(formData.get("icon") || "").trim() || null,
    is_free: formData.get("is_free") === "on",
    is_published: formData.get("is_published") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  })

  if (error) {
    console.error("[v0] createCourse error:", error.message)
    return { ok: false, message: `Failed to create course: ${error.message}` }
  }

  revalidatePath("/admin/courses")
  revalidatePath("/courses")
  return { ok: true, message: `Created course "${title}".` }
}

/**
 * Update an existing course's editable fields. Admin-only.
 */
export async function updateCourse(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminUser()
  if (!admin) return { ok: false, message: "Not authorized." }

  const id = String(formData.get("id") || "")
  if (!id) return { ok: false, message: "Missing course id." }

  const db = createAdminClient()
  const { error } = await db
    .from("courses")
    .update({
      title: String(formData.get("title") || "").trim(),
      spanish_title: String(formData.get("spanish_title") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      icon: String(formData.get("icon") || "").trim() || null,
      is_free: formData.get("is_free") === "on",
      is_published: formData.get("is_published") === "on",
      sort_order: Number(formData.get("sort_order") || 0),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("[v0] updateCourse error:", error.message)
    return { ok: false, message: `Failed to update course: ${error.message}` }
  }

  revalidatePath("/admin/courses")
  revalidatePath("/courses")
  return { ok: true, message: "Course updated." }
}
