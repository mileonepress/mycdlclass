import { AlertTriangle, CheckCircle2 } from "lucide-react"
import catalog from "@/lib/dashboard/data/ebook-catalog.json"
import { SectionCard, StatCard, StatusBadge } from "@/components/dashboard/ui"

export const dynamic = "force-dynamic"

type Edition = {
  language: string
  title: string
  subtitle: string
  priceUsd: string
  appleProductId: string | null
  googleProductId: string | null
}

function checkStoreIdUniqueness() {
  const seen = new Map<string, string[]>()
  for (const fam of catalog.families) {
    for (const ed of fam.editions as Edition[]) {
      for (const id of [ed.appleProductId, ed.googleProductId]) {
        if (!id) continue
        if (!seen.has(id)) seen.set(id, [])
        seen.get(id)!.push(`${fam.slug}:${ed.language}`)
      }
    }
  }
  const dupes = [...seen.entries()].filter(([, uses]) => uses.length > 1)
  return { unique: dupes.length === 0, dupes }
}

export default function EbooksPage() {
  const { unique, dupes } = checkStoreIdUniqueness()
  const priceConsistent = catalog.families.every((f) =>
    (f.editions as Edition[]).every((e) => e.priceUsd === "14.99"),
  )

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2B45]">E-Books</h1>
          <p className="mt-1 text-sm text-slate-500">
            {catalog.totals.families} families · {catalog.totals.editions} editions · {catalog.totals.files} PDFs ·{" "}
            {catalog.totals.covers} covers
          </p>
        </div>
        <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-sm font-bold text-[#1E4D8C]">
          {catalog.totals.families} / {catalog.totals.editions}
        </span>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Families" value={catalog.totals.families} />
        <StatCard label="Editions (EN+ES)" value={catalog.totals.editions} />
        <StatCard
          label="Store IDs"
          value={unique ? "Unique" : `${dupes.length} dup`}
          accent={unique ? "success" : "danger"}
        />
        <StatCard
          label="Price $14.99"
          value={priceConsistent ? "Consistent" : "Mismatch"}
          accent={priceConsistent ? "success" : "danger"}
        />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-[#f6a21a]/40 bg-[#f6a21a]/8 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#a86a00]" aria-hidden />
        <p className="text-sm text-slate-600">
          The eBook catalog schema (5 tables) is <strong>not yet applied to production</strong>. This view renders
          approved non-sensitive metadata from the staging bundle. Tables land via proposed migration{" "}
          <code className="rounded bg-slate-100 px-1">0002_ebook_catalog.sql</code> after approval; PDFs live in a
          private Supabase Storage bucket with entitlement-gated signed URLs.
        </p>
      </div>

      <SectionCard title="eBook families" description="9 families, each with EN + ES editions and one shared cover.">
        <div className="space-y-4">
          {catalog.families.map((fam) => (
            <div key={fam.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-[#0D2B45]">{fam.slug}</span>
                <StatusBadge status={fam.status} />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {(fam.editions as Edition[]).map((ed) => (
                  <div key={ed.language} className="rounded-md bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded border border-[#1E4D8C]/30 bg-[#EFF6FF] px-1.5 py-0.5 text-xs font-bold uppercase text-[#1E4D8C]">
                        {ed.language}
                      </span>
                      <span className="text-sm font-semibold text-[#0D2B45]">{ed.title}</span>
                    </div>
                    <dl className="mt-2 space-y-1 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <dt>Price</dt>
                        <dd className="font-mono text-[#0D2B45]">${ed.priceUsd}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>Apple</dt>
                        <dd className="truncate font-mono">{ed.appleProductId ?? "—"}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>Google</dt>
                        <dd className="truncate font-mono">{ed.googleProductId ?? "—"}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {unique ? (
        <p className="flex items-center gap-2 text-sm text-[#0f7a4e]">
          <CheckCircle2 className="h-4 w-4" aria-hidden /> All {catalog.totals.editions} store product IDs are unique.
        </p>
      ) : (
        <div className="rounded-lg border border-[#dc3545]/40 bg-[#dc3545]/8 p-4 text-sm text-[#b02a37]">
          <p className="font-bold">Duplicate store product IDs detected:</p>
          <ul className="mt-1 list-disc pl-5">
            {dupes.map(([id, uses]) => (
              <li key={id}>
                <code>{id}</code> used by {uses.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
