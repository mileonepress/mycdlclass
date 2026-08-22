import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getCourseFamily } from "@/lib/dashboard/courseAdapter"
import { getQaHoldSummary } from "@/lib/dashboard/qaHold"
import { SectionCard, StatusBadge, StatCard } from "@/components/dashboard/ui"

export const dynamic = "force-dynamic"

// The route param is the course UUID (stable id). Named [slug] historically;
// treated as the family id to match listCourseFamilies() links.
export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug: id } = await params
  const [family, qa] = await Promise.all([getCourseFamily(id), getQaHoldSummary()])
  if (!family) notFound()

  const conflict = qa.rows.find((r) => r.slug === family.slug)?.conflict ?? false

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#1E4D8C] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to courses
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2B45]">{family.slug}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {family.category} · {family.courseType} · stable id {family.id.slice(0, 8)}…
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-400">Website status</span>
          <StatusBadge status={family.status} />
        </div>
      </header>

      {conflict && (
        <div className="flex items-start gap-3 rounded-xl border border-[#dc3545]/40 bg-[#dc3545]/8 p-4">
          <div>
            <p className="font-bold text-[#b02a37]">Publish-status conflict</p>
            <p className="mt-1 text-sm text-slate-600">
              This family is <strong>published</strong> on the live website, but the staging bundle marks it{" "}
              <strong>ready_for_review</strong>. The importer will NOT change live status. Resolution requires a
              deliberate, audited action after QA sign-off (proposed migration 0003).
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Sections" value={family.sectionCount} />
        <StatCard label="Lessons" value={family.lessonCount} />
        <StatCard label="Questions" value={family.questionCount} />
        <StatCard label="Practice tests" value={family.practiceTestCount} />
      </div>

      <SectionCard
        title="Localized offerings"
        description="One course family rendered per language. Text lives in course_translations."
      >
        <div className="space-y-3">
          {family.offerings.map((o) => (
            <div
              key={o.language}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-[#1E4D8C]/30 bg-[#EFF6FF] px-2 py-0.5 text-xs font-bold uppercase text-[#1E4D8C]">
                    {o.language}
                  </span>
                  <span className="font-semibold text-[#0D2B45]">{o.title ?? "— missing title —"}</span>
                </div>
                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  {o.shortDescription ?? "No short description on file."}
                </p>
              </div>
              <StatusBadge status={o.status} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Pricing & cover" description="Read-only view of catalog metadata.">
        <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Price</dt>
            <dd className="mt-1 font-mono text-[#0D2B45]">
              {family.isFree ? "Free" : `$${((family.priceCents ?? 0) / 100).toFixed(2)}`}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Estimated minutes</dt>
            <dd className="mt-1 font-mono text-[#0D2B45]">{family.estimatedMinutes ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Cover asset</dt>
            <dd className="mt-1 font-mono text-[#0D2B45]">{family.coverAsset ? "present" : "none"}</dd>
          </div>
        </dl>
      </SectionCard>
    </div>
  )
}
