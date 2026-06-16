"use client"

import { useState } from "react"

export default function EbookCheckoutButton({
  slug,
  price,
}: {
  slug: string
  price: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleClick() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/ebooks/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError("Could not start checkout. Please try again.")
        setLoading(false)
      }
    } catch {
      setError("Could not start checkout. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-5 py-2.5 font-bold text-white transition-colors hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Redirecting...
          </>
        ) : (
          `Buy PDF — $${price}`
        )}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
