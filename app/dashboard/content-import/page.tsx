import { SectionCard } from "@/components/dashboard/ui"
import { ImportClient } from "./ImportClient"

export const dynamic = "force-dynamic"

export default function ContentImportPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#0D2B45]">Content Import</h1>
        <p className="mt-1 text-sm text-slate-500">
          Validate a staging bundle against live content before any import. Dry-run only.
        </p>
      </header>

      <SectionCard
        title="Dry-run validator"
        description="Upload the bundle ZIP. It is parsed in memory and diffed read-only against the live catalog by stable id."
      >
        <ImportClient />
      </SectionCard>

      <SectionCard title="How the importer stays safe" description="Guarantees enforced by the diff engine.">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Every row upserts on its stable UUID — re-running the same bundle creates zero duplicates.</li>
          <li>Imported content defaults to <code>ready_for_review</code>; publishing is a separate, audited action.</li>
          <li>
            Any row that would change a live <strong>published</strong> course&apos;s status is surfaced as a
            conflict, never auto-applied.
          </li>
          <li>Processing runs server-side in dependency order; no per-row client writes.</li>
        </ul>
      </SectionCard>
    </div>
  )
}
