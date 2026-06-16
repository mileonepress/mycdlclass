"use client"

import { useState } from "react"

export default function NewsletterSignup({
  source = "footer",
  heading = "Get CDL study tips & updates",
  subtext = "Free practice questions and exam tips in English and Spanish.",
}: {
  source?: string
  heading?: string
  subtext?: string
}) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      })
      const data = await res.json()
      setStatus(res.ok && data.ok ? "success" : "error")
      if (res.ok && data.ok) setEmail("")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-[#E7F7ED] p-6 text-center">
        <p className="font-bold text-[#16A34A]">You&apos;re subscribed!</p>
        <p className="mt-1 text-sm text-gray-600">Check your inbox for CDL study tips soon.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-[#0D2B45]">{heading}</h3>
      <p className="mt-1 text-sm text-gray-600">{subtext}</p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`newsletter-email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-email-${source}`}
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 p-3 text-[#0D2B45] focus:border-[#1E4D8C] focus:outline-none focus:ring-1 focus:ring-[#1E4D8C]"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-[#16A34A] px-6 py-3 font-bold text-white transition-colors hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </div>
  )
}
