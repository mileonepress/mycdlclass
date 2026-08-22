import Link from "next/link"
import { AlertTriangle, Lock, ArrowRight } from "lucide-react"
import { getCatalogTotals } from "@/lib/dashboard/courseAdapter"
import { getQaHoldSummary } from "@/lib/dashboard/qaHold"
import { StatCard, SectionCard, StatusBadge } from "@/components/dashboard/ui"

export const dynamic = "force-dynamic"

export default async function DashboardOverview() {
  const [totals, qa] = await Promise.all([getCatalogTotals(), getQaHoldSummary()])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#0D2B45]">Content Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Live catalog from the primary Supabase project, read-only. Checkpoint 2 preview.
        </p>
      </header>

      {/* QA HOLD — prominent, enforced */}
      {qa.conflicts > 0 && (
        <div className="rounded-xl border-2 border-[#dc3545]/40 bg-[#dc3545]/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-[#dc3545]" aria-hidden />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#b02a37]">
                QA hold: {qa.conflicts} course famil{qa.conflicts === 1 ? "y" : "ies"} blocked from mobile-store release
              </h2>
              <p className="mt-1 text-sm text-[#7f1d1d]">
                These families are <strong>published on the website</strong> (availability unchanged) but the staging
                content is <strong>ready_for_review</strong>. Mobile-store publication is blocked until semantic QA is
                cleared and a separate production update is approved. No status is changed by this dashboard.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[#b02a37] ring-1 ring-[#dc3545]/30">
                <Lock className="h-4 w-4" aria-hidden />
                Publish / store-release approval disabled
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Course families" value={totals.families} hint="parent courses" />
        <StatCard
          label="Localized offerings"
          value={totals.localizedOfferings}
          hint="EN + ES editions"
        />
        <StatCard
          label="Website published"
          value={qa.websitePublished}
          hint="availability preserved"
          accent="success"
        />
        <StatCard
          label="Blocked for QA"
          value={qa.mobileReleaseBlocked}
          hint="mobile-store release"
          accent="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Website status" description="Current live course.status (unchanged in Checkpoint 2)">
          <ul className="space-y-2">
            {(["published", "ready_for_review", "draft", "archived"] as const).map((s) => (
              <li key={s} className="flex items-center justify-between">
                <StatusBadge status={s} />
                <span className="font-mono text-sm text-slate-600">{totals.byStatus[s]}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Release gate (mobile store)"
          description="Derived QA/release status — proposed migration 0003"
          right={
            <Link
              href="/dashboard/courses"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#1E4D8C] hover:underline"
            >
              View courses <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        >
          <ul className="space-y-2 text-sm">
            {qa.rows.map((r) => (
              <li key={r.courseId} className="flex items-center justify-between gap-3">
                <span className="truncate font-medium text-[#0D2B45]">{r.slug}</span>
                <span className="flex items-center gap-2">
                  <StatusBadge status={r.liveStatus} />
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                  <StatusBadge status={r.releaseStatus} />
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  )
}
