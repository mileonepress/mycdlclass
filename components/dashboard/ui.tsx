import type { ReactNode } from "react"

/** Shared presentational primitives for the secured content dashboard. */

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string
  value: ReactNode
  hint?: string
  accent?: "default" | "warning" | "danger" | "success"
}) {
  const ring =
    accent === "warning"
      ? "border-[#f6a21a]/40"
      : accent === "danger"
        ? "border-[#dc3545]/40"
        : accent === "success"
          ? "border-[#14a86b]/40"
          : "border-slate-200"
  return (
    <div className={`rounded-xl border ${ring} bg-white p-5 shadow-sm`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[#0D2B45]">{value}</p>
      {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-[#14a86b]/12 text-[#0f7a4e] border-[#14a86b]/30",
  ready_for_review: "bg-[#f6a21a]/12 text-[#a86a00] border-[#f6a21a]/30",
  qa_hold: "bg-[#dc3545]/12 text-[#b02a37] border-[#dc3545]/30",
  approved: "bg-[#14a86b]/12 text-[#0f7a4e] border-[#14a86b]/30",
  rejected: "bg-[#dc3545]/12 text-[#b02a37] border-[#dc3545]/30",
  draft: "bg-slate-100 text-slate-600 border-slate-300",
  archived: "bg-slate-100 text-slate-500 border-slate-300",
}

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600 border-slate-300"
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  )
}

export function LangBadge({ lang, complete }: { lang: string; complete: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-bold uppercase ${
        complete
          ? "border-[#1E4D8C]/30 bg-[#EFF6FF] text-[#1E4D8C]"
          : "border-slate-300 bg-slate-50 text-slate-400"
      }`}
    >
      {lang}
    </span>
  )
}

export function SectionCard({
  title,
  description,
  children,
  right,
}: {
  title: string
  description?: string
  children: ReactNode
  right?: ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-[#0D2B45]">{title}</h2>
          {description ? <p className="mt-0.5 text-sm text-slate-500">{description}</p> : null}
        </div>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}
