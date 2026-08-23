import Link from "next/link"
import { ChevronRight, AlertTriangle } from "lucide-react"
import { listCourseFamilies } from "@/lib/dashboard/courseAdapter"
import { getQaHoldSummary } from "@/lib/dashboard/qaHold"
import { SectionCard, StatusBadge, LangBadge } from "@/components/dashboard/ui"
import { OfficialCoversSection } from "@/components/dashboard/OfficialCoversSection"

export const dynamic = "force-dynamic"

export default async function CoursesPage() {
  const [families, qa] = await Promise.all([listCourseFamilies(), getQaHoldSummary()])
  const conflictBySlug = new Map(qa.rows.map((r) => [r.slug, r.conflict]))
  const totalOfferings = families.reduce((n, f) => n + f.offeringCount, 0)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2B45]">Courses</h1>
          <p className="mt-1 text-sm text-slate-500">
            {families.length} course families · {totalOfferings} localized offerings (EN + ES)
          </p>
        </div>
        <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-sm font-bold text-[#1E4D8C]">
          {families.length} / {totalOfferings}
        </span>
      </header>

      <SectionCard title="Course families" description="Read-only. Editing/publishing lands after production approval of 0001/0003.">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3 font-semibold">Family</th>
                <th className="px-3 py-2 font-semibold">Editions</th>
                <th className="px-3 py-2 font-semibold">Website</th>
                <th className="px-3 py-2 font-semibold">Release</th>
                <th className="px-3 py-2 text-right font-semibold">Sections</th>
                <th className="px-3 py-2 text-right font-semibold">Lessons</th>
                <th className="px-3 py-2 text-right font-semibold">Questions</th>
                <th className="px-3 py-2 text-right font-semibold">Price</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {families.map((f) => {
                const en = f.translations.find((t) => t.language === "en")
                const es = f.translations.find((t) => t.language === "es")
                const conflict = conflictBySlug.get(f.slug)
                return (
                  <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        {conflict && (
                          <AlertTriangle className="h-4 w-4 text-[#dc3545]" aria-label="QA hold conflict" />
                        )}
                        <span className="font-semibold text-[#0D2B45]">{f.slug}</span>
                      </div>
                      <span className="text-xs text-slate-400">{f.category}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="flex gap-1">
                        <LangBadge lang="en" complete={!!en?.hasTitle} />
                        <LangBadge lang="es" complete={!!es?.hasTitle} />
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={f.status} />
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={conflict ? "qa_hold" : "ready_for_review"} />
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-600">{f.sectionCount}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-600">{f.lessonCount}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-600">{f.questionCount}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-600">
                      {f.isFree ? "Free" : `$${((f.priceCents ?? 0) / 100).toFixed(2)}`}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        href={`/dashboard/courses/${f.id}`}
                        className="inline-flex items-center text-[#1E4D8C] hover:underline"
                        aria-label={`View ${f.slug}`}
                      >
                        <ChevronRight className="h-5 w-5" aria-hidden />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <OfficialCoversSection />
    </div>
  )
}
