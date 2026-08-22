"use client"

import { useState } from "react"
import { UploadCloud, Loader2, CheckCircle2, AlertTriangle } from "lucide-react"

type EntityCount = {
  entity: string
  create: number
  update: number
  unchanged: number
  conflict: number
}
type Conflict = { entity: string; businessKey: string; reason: string }
type DryRun = {
  ok: boolean
  parsedCounts: Record<string, number>
  result: {
    ranAt: string
    entities: EntityCount[]
    conflicts: Conflict[]
    totals: { create: number; update: number; unchanged: number; conflict: number }
    zeroDuplicates: boolean
  }
}

export function ImportClient() {
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DryRun | null>(null)

  async function submit() {
    if (!file) return
    setBusy(true)
    setError(null)
    setData(null)
    try {
      const body = new FormData()
      body.append("bundle", file)
      const res = await fetch("/api/dashboard/import/dry-run", { method: "POST", body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "dry-run failed")
      setData(json)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6">
        <label className="flex cursor-pointer flex-col items-center gap-3 text-center">
          <UploadCloud className="h-10 w-10 text-[#1E4D8C]" aria-hidden />
          <span className="text-sm font-semibold text-[#0D2B45]">
            {file ? file.name : "Choose staging bundle (.zip)"}
          </span>
          <span className="text-xs text-slate-500">
            Parsed in memory and diffed against live content read-only. No writes are performed.
          </span>
          <input
            type="file"
            accept=".zip"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!file || busy}
        className="inline-flex items-center gap-2 rounded-lg bg-[#1E4D8C] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        {busy ? "Running dry-run…" : "Run dry-run"}
      </button>

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-[#dc3545]/40 bg-[#dc3545]/8 p-3 text-sm text-[#b02a37]">
          <AlertTriangle className="h-4 w-4" aria-hidden /> {error}
        </div>
      ) : null}

      {data ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {(
              [
                ["Create", data.result.totals.create, "danger"],
                ["Update", data.result.totals.update, "default"],
                ["Unchanged", data.result.totals.unchanged, "default"],
                ["Conflict", data.result.totals.conflict, "warning"],
                ["Zero dupes", data.result.zeroDuplicates ? "Yes" : "No", "success"],
              ] as const
            ).map(([label, value, accent]) => (
              <div
                key={label}
                className={`rounded-lg border bg-white p-4 ${
                  accent === "danger" && Number(value) > 0
                    ? "border-[#dc3545]/40"
                    : accent === "warning" && Number(value) > 0
                      ? "border-[#f6a21a]/40"
                      : "border-slate-200"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-bold text-[#0D2B45]">{value}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-600">
            Re-running the same bundle produces zero creates because every row upserts on its stable id. Conflicts are
            never auto-applied — they require deliberate QA resolution.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2 font-semibold">Entity</th>
                  <th className="px-4 py-2 text-right font-semibold">Create</th>
                  <th className="px-4 py-2 text-right font-semibold">Update</th>
                  <th className="px-4 py-2 text-right font-semibold">Unchanged</th>
                  <th className="px-4 py-2 text-right font-semibold">Conflict</th>
                </tr>
              </thead>
              <tbody>
                {data.result.entities.map((e) => (
                  <tr key={e.entity} className="border-b border-slate-100">
                    <td className="px-4 py-2 font-mono text-[#0D2B45]">{e.entity}</td>
                    <td className="px-4 py-2 text-right font-mono">{e.create}</td>
                    <td className="px-4 py-2 text-right font-mono">{e.update}</td>
                    <td className="px-4 py-2 text-right font-mono">{e.unchanged}</td>
                    <td
                      className={`px-4 py-2 text-right font-mono ${e.conflict > 0 ? "font-bold text-[#b02a37]" : ""}`}
                    >
                      {e.conflict}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.result.conflicts.length > 0 ? (
            <div className="rounded-xl border border-[#f6a21a]/40 bg-[#f6a21a]/8 p-4">
              <p className="flex items-center gap-2 font-bold text-[#a86a00]">
                <AlertTriangle className="h-4 w-4" aria-hidden /> {data.result.conflicts.length} conflict(s) held for
                review
              </p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {data.result.conflicts.map((c, i) => (
                  <li key={i}>
                    <code className="rounded bg-slate-100 px-1">{c.entity}</code> <strong>{c.businessKey}</strong> —{" "}
                    {c.reason}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-sm text-[#0f7a4e]">
              <CheckCircle2 className="h-4 w-4" aria-hidden /> No conflicts detected.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
