"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { submitContactMessage } from "./actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-[#16A34A] px-6 py-3 font-bold text-white transition-colors hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending..." : "Send Message"}
    </button>
  )
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, { ok: false, error: null })

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-[#16A34A]/30 bg-[#16A34A]/10 p-8 text-center">
        <h2 className="text-2xl font-bold text-[#0D2B45]">Message sent</h2>
        <p className="mt-3 leading-relaxed text-gray-700">
          Thanks for reaching out. We&apos;ve received your message and will reply to your email as soon as possible.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-5">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-semibold text-[#0D2B45]">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[#0D2B45] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold text-[#0D2B45]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[#0D2B45] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-semibold text-[#0D2B45]">
            How can we help?
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            maxLength={5000}
            className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-[#0D2B45] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20"
            placeholder="Tell us about your question or issue..."
          />
        </div>

        {state?.error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
            {state.error}
          </p>
        )}

        <SubmitButton />
      </div>
    </form>
  )
}
