import type { Metadata } from "next"
import Link from "next/link"
import { GraduationCap, Globe, ShieldCheck, Sparkles } from "lucide-react"
import SiteHeader from "@/components/SiteHeader"
import Footer from "@/components/Footer"
import CourseCard from "@/components/courses/CourseCard"
import LanguageToggle from "@/components/courses/LanguageToggle"
import { getCourseCatalog, getOwnedCourseIds } from "@/lib/courses/queries"
import { getSiteStrings } from "@/lib/courses/siteStrings"
import { normalizeLang } from "@/lib/courses/quizStrings"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Interactive CDL Courses — Practice Exams in English & Spanish",
  description:
    "Interactive CDL prep courses with real exam-style questions, instant explanations, and progress tracking. Try 3 questions free in every course, then unlock the full course.",
  alternates: { canonical: "/courses" },
}

export const dynamic = "force-dynamic"

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const lang = normalizeLang((await searchParams)?.lang)
  const t = getSiteStrings(lang)

  const [courses, supabase] = await Promise.all([getCourseCatalog(lang), createClient()])
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const owned = await getOwnedCourseIds(user?.id ?? null)

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061A2E] via-[#0B2B5E] to-[#1E4D8C] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex justify-end">
            <LanguageToggle basePath="/courses" current={lang} />
          </div>
          <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#7Fb2ff]">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> {t.catalog.heroEyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl text-balance text-4xl font-extrabold leading-tight md:text-6xl">
            {t.catalog.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg text-white/80">
            {t.catalog.heroLeadPre}
            <span className="font-bold text-white">{t.catalog.heroLeadBold}</span>
            {t.catalog.heroLeadPost}
          </p>

          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
            <Stat value={`${courses.length}`} label={t.catalog.statCourses} />
            <Stat value="800+" label={t.catalog.statQuestions} />
            <Stat value="EN / ES" label={t.common.bilingual} />
          </div>
        </div>
      </section>

      {/* Value strip */}
      <section className="border-b border-[#F1F5F9] bg-white px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-bold text-[#0D2B45]">
          <Perk icon={<GraduationCap className="h-5 w-5 text-[#1E4D8C]" />} text={t.catalog.perkQuestions} />
          <Perk icon={<Globe className="h-5 w-5 text-[#1E4D8C]" />} text={t.catalog.perkBilingual} />
          <Perk icon={<ShieldCheck className="h-5 w-5 text-[#1E4D8C]" />} text={t.catalog.perkOneTime} />
        </div>
      </section>

      {/* Catalog */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-extrabold">{t.catalog.chooseTitle}</h2>
              <p className="mt-2 text-[#717680]">{t.catalog.chooseLead}</p>
            </div>
          </div>

          {courses.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-[#F1F5F9] bg-white p-8 text-center text-[#717680]">
              {t.catalog.empty}
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} owned={owned.has(course.id)} lang={lang} />
              ))}
            </div>
          )}

          <div className="mt-12 rounded-3xl bg-gradient-to-br from-[#0B2B5E] to-[#1477DA] p-8 text-center text-white">
            <h3 className="text-2xl font-extrabold">{t.catalog.offlineTitle}</h3>
            <p className="mx-auto mt-2 max-w-xl text-white/80">{t.catalog.offlineLead}</p>
            <Link
              href="/ebooks"
              className="mt-5 inline-flex rounded-xl bg-white px-6 py-3 font-extrabold text-[#0B2B5E] transition-transform hover:-translate-y-0.5"
            >
              {t.catalog.offlineCta}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <div className="text-2xl font-extrabold tracking-tight">{value}</div>
      <div className="text-xs font-bold text-white/70">{label}</div>
    </div>
  )
}

function Perk({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-2">
      {icon}
      {text}
    </span>
  )
}
