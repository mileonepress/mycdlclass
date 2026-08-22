import { NextResponse } from "next/server"
import { getDashboardAdmin } from "@/lib/dashboard/authz"
import { fileMapFromZip, parseBundle } from "@/lib/dashboard/importer/parseBundle"
import { runDryRun } from "@/lib/dashboard/importer/dryRun"
import { fetchExistingLive } from "@/lib/dashboard/importer/liveFetcher"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_BYTES = 50 * 1024 * 1024 // 50 MB upload cap

/**
 * POST /api/dashboard/import/dry-run
 *
 * Admin-only. Accepts a staging bundle ZIP, parses it IN MEMORY, and diffs it
 * against the live catalog READ-ONLY. Returns create/update/unchanged/conflict
 * counts. Performs NO writes and NO status changes — this is the validation
 * surface the QA workflow uses before any (future, approved) apply step.
 */
export async function POST(request: Request) {
  const admin = await getDashboardAdmin()
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const form = await request.formData().catch(() => null)
  const file = form?.get("bundle")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing 'bundle' file" }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "bundle exceeds 50MB limit" }, { status: 413 })
  }

  const name = file.name.toLowerCase()
  if (!name.endsWith(".zip")) {
    return NextResponse.json({ error: "expected a .zip bundle" }, { status: 415 })
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer())
    const map = fileMapFromZip(bytes)
    const bundle = parseBundle(map)

    const parsedCounts = Object.fromEntries(
      Object.entries(bundle.csv).map(([k, v]) => [k, v?.length ?? 0]),
    )

    const result = await runDryRun(bundle, fetchExistingLive)

    return NextResponse.json({
      ok: true,
      manifest: bundle.manifest,
      parsedCounts,
      result,
    })
  } catch (err) {
    console.error("[v0] dry-run failed:", (err as Error).message)
    return NextResponse.json({ error: "failed to parse or diff bundle" }, { status: 422 })
  }
}
