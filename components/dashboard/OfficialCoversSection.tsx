import { BadgeCheck, CheckCircle2, Link2 } from "lucide-react"
import { getOfficialCoversData, type CoverTile } from "@/lib/dashboard/officialCovers"
import { SectionCard, StatusBadge } from "@/components/dashboard/ui"

/**
 * Official Covers dashboard section (shared by /dashboard/courses and
 * /dashboard/e-books). Read-only preview + approval surface.
 *
 * Presentation follows OFFICIAL_COVER_INTEGRATION.md exactly:
 *  - 2:3 card frame, #07131F matte, object-contain (never crop), 12px radius
 *  - WebP preview with JPG <source> fallback
 *  - Language badge sits OUTSIDE the image; price/action/format text below it
 *  - Legacy generic cover shown as "Legacy fallback" (preserved, not replaced)
 */

const COVER_BG = "#07131F"

function MetaBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "official" | "verified" }) {
  const cls =
    tone === "official"
      ? "border-[#1E4D8C]/30 bg-[#EFF6FF] text-[#1E4D8C]"
      : tone === "verified"
        ? "border-[#14a86b]/30 bg-[#14a86b]/10 text-[#0f7a4e]"
        : "border-slate-300 bg-slate-50 text-slate-600"
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {children}
    </span>
  )
}

function CoverCard({ tile, slug }: { tile: CoverTile; slug: string }) {
  const primary = tile.webp ?? tile.jpg
  const langLabel = tile.lang === "en" ? "English" : "Español"

  return (
    <div className="flex flex-col gap-2">
      {/* Language badge OUTSIDE the image (spec) */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-md border border-[#1E4D8C]/30 bg-[#EFF6FF] px-2 py-0.5 text-xs font-bold text-[#1E4D8C]">
          {langLabel}
        </span>
        {primary ? <StatusBadge status={primary.status} /> : <span className="text-xs text-slate-400">missing</span>}
      </div>

      {/* 2:3 cover frame — contain on #07131F, no cropping, subtle border, 12px radius */}
      <div
        className="relative w-full overflow-hidden rounded-xl border border-slate-700/40 shadow-sm"
        style={{ aspectRatio: "2 / 3", backgroundColor: COVER_BG }}
      >
        {primary ? (
          <picture>
            {tile.webp ? <source srcSet={tile.webp.publicUrl} type="image/webp" /> : null}
            {tile.jpg ? <source srcSet={tile.jpg.publicUrl} type="image/jpeg" /> : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(tile.jpg ?? tile.webp)!.publicUrl}
              alt={tile.altText ?? `Official ${slug} ${langLabel} cover`}
              className="absolute inset-0 h-full w-full"
              style={{ objectFit: "contain" }}
              loading="lazy"
            />
          </picture>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">No official cover</div>
        )}
      </div>

      {/* Metadata BELOW the image (spec: never over the artwork) */}
      {primary ? (
        <div className="flex flex-wrap gap-1">
          <MetaBadge tone="official">
            <BadgeCheck className="h-3 w-3" aria-hidden /> Official
          </MetaBadge>
          {tile.webp ? <MetaBadge>WebP</MetaBadge> : null}
          {tile.jpg ? <MetaBadge>JPG</MetaBadge> : null}
          {primary.width && primary.height ? <MetaBadge>{primary.width}×{primary.height}</MetaBadge> : null}
          {primary.checksumVerified ? (
            <MetaBadge tone="verified">
              <CheckCircle2 className="h-3 w-3" aria-hidden /> Checksum verified
            </MetaBadge>
          ) : null}
        </div>
      ) : null}

      {/* Linkage: same cover connected to course and eBook */}
      <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
        {tile.connectedToCourse ? (
          <span className="inline-flex items-center gap-1"><Link2 className="h-3 w-3" aria-hidden /> Course</span>
        ) : null}
        {tile.connectedToEbook ? (
          <span className="inline-flex items-center gap-1"><Link2 className="h-3 w-3" aria-hidden /> eBook</span>
        ) : null}
      </div>
    </div>
  )
}

export async function OfficialCoversSection() {
  const { families, totals } = await getOfficialCoversData()

  return (
    <SectionCard
      title="Official Covers"
      description="Versioned official artwork (ready for review). Preview + approval only — legacy covers stay as fallback, nothing is published or replaced."
      right={
        <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-sm font-bold text-[#1E4D8C]">
          {totals.officialRecords} records · {totals.families} families
        </span>
      }
    >
      <div className="space-y-6">
        {families.map((fam) => (
          <div key={fam.courseId} className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#0D2B45]">{fam.slug}</span>
                <span className="text-xs text-slate-400">
                  {fam.hasEbook ? "course + eBook" : "course only"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">website:</span>
                <StatusBadge status={fam.courseStatus} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {fam.tiles.map((tile) => (
                <CoverCard key={`${fam.courseId}-${tile.lang}`} tile={tile} slug={fam.slug} />
              ))}

              {/* Legacy fallback tile (preserved, not replaced) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-500">
                    Legacy fallback
                  </span>
                </div>
                <div
                  className="relative w-full overflow-hidden rounded-xl border border-slate-700/40 shadow-sm"
                  style={{ aspectRatio: "2 / 3", backgroundColor: COVER_BG }}
                >
                  {fam.legacyFallback ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fam.legacyFallback.publicUrl || "/placeholder.svg"}
                      alt={`Legacy ${fam.slug} cover`}
                      className="absolute inset-0 h-full w-full"
                      style={{ objectFit: "contain" }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                      No legacy asset
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">Kept until preview approval</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
