import Link from "next/link"
import { Globe } from "lucide-react"
import type { Lang } from "@/lib/courses/types"

/**
 * EN/ES switch for the quiz experience. Renders as links that set ?lang= on the
 * current quiz route, so the server re-renders with the chosen language for both
 * the question content and the surrounding UI. No client JS required.
 */
export default function LanguageToggle({
  basePath,
  current,
  extraQuery,
}: {
  basePath: string
  current: Lang
  extraQuery?: Record<string, string | undefined>
}) {
  const options: { code: Lang; label: string }[] = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
  ]

  function href(code: Lang) {
    const params = new URLSearchParams()
    if (extraQuery) {
      for (const [k, v] of Object.entries(extraQuery)) {
        if (v) params.set(k, v)
      }
    }
    params.set("lang", code)
    return `${basePath}?${params.toString()}`
  }

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-[#E5EAF1] bg-white p-1 shadow-sm"
      role="group"
      aria-label="Course language"
    >
      <Globe className="ml-2 h-4 w-4 text-[#717680]" aria-hidden="true" />
      {options.map((opt) => {
        const active = opt.code === current
        return (
          <Link
            key={opt.code}
            href={href(opt.code)}
            aria-current={active ? "true" : undefined}
            className={`rounded-full px-3 py-1 text-sm font-bold transition-colors ${
              active ? "bg-[#1E4D8C] text-white" : "text-[#1E4D8C] hover:bg-[#EFF6FF]"
            }`}
          >
            {opt.label}
          </Link>
        )
      })}
    </div>
  )
}
