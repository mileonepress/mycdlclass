import Papa from "papaparse"
import { unzipSync, strFromU8 } from "fflate"
import type { ImportEntity } from "./diff"

/**
 * Bundle parsing (Checkpoint 2). Decoupled from storage: the core works on a
 * plain `FileMap` (relative path -> text/bytes) so the SAME logic serves the
 * on-disk test harness and the preview upload route (ZIP buffer). No network,
 * no Supabase, no writes.
 */
export type FileMap = Map<string, Uint8Array>

export interface BundleManifest {
  bundle?: string
  generated_at?: string
  version?: string | number
  counts?: Record<string, number>
  [k: string]: unknown
}

export interface ParsedBundle {
  root: string
  manifest: BundleManifest | null
  validationReport: Record<string, unknown> | null
  importOrder: string[]
  csv: Partial<Record<ImportEntity, Record<string, unknown>[]>>
  /** sha256 -> relative path, from checksum manifests if present. */
  checksums: Record<string, string>
  files: string[]
}

const INTERACTIVE_ENTITIES: ImportEntity[] = [
  "courses",
  "course_translations",
  "media_assets",
  "sections",
  "section_translations",
  "lessons",
  "lesson_translations",
  "lesson_blocks",
  "block_translations",
  "questions",
  "question_translations",
  "answer_choices",
  "choice_translations",
  "practice_tests",
  "practice_test_questions",
]
const EBOOK_ENTITIES: ImportEntity[] = [
  "ebooks",
  "ebook_translations",
  "ebook_files",
  "ebook_covers",
]

/** Build a FileMap from a ZIP archive buffer (preview upload path). */
export function fileMapFromZip(zip: Uint8Array): FileMap {
  const entries = unzipSync(zip)
  const map: FileMap = new Map()
  for (const [name, bytes] of Object.entries(entries)) {
    if (name.endsWith("/")) continue
    map.set(name, bytes)
  }
  return map
}

function parseCsv(text: string): Record<string, unknown>[] {
  const res = Papa.parse<Record<string, unknown>>(text.trim(), {
    header: true,
    skipEmptyLines: true,
  })
  return res.data
}

function findFile(files: string[], suffix: string): string | undefined {
  return files.find((f) => f.endsWith(suffix))
}

export function parseBundle(map: FileMap): ParsedBundle {
  const files = [...map.keys()].sort()
  const text = (rel: string | undefined): string | null =>
    rel && map.has(rel) ? strFromU8(map.get(rel)!) : null

  // Derive the archive root prefix (bundles nest under a top folder).
  const manifestPath = findFile(files, "manifest.json")
  const root = manifestPath ? manifestPath.slice(0, manifestPath.length - "manifest.json".length) : ""

  const manifestTxt = text(manifestPath)
  const manifest = manifestTxt ? (JSON.parse(manifestTxt) as BundleManifest) : null

  const vrTxt = text(findFile(files, "VALIDATION_REPORT.json"))
  const validationReport = vrTxt ? (JSON.parse(vrTxt) as Record<string, unknown>) : null

  const orderTxt = text(findFile(files, "IMPORT_ORDER.txt"))
  const importOrder = orderTxt
    ? orderTxt
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#"))
    : []

  const csv: ParsedBundle["csv"] = {}
  for (const entity of [...INTERACTIVE_ENTITIES, ...EBOOK_ENTITIES]) {
    // interactive CSVs live under interactive_courses/csv, eBooks under ebooks/csv
    const rel =
      findFile(files, `interactive_courses/csv/${entity}.csv`) ??
      findFile(files, `ebooks/csv/${entity}.csv`) ??
      findFile(files, `/csv/${entity}.csv`)
    const t = text(rel)
    if (t) csv[entity] = parseCsv(t)
  }

  // Checksums: support a SHA256SUMS-style file if present.
  const checksums: Record<string, string> = {}
  const sumsPath = findFile(files, "SHA256SUMS.txt") ?? findFile(files, "checksums.txt")
  const sumsTxt = text(sumsPath)
  if (sumsTxt) {
    for (const line of sumsTxt.split("\n")) {
      const m = line.trim().match(/^([a-f0-9]{64})\s+\*?(.+)$/i)
      if (m) checksums[m[1].toLowerCase()] = m[2]
    }
  }

  return { root, manifest, validationReport, importOrder, csv, checksums, files }
}
