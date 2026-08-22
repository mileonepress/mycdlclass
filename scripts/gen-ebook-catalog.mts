/**
 * Generate lib/dashboard/data/ebook-catalog.json from the staging bundle.
 *
 * Emits ONLY non-sensitive catalog configuration (slugs, titles, languages,
 * store product IDs, storage paths, checksums, byte sizes) — NO binaries, NO
 * secrets, NO customer/purchase data. This lets the preview eBook dashboard
 * render the planned 9-family / 18-edition catalog without committing the ZIP.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs"
import { join, dirname } from "node:path"
import Papa from "papaparse"
import { parseBundle, type FileMap } from "../lib/dashboard/importer/parseBundle"

const bundleDir = process.argv[2]
const outPath = process.argv[3] ?? "lib/dashboard/data/ebook-catalog.json"
if (!bundleDir) throw new Error("usage: gen-ebook-catalog.mts <extracted-bundle-dir> [out]")

function walk(dir: string, base = dir, map: FileMap = new Map()): FileMap {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, base, map)
    else map.set(full.slice(base.length + 1), new Uint8Array(readFileSync(full)))
  }
  return map
}

const map = walk(bundleDir)
const bundle = parseBundle(map)

// ---- store product mapping (non-sensitive; approved working mapping) ----
const storeKey = [...map.keys()].find((f) => f.endsWith("store_product_mapping.csv"))
type Store = {
  apple: string
  google: string
  doNotReuse: string
  price: string
  releaseGate: string
  displayName: string
}
const storeBySlugLang = new Map<string, Store>()
if (storeKey) {
  const txt = Buffer.from(map.get(storeKey)!).toString("utf8")
  const rows = Papa.parse<Record<string, string>>(txt.trim(), { header: true, skipEmptyLines: true }).data
  for (const r of rows) {
    storeBySlugLang.set(`${r.course_slug}:${r.language_code}`, {
      apple: r.apple_iap_product_id_required_unique,
      google: r.google_play_product_id_required_unique,
      doNotReuse: r.provided_apple_id_reference_do_not_reuse,
      price: r.price_usd,
      releaseGate: r.release_gate,
      displayName: r.display_name,
    })
  }
}

const ebooks = bundle.csv.ebooks ?? []
const translations = bundle.csv.ebook_translations ?? []
const files = bundle.csv.ebook_files ?? []
const covers = bundle.csv.ebook_covers ?? []

const catalog = {
  generatedFrom: bundle.manifest?.bundle ?? "staging bundle",
  note: "Non-sensitive catalog metadata for the preview dashboard. No binaries, secrets, or customer data.",
  totals: {
    families: ebooks.length,
    editions: translations.length,
    files: files.length,
    covers: covers.length,
  },
  families: ebooks.map((e) => {
    const id = String(e.id)
    const slug = String(e.slug)
    const t = translations.filter((x) => String(x.ebook_id) === id)
    const f = files.filter((x) => String(x.ebook_id) === id)
    const c = covers.filter((x) => String(x.ebook_id) === id)
    return {
      id,
      slug,
      courseId: String(e.course_id),
      status: String(e.status),
      editions: t.map((tr) => {
        const lang = String(tr.language_code)
        const store = storeBySlugLang.get(`${slug}:${lang}`)
        const file = f.find((x) => String(x.language_code) === lang)
        return {
          language: lang,
          title: String(tr.title),
          subtitle: String(tr.subtitle ?? ""),
          priceUsd: store?.price ?? "14.99",
          appleProductId: store?.apple ?? null,
          googleProductId: store?.google ?? null,
          doNotReuseId: store?.doNotReuse ?? null,
          releaseGate: store?.releaseGate ?? null,
          file: file
            ? {
                bucket: String(file.storage_bucket),
                storagePath: String(file.storage_path),
                bytes: Number(file.file_size_bytes ?? 0),
                pageCount: Number(file.page_count ?? 0),
                mime: String(file.mime_type),
                checksum: String(file.checksum_sha256),
                status: String(file.status),
              }
            : null,
        }
      }),
      cover: c[0]
        ? {
            bucket: String(c[0].storage_bucket),
            storagePath: String(c[0].storage_path),
            mime: String(c[0].mime_type),
            altEn: String(c[0].alt_text_en ?? ""),
            altEs: String(c[0].alt_text_es ?? ""),
            status: String(c[0].status),
          }
        : null,
    }
  }),
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(catalog, null, 2))
console.log(
  `wrote ${outPath}: ${catalog.totals.families} families / ${catalog.totals.editions} editions / ${catalog.totals.files} files / ${catalog.totals.covers} covers`,
)
