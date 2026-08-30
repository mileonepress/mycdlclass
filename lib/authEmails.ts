import "server-only"
import { Resend } from "resend"

/**
 * Branded transactional auth emails (account confirmation + password reset),
 * sent directly through Resend.
 *
 * Why this exists: Supabase's built-in email delivery (custom SMTP) was
 * returning "Error sending email" because the mycdlclass.com sending domain
 * isn't verified in Resend. Rather than depend on Supabase SMTP, we generate
 * the confirmation/recovery links with the admin API and send our own branded
 * emails through the exact Resend path that already delivers ebook receipts.
 *
 * FROM address: defaults to Resend's shared onboarding sender (proven to work
 * in this project). Once mycdlclass.com is verified in Resend, set
 * AUTH_EMAIL_FROM="MyCDLClass <no-reply@mycdlclass.com>" and nothing else
 * needs to change.
 */
const FROM_EMAIL = process.env.AUTH_EMAIL_FROM || "MyCDLClass <onboarding@resend.dev>"

/** Canonical site origin, e.g. https://www.mycdlclass.com (no trailing slash). */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || ""
  if (!raw) return "https://www.mycdlclass.com"
  return /^https?:\/\//.test(raw) ? raw : `https://${raw}`
}

const BRAND_NAVY = "#061A2E"
const BRAND_INK = "#0D2B45"
const BRAND_BLUE = "#1E4D8C"
const BRAND_MUTED = "#535862"
const BRAND_FAINT = "#717680"

type EmailContent = {
  heading: string
  intro: string
  buttonLabel: string
  actionUrl: string
  footerNote: string
}

/** Shared, email-client-safe HTML shell (inline styles + table layout). */
function renderEmail({ heading, intro, buttonLabel, actionUrl, footerNote }: EmailContent): string {
  const logo = `${siteUrl()}/logo.png`
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:0;background-color:#F6F9FC;font-family:'Inter',Arial,Helvetica,sans-serif;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border:1px solid #F1F5F9;border-radius:20px;overflow:hidden;">
        <tr>
          <td align="center" style="background-color:${BRAND_NAVY};padding:28px 24px;">
            <img src="${logo}" alt="MyCDLClass" width="72" height="72" style="display:block;width:72px;height:72px;object-fit:contain;" />
          </td>
        </tr>
        <tr>
          <td style="padding:36px 32px 8px 32px;">
            <h1 style="margin:0 0 12px 0;font-size:24px;line-height:1.2;color:${BRAND_INK};font-weight:800;">${heading}</h1>
            <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:${BRAND_MUTED};">${intro}</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:0 32px 8px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="border-radius:999px;background-color:${BRAND_BLUE};background:linear-gradient(135deg,#3A83E4,${BRAND_BLUE});">
                  <a href="${actionUrl}" style="display:inline-block;padding:14px 32px;font-size:16px;font-weight:800;color:#ffffff;text-decoration:none;border-radius:999px;">${buttonLabel}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 8px 32px;">
            <p style="margin:0 0 6px 0;font-size:13px;line-height:1.6;color:${BRAND_FAINT};">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="margin:0;font-size:13px;line-height:1.6;word-break:break-all;">
              <a href="${actionUrl}" style="color:${BRAND_BLUE};">${actionUrl}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 32px 32px;border-top:1px solid #F1F5F9;">
            <p style="margin:16px 0 0 0;font-size:12px;line-height:1.6;color:${BRAND_FAINT};">${footerNote}</p>
            <p style="margin:12px 0 0 0;font-size:12px;line-height:1.6;color:${BRAND_FAINT};">
              &copy; MyCDLClass &middot; <a href="${siteUrl()}" style="color:${BRAND_BLUE};">www.mycdlclass.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
}

async function send(to: string, subject: string, html: string, text: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.error("[v0] authEmails: RESEND_API_KEY not set, cannot email")
    return false
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html, text })
    if (error) {
      console.error("[v0] authEmails: Resend returned error:", error)
      return false
    }
    return true
  } catch (err) {
    console.error("[v0] authEmails: Resend send threw:", err)
    return false
  }
}

/** Branded "confirm your account" email. `actionUrl` is the /auth/confirm link. */
export function sendSignupConfirmationEmail(to: string, actionUrl: string): Promise<boolean> {
  const html = renderEmail({
    heading: "Confirm your account",
    intro:
      "Welcome to MyCDLClass! You're one step away from your interactive CDL training. Confirm your email address to activate your account and jump into your courses.",
    buttonLabel: "Confirm my account",
    actionUrl,
    footerNote: "If you didn't create a MyCDLClass account, you can safely ignore this email.",
  })
  const text = `Confirm your MyCDLClass account\n\nActivate your account: ${actionUrl}\n\nIf you didn't create an account, you can ignore this email.\n\nMyCDLClass`
  return send(to, "Confirm your MyCDLClass account", html, text)
}

/** Branded "reset your password" email. `actionUrl` is the /auth/confirm link. */
export function sendPasswordResetEmail(to: string, actionUrl: string): Promise<boolean> {
  const html = renderEmail({
    heading: "Reset your password",
    intro:
      "We received a request to reset the password for your MyCDLClass account. Click the button below to create a new password. This link will expire shortly for your security.",
    buttonLabel: "Reset my password",
    actionUrl,
    footerNote:
      "If you didn't request a password reset, you can safely ignore this email — your password will stay the same.",
  })
  const text = `Reset your MyCDLClass password\n\nCreate a new password: ${actionUrl}\n\nIf you didn't request this, you can ignore this email.\n\nMyCDLClass`
  return send(to, "Reset your MyCDLClass password", html, text)
}
