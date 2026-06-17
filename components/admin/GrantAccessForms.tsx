"use client"

import { useActionState } from "react"
import { grantEbookAccess } from "@/app/admin/actions"

type Option = { slug: string; label: string }
type State = { ok: boolean; message: string }

const initial: State = { ok: false, message: "" }

export function GrantEbookForm({ ebooks }: { ebooks: Option[] }) {
  const [state, action, pending] = useActionState(grantEbookAccess, initial)

  return (
    <form action={action} className="flex flex-col gap-3">
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#0D2B45]">Recipient email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="customer@example.com"
          className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-[#0D2B45] focus:border-[#1E4D8C] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#0D2B45]">Ebook</label>
        <select
          name="ebook_slug"
          required
          className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-[#0D2B45] focus:border-[#1E4D8C] focus:outline-none"
        >
          {ebooks.map((e) => (
            <option key={e.slug} value={e.slug}>
              {e.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex items-center justify-center rounded-lg bg-[#1E4D8C] px-5 py-2.5 font-bold text-white transition-colors hover:bg-[#163d6e] disabled:opacity-60"
      >
        {pending ? "Sending..." : "Issue ebook & email link"}
      </button>
      {state.message && (
        <p className={`text-sm ${state.ok ? "text-[#16A34A]" : "text-red-600"}`}>{state.message}</p>
      )}
    </form>
  )
}
