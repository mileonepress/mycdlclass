import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"
import derivativeManifest from "./data/official_cover_derivatives.json"

/**
 * Read-only loader for the Official Covers dashboard section.
 *
 * Sources are the LIVE production tables — never hardcoded catalog data:
 *   - public.media_assets  (official-cover:* rows + legacy fallback `cover` rows)
 *   - public.courses       (product family / slug / status)
 *   - public.ebooks        (eBook linkage via ebooks.course_id)
 *
 * This module performs NO writes and never mutates publication status.
 * Dimension + checksum badges come from the deterministic derivative manifest
 * produced at generation time (1200x1800, verified against uploaded objects).
 */

export type CoverLang = "en" | "es"

export interface CoverVariant {
  format: "webp" | "jpg"
  mimeType: string
  storagePath: string
  publicUrl: string
  width: number | null
  height: number | null
  bytes: number | null
  checksumSha256: string | null
  checksumVerified: boolean
  status: string
}

export interface CoverTile {
  lang: CoverLang
  altText: string | null
  webp: CoverVariant | null
  jpg: CoverVariant | null
  connectedToCourse: boolean
  connectedToEbook: boolean
}

export interface CoverFamily {
  courseId: string
  slug: string
  courseStatus: string
  hasEbook: boolean
  tiles: CoverTile[] // en, es
  legacyFallback: { storagePath: string; publicUrl: string } | null
}

export interface OfficialCoversData {
  families: CoverFamily[]
  totals: {
    families: number
    officialRecords: number
    webp: number
    jpg: number
    courseLinks: number
    ebookLinks: number
    anyPublished: number
    legacyFallbacks: number
  }
}

type DerivEntry = { file: string; width: number; height: number; bytes: number; sha256: string }
const derivByPath = new Map<string, DerivEntry>(
  (derivativeManifest as DerivEntry[]).map((d) => [d.file, d]),
)

interface MediaRow {
  course_id: string | null
  asset_key: string | null
  storage_bucket: string | null
  storage_path: string | null
  mime_type: string | null
  language_code: string | null
  status: string | null
  alt_text_en: string | null
  alt_text_es: string | null
}

function publicUrl(db: ReturnType<typeof createAdminClient>, bucket: string, path: string): string {
  const { data } = db.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// media_assets and the eBook tables postdate the generated Database types, so
// query them through an untyped view of the admin client. Row shapes are
// declared and validated in this module.
type UntypedSelect = {
  from: (t: string) => {
    select: (c: string) => {
      order?: (col: string, opts: { ascending: boolean }) => Promise<{ data: unknown[] | null }>
    } & Promise<{ data: unknown[] | null }>
  }
}

export async function getOfficialCoversData(): Promise<OfficialCoversData> {
  const db = createAdminClient()
  const udb = db as unknown as UntypedSelect

  const [{ data: courses }, { data: media }, { data: ebooks }] = await Promise.all([
    db.from("courses").select("id,slug,status").order("sort_order", { ascending: true }),
    udb
      .from("media_assets")
      .select("course_id,asset_key,storage_bucket,storage_path,mime_type,language_code,status,alt_text_en,alt_text_es"),
    udb.from("ebooks").select("id,course_id"),
  ])

  const ebookByCourse = new Set(
    ((ebooks ?? []) as { course_id: string | null }[]).map((e) => e.course_id).filter(Boolean) as string[],
  )
  const rows = (media ?? []) as MediaRow[]

  const officialRows = rows.filter((r) => (r.asset_key ?? "").startsWith("official-cover"))
  const legacyRows = rows.filter((r) => r.asset_key === "cover")
  const legacyByCourse = new Map<string, MediaRow>()
  for (const r of legacyRows) if (r.course_id) legacyByCourse.set(r.course_id, r)

  const families: CoverFamily[] = (courses ?? []).map((c) => {
    const hasEbook = ebookByCourse.has(c.id)
    const tiles: CoverTile[] = (["en", "es"] as CoverLang[]).map((lang) => {
      const forLang = officialRows.filter((r) => r.course_id === c.id && r.language_code === lang)
      const build = (fmt: "webp" | "jpg", mime: string): CoverVariant | null => {
        const row = forLang.find((r) => r.mime_type === mime)
        if (!row || !row.storage_path) return null
        const deriv = derivByPath.get(row.storage_path)
        return {
          format: fmt,
          mimeType: mime,
          storagePath: row.storage_path,
          publicUrl: publicUrl(db, row.storage_bucket ?? "public-assets", row.storage_path),
          width: deriv?.width ?? null,
          height: deriv?.height ?? null,
          bytes: deriv?.bytes ?? null,
          checksumSha256: deriv?.sha256 ?? null,
          checksumVerified: !!deriv,
          status: row.status ?? "unknown",
        }
      }
      const alt = forLang[0]
      return {
        lang,
        altText: lang === "en" ? (alt?.alt_text_en ?? null) : (alt?.alt_text_es ?? null),
        webp: build("webp", "image/webp"),
        jpg: build("jpg", "image/jpeg"),
        connectedToCourse: forLang.length > 0, // media_assets.course_id links the family
        connectedToEbook: forLang.length > 0 && hasEbook, // same cover family serves the eBook
      }
    })

    const legacy = legacyByCourse.get(c.id)
    return {
      courseId: c.id,
      slug: c.slug,
      courseStatus: String(c.status),
      hasEbook,
      tiles,
      legacyFallback:
        legacy && legacy.storage_path
          ? {
              storagePath: legacy.storage_path,
              publicUrl: publicUrl(db, legacy.storage_bucket ?? "public-assets", legacy.storage_path),
            }
          : null,
    }
  })

  const totals = {
    families: families.length,
    officialRecords: officialRows.length,
    webp: officialRows.filter((r) => r.mime_type === "image/webp").length,
    jpg: officialRows.filter((r) => r.mime_type === "image/jpeg").length,
    courseLinks: officialRows.filter((r) => r.course_id).length,
    ebookLinks: officialRows.filter((r) => r.course_id && ebookByCourse.has(r.course_id)).length,
    anyPublished: officialRows.filter((r) => r.status === "published").length,
    legacyFallbacks: legacyRows.length,
  }

  return { families, totals }
}
