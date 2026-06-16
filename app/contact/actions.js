"use server"

import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"
import { getSupabaseAdmin } from "@/lib/supabaseAdmin"

const SUPPORT_EMAIL = "mileonepress@gmail.com"

export async function submitContactMessage(prevState, formData) {
  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const message = String(formData.get("message") || "").trim()

  // Basic validation
  if (!name || !email || !message) {
    return { ok: false, error: "Please fill out your name, email, and message." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." }
  }
  if (message.length > 5000) {
    return { ok: false, error: "Your message is a bit too long. Please keep it under 5000 characters." }
  }

  let savedToDb = false
  let emailSent = false

  // Attempt to tie the message to a logged-in user (optional)
  let userId = null
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    userId = user?.id || null
  } catch {
    // ignore — contact form works for guests too
  }

  // 1) Try to save to Supabase (activates once the contact_messages table exists)
  try {
    const admin = getSupabaseAdmin()
    const { error } = await admin.from("contact_messages").insert({
      user_id: userId,
      name,
      email,
      message,
      status: "new",
    })
    if (!error) savedToDb = true
    else console.error("[v0] contact_messages insert error:", error.message)
  } catch (err) {
    console.error("[v0] contact_messages insert exception:", err)
  }

  // 2) Try to send the email (activates once RESEND_API_KEY is set)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: "MyCDLClass Contact <onboarding@resend.dev>",
        to: SUPPORT_EMAIL,
        replyTo: email,
        subject: `New contact message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      })
      emailSent = true

      // Best-effort: mark the saved record as emailed
      if (savedToDb) {
        try {
          const admin = getSupabaseAdmin()
          await admin
            .from("contact_messages")
            .update({ email_sent: true })
            .eq("email", email)
            .eq("message", message)
        } catch {
          // non-critical
        }
      }
    } catch (err) {
      console.error("[v0] Resend send error:", err)
    }
  }

  if (savedToDb || emailSent) {
    return { ok: true, error: null }
  }

  // Nothing is configured yet — guide the user to email directly.
  return {
    ok: false,
    error:
      "We couldn't submit your message automatically right now. Please email us directly at " +
      SUPPORT_EMAIL +
      ".",
  }
}
