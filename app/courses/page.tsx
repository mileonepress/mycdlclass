import type { Metadata } from "next"
import Link from "next/link"
import { GraduationCap, Globe, ShieldCheck, Sparkles } from "lucide-react"
import SiteHeader from "@/components/SiteHeader"
import Footer from "@/components/Footer"
import CourseCard from "@/components/courses/CourseCard"
import { getCourseCatalog, getOwnedCourseIds } from "@/lib/courses/queries"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Interactive CDL Courses — Practice Exams in English & Spanish",
  description:
    "Interactive CDL prep courses with real exam-style questions, instant explanations, and progress tracking. Try 3 questions free in every course, then unlock the full course.",
  alternates: { canonical: "/courses" },
}

export const dynamic = "force-dynamic"

export default async function CoursesPage() {
  const [courses, supabase] = await Promise.all([getCourseCatalog("en"), createClient()])
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const owned = await getOwnedCourseIds(user?.id ?? null)

  const totalQuestions = courses.reduce((sum, c) => sum + c.questionCount, 0)

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061A2E] via-[#0B2B5E] to-[#1E4D8C] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#7Fb2ff]">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Interactive Practice
          </p>
          <h1 className="mt-3 max-w-3xl text-balance text-4xl font-extrabold leading-tight md:text-6xl">
            Pass your CDL exam with interactive practice courses
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg text-white/80">
            Real exam-style questions with instant explanations, bilingual English &amp; Spanish content, and
            progress tracking. Try <span className="font-bold text-white">3 questions free</span> in any course,
            then unlock everything for a single one-time price.
          </p>

          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
            <Stat value={`${courses.length}`} label="CDL courses" />
            <Stat value={`${totalQuestions.toLocaleString()}`} label="Practice questions" />
            <Stat value="EN / ES" label="Bilingual" />
          </div>
        </div>
      </section>

      {/* Value strip */}
      <section className="border-b border-[#F1F5F9] bg-white px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-bold text-[#0D2B45]">
          <Perk icon={<GraduationCap className="h-5 w-5 text-[#1E4D8C]" />} text="Exam-style questions" />
          <Perk icon={<Globe className="h-5 w-5 text-[#1E4D8C]" />} text="English & Spanish" />
          <Perk icon={<ShieldCheck className="h-5 w-5 text-[#1E4D8C]" />} text="One-time purchase, yours forever" />
        </div>
      </section>

      {/* Catalog */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-extrabold">Choose your course</h2>
              <p className="mt-2 text-[#717680]">Every course includes a free 3-question preview.</p>
            </div>
          </div>

          {courses.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-[#F1F5F9] bg-white p-8 text-center text-[#717680]">
              Courses are being prepared. Please check back shortly.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} owned={owned.has(course.id)} />
              ))}
            </div>
          )}

          <div className="mt-12 rounded-3xl bg-gradient-to-br from-[#0B2B5E] to-[#1477DA] p-8 text-center text-white">
            <h3 className="text-2xl font-extrabold">Prefer to study offline?</h3>
            <p className="mx-auto mt-2 max-w-xl text-white/80">
              Our bilingual CDL prep ebooks give you the same trusted content as a downloadable PDF.
            </p>
            <Link
              href="/ebooks"
              className="mt-5 inline-flex rounded-xl bg-white px-6 py-3 font-extrabold text-[#0B2B5E] transition-transform hover:-translate-y-0.5"
            >
              Browse CDL Ebooks
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
