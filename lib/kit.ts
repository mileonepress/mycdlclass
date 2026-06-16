import "server-only"

/**
 * Kit (ConvertKit) lead capture helper.
 * Uses the Kit v4 API. Requires KIT_API_KEY. Optionally KIT_NEWSLETTER_FORM_ID
 * to add subscribers to a specific form (which can trigger Kit automations).
 *
 * All functions fail soft: lead capture should never break the core flow
 * (signup, purchase, etc.), so errors are logged and swallowed.
 */

const KIT_API_BASE = "https://api.kit.com/v4"

type SubscribeArgs = {
  email: string
  firstName?: string
  fields?: Record<string, string>
  formId?: string
}

export async function subscribeToKit({
  email,
  firstName,
  fields,
  formId,
}: SubscribeArgs): Promise<{ ok: boolean; skipped?: boolean; subscriberId?: string }> {
  const apiKey = process.env.KIT_API_KEY
  if (!apiKey) {
    console.warn("[v0] KIT_API_KEY not set — skipping Kit subscribe")
    return { ok: false, skipped: true }
  }

  try {
    // 1) Upsert the subscriber.
    const createRes = await fetch(`${KIT_API_BASE}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({
        email_address: email,
        first_name: firstName,
        fields,
      }),
    })

    let subscriberId: string | undefined
    if (!createRes.ok && createRes.status !== 422) {
      // 422 typically means "already exists" — not fatal.
      const text = await createRes.text()
      console.error("[v0] Kit subscriber upsert failed:", createRes.status, text)
    } else {
      try {
        const data = await createRes.json()
        const id = data?.subscriber?.id
        if (id != null) subscriberId = String(id)
      } catch {
        // Non-JSON body (e.g. on 422) — ignore.
      }
    }

    // 2) Optionally add to a form (triggers form-based automations).
    const targetForm = formId || process.env.KIT_NEWSLETTER_FORM_ID
    if (targetForm) {
      const formRes = await fetch(`${KIT_API_BASE}/forms/${targetForm}/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Kit-Api-Key": apiKey,
        },
        body: JSON.stringify({ email_address: email }),
      })
      if (!formRes.ok) {
        const text = await formRes.text()
        console.error("[v0] Kit form add failed:", formRes.status, text)
      }
    }

    return { ok: true, subscriberId }
  } catch (err) {
    console.error("[v0] Kit subscribe error:", err)
    return { ok: false }
  }
}
