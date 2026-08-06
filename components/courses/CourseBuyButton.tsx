"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { langHref } from "@/lib/courses/siteStrings"
import type { Lang } from "@/lib/courses/types"

export default function CourseBuyButton({
  slug,
  priceLabel,
  isAuthed,
  className = "",
  label,
  loadingLabel = "Redirecting...",
  lang = "en",
}: {
  slug: string
  priceLabel: string
  isAuthed: boolean
  className?: string
  label?: string
  loadingLabel?: string
  lang?: Lang
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleClick() {
    // Purchases are tied to an account — send guests to log in first, then back.
    if (!isAuthed) {
      router.push(`/login?next=${encodeURIComponent(langHref(`/courses/${slug}`, lang))}`)
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/courses/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json()

      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(langHref(`/courses/${slug}`, lang))}`)
        return
      }
      if (res.status === 409) {
        // Already owns it — go straight to the course.
        router.push(langHref(`/courses/${slug}/learn`, lang))
        return
      }
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
        className={
          className ||
          "flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E4D8C] px-5 py-3 font-bold text-white transition-colors hover:bg-[#173B66] disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {loadingLabel}
          </>
        ) : (
          (label ?? `Unlock Full Course — ${priceLabel}`)
        )}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
