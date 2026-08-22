"use client"

import { useState } from "react"

type Props = {
  slug: string
  lang: "en" | "es"
  priceCents: number | null
}

function formatPrice(cents: number | null): string {
  if (!cents || cents <= 0) return ""
  return `$${(cents / 100).toFixed(2)}`
}

export default function StripeCheckoutButton({ slug, lang, priceCents }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const es = lang === "es"

  async function handleCheckout() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, lang }),
      })
      const data = await res.json()

      if (res.status === 401 || data?.error === "auth_required") {
        window.location.href = `/login?next=/training-courses/${slug}`
        return
      }
      if (data?.error === "already_owned") {
        window.location.reload()
        return
      }
      if (data?.url) {
        window.location.href = data.url
        return
      }
      setError(es ? "No se pudo iniciar el pago." : "Could not start checkout.")
      setLoading(false)
    } catch {
      setError(es ? "Algo salió mal. Inténtalo de nuevo." : "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const price = formatPrice(priceCents)

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-6 py-3 font-bold text-white transition-colors hover:bg-[#128a3e] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {es ? "Redirigiendo..." : "Redirecting..."}
          </>
        ) : (
          <>
            {es ? "Comprar curso" : "Buy course"}
            {price ? ` — ${price}` : ""}
          </>
        )}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
