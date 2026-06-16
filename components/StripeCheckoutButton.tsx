"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function StripeCheckoutButton({
  slug,
  lang = "en",
  price,
}: {
  slug: string
  lang?: "en" | "es"
  price: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const t =
    lang === "es"
      ? {
          buy: `Comprar por $${price}`,
          loading: "Redirigiendo al pago...",
          generic: "No se pudo iniciar el pago. Inténtalo de nuevo.",
          secure: "Pago seguro con tarjeta vía Stripe",
        }
      : {
          buy: `Buy Now — $${price}`,
          loading: "Redirecting to checkout...",
          generic: "Could not start checkout. Please try again.",
          secure: "Secure card payment via Stripe",
        }

  async function handleClick() {
    setLoading(true)
    setError("")

    // Ensure the user is logged in before checkout so the purchase links to them.
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const next = encodeURIComponent(`/courses/${slug}${lang === "es" ? "?lang=es" : ""}`)
      router.push(`/login?next=${next}`)
      return
    }

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, lang }),
      })

      if (res.status === 401) {
        const next = encodeURIComponent(`/courses/${slug}${lang === "es" ? "?lang=es" : ""}`)
        router.push(`/login?next=${next}`)
        return
      }

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(t.generic)
        setLoading(false)
      }
    } catch {
      setError(t.generic)
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-60"
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
            {t.loading}
          </>
        ) : (
          t.buy
        )}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-center text-xs text-gray-500">{t.secure}</p>
    </div>
  )
}
