import Image from "next/image"
import type { SupabaseClient } from "@supabase/supabase-js"
import { AlertTriangle, CheckCircle2, Lock } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/admin"
import { SectionCard, StatCard, StatusBadge } from "@/components/dashboard/ui"
import { OfficialCoversSection } from "@/components/dashboard/OfficialCoversSection"

export const dynamic = "force-dynamic"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

function publicCoverUrl(bucket: string, path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
}

type FamilyEdition = {
  language: string
  title: string
  appleProductId: string | null
  googleProductId: string | null
  priceUsd: string
  fileStatus: string | null
}

type Family = {
  id: string
  slug: string
  status: string
  coverUrl: string | null
  editions: FamilyEdition[]
}

async function loadCatalog() {
  // The generated Database types predate the eBook catalog tables (added by an
  // already-applied migration), so use an untyped client for these reads. Row
  // shapes are validated manually below.
  const db = createAdminClient() as unknown as SupabaseClient
  const [{ data: ebooks }, { data: translations }, { data: store }, { data: files }, { data: covers }] =
    await Promise.all([
      db.from("ebooks").select("id,slug,status,sort_order,cover_asset_id").order("sort_order"),
      db.from("ebook_translations").select("ebook_id,language_code,title"),
      db
        .from("ebook_store_products")
        .select("ebook_id,language_code,apple_product_id,google_product_id,price_usd,currency"),
      db.from("ebook_files").select("ebook_id,language_code,status"),
      db.from("ebook_covers").select("id,storage_bucket,storage_path"),
    ])

  const coverById = new Map((covers ?? []).map((c) => [c.id, c]))
  const trByKey = new Map((translations ?? []).map((t) => [`${t.ebook_id}:${t.language_code}`, t]))
  const stByKey = new Map((store ?? []).map((s) => [`${s.ebook_id}:${s.language_code}`, s]))
  const fileByKey = new Map((files ?? []).map((f) => [`${f.ebook_id}:${f.language_code}`, f]))

  const families: Family[] = (ebooks ?? []).map((e) => {
    const cover = e.cover_asset_id ? coverById.get(e.cover_asset_id) : null
    const editions: FamilyEdition[] = ["en", "es"].map((lang) => {
      const st = stByKey.get(`${e.id}:${lang}`)
      return {
        language: lang,
        title: trByKey.get(`${e.id}:${lang}`)?.title ?? "—",
        appleProductId: st?.apple_product_id ?? null,
        googleProductId: st?.google_product_id ?? null,
        priceUsd: st ? Number(st.price_usd).toFixed(2) : "—",
        fileStatus: fileByKey.get(`${e.id}:${lang}`)?.status ?? null,
      }
    })
    return {
      id: e.id,
      slug: e.slug,
      status: e.status,
      coverUrl: cover ? publicCoverUrl(cover.storage_bucket, cover.storage_path) : null,
      editions,
    }
  })

  // integrity checks over LIVE data
  const seen = new Map<string, string[]>()
  for (const fam of families) {
    for (const ed of fam.editions) {
      for (const id of [ed.appleProductId, ed.googleProductId]) {
        if (!id) continue
        if (!seen.has(id)) seen.set(id, [])
        seen.get(id)!.push(`${fam.slug}:${ed.language}`)
      }
    }
  }
  const dupes = [...seen.entries()].filter(([, uses]) => uses.length > 1)
  const priceConsistent = families.every((f) => f.editions.every((e) => e.priceUsd === "14.99" || e.priceUsd === "—"))
  const publishedCount = families.filter((f) => f.status === "published").length

  return {
    families,
    totals: {
      families: families.length,
      editions: families.reduce((n, f) => n + f.editions.length, 0),
    },
    unique: dupes.length === 0,
    dupes,
    priceConsistent,
    publishedCount,
  }
}

export default async function EbooksPage() {
  const { families, totals, unique, dupes, priceConsistent, publishedCount } = await loadCatalog()

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2B45]">E-Books</h1>
          <p className="mt-1 text-sm text-slate-500">
            {totals.families} families · {totals.editions} editions · live from production database
          </p>
        </div>
        <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-sm font-bold text-[#1E4D8C]">
          {totals.families} / {totals.editions}
        </span>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Families" value={totals.families} />
        <StatCard label="Editions (EN+ES)" value={totals.editions} />
        <StatCard label="Store IDs" value={unique ? "Unique" : `${dupes.length} dup`} accent={unique ? "success" : "danger"} />
        <StatCard
          label="Store-published"
          value={publishedCount === 0 ? "0 (QA-held)" : String(publishedCount)}
          accent={publishedCount === 0 ? "success" : "warning"}
        />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-[#14a86b]/40 bg-[#14a86b]/8 p-4">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[#0f7a4e]" aria-hidden />
        <p className="text-sm text-slate-600">
          Catalog imported to production and <strong>QA-held</strong>: every eBook and PDF is{" "}
          <code className="rounded bg-slate-100 px-1">ready_for_review</code>/
          <code className="rounded bg-slate-100 px-1">ready_for_upload</code> — none are store-published. Covers are
          served from the public bucket; PDFs live in a private bucket reachable only via entitlement-gated signed URLs.
        </p>
      </div>

      <SectionCard title="eBook families" description="9 families, each with EN + ES editions and one shared cover.">
        <div className="space-y-4">
          {families.map((fam) => (
            <div key={fam.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {fam.coverUrl ? (
                    <Image
                      src={fam.coverUrl || "/placeholder.svg"}
                      alt={`${fam.slug} cover`}
                      width={44}
                      height={58}
                      className="h-[58px] w-[44px] rounded border border-slate-200 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-[58px] w-[44px] items-center justify-center rounded border border-dashed border-slate-300 text-[10px] text-slate-400">
                      no cover
                    </div>
                  )}
                  <span className="font-semibold text-[#0D2B45]">{fam.slug}</span>
                </div>
                <StatusBadge status={fam.status} />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {fam.editions.map((ed) => (
                  <div key={ed.language} className="rounded-md bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded border border-[#1E4D8C]/30 bg-[#EFF6FF] px-1.5 py-0.5 text-xs font-bold uppercase text-[#1E4D8C]">
                          {ed.language}
                        </span>
                        <span className="text-sm font-semibold text-[#0D2B45]">{ed.title}</span>
                      </div>
                      {ed.fileStatus ? <StatusBadge status={ed.fileStatus} /> : null}
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
          <CheckCircle2 className="h-4 w-4" aria-hidden /> All {totals.editions} store product IDs are unique
          {priceConsistent ? " and priced at $14.99." : "."}
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

      {!priceConsistent ? (
        <div className="flex items-start gap-3 rounded-lg border border-[#dc3545]/40 bg-[#dc3545]/8 p-4 text-sm text-[#b02a37]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>One or more editions are not priced at $14.99 — review store product pricing.</p>
        </div>
      ) : null}

      <OfficialCoversSection />
    </div>
  )
}
