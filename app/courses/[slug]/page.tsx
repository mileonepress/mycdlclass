import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  BookOpen,
  ClipboardCheck,
  CheckCircle2,
  PlayCircle,
  Lock,
  Globe,
  Clock,
} from "lucide-react"
import SiteHeader from "@/components/SiteHeader"
import Footer from "@/components/Footer"
import CourseBuyButton from "@/components/courses/CourseBuyButton"
import { getCourseBySlug, hasEntitlement } from "@/lib/courses/queries"
import { getCoursePresentation, getCourseCover, formatPrice } from "@/lib/courses/presentation"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug, "en")
  if (!course) return { title: "Course not found" }
  return {
    title: course.seoTitle ?? `${course.title} — Interactive CDL Course`,
    description:
      course.seoDescription ??
      course.shortDescription ??
      `Interactive ${course.title} CDL practice with ${course.questionCount} questions and instant explanations.`,
    alternates: { canonical: `/courses/${course.slug}` },
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = await getCourseBySlug(slug, "en")
  if (!course) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const owned = await hasEntitlement(user?.id ?? null, course.id)

  const pres = getCoursePresentation(course.slug)
  const cover = getCourseCover(course.slug)
  const priceLabel = formatPrice(course.priceCents)
  const totalLessons = course.sections.reduce((n, s) => n + s.lessons.length, 0)

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      {/* Hero */}
      <section className={`bg-gradient-to-br ${pres.gradient} px-6 py-12 text-white`}>
        <div className="mx-auto max-w-7xl">
          <nav className="mb-6 text-sm font-bold text-white/70" aria-label="Breadcrumb">
            <Link href="/courses" className="hover:text-white">
              Courses
            </Link>{" "}
            <span aria-hidden="true">/</span> <span className="text-white">{course.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            <div>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-[72px] shrink-0 overflow-hidden rounded-xl bg-white/10 shadow-lg ring-1 ring-white/20">
                  <Image
                    src={cover || "/placeholder.svg"}
                    alt={`${course.title} interactive CDL course cover`}
                    fill
                    sizes="72px"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-extrabold">
                  <span className="rounded-full bg-white/15 px-3 py-1 uppercase tracking-wide">Interactive CDL</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
                    <Globe className="h-3.5 w-3.5" aria-hidden="true" /> EN / ES
                  </span>
                </div>
              </div>

              <h1 className="mt-6 text-balance text-4xl font-extrabold leading-tight md:text-5xl">
                {course.title}
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-lg text-white/85">
                {course.shortDescription ?? pres.blurb}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-white/85">
                <span className="inline-flex items-center gap-2">
                  <BookOpen className="h-4 w-4" aria-hidden="true" /> {course.questionCount} questions
                </span>
                <span className="inline-flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" aria-hidden="true" /> {course.examCount} practice exams
                </span>
                {course.estimatedMinutes ? (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4" aria-hidden="true" /> ~{course.estimatedMinutes} min
                  </span>
                ) : null}
              </div>
            </div>

            {/* Purchase card */}
            <div className="rounded-3xl bg-white p-6 text-[#0D2B45] shadow-[0_24px_70px_rgba(6,26,46,0.25)]">
              {owned ? (
                <>
                  <div className="flex items-center gap-2 text-[#14a86b]">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    <span className="font-extrabold">You own this course</span>
                  </div>
                  <p className="mt-2 text-sm text-[#717680]">
                    Full access to all {course.questionCount} questions and {course.examCount} practice exams.
                  </p>
                  <Link
                    href={`/courses/${course.slug}/learn`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E4D8C] px-5 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
                  >
                    <PlayCircle className="h-5 w-5" aria-hidden="true" /> Continue Learning
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold tracking-tight">{priceLabel}</span>
                    <span className="text-sm font-bold text-[#717680]">one-time</span>
                  </div>
                  <p className="mt-1 text-sm text-[#717680]">Lifetime access. No subscription.</p>

                  <ul className="mt-5 space-y-2 text-sm font-medium">
                    {[
                      `All ${course.questionCount} exam-style questions`,
                      "Instant answer explanations",
                      "English & Spanish content",
                      "Progress tracking & scored exams",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#14a86b]" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <CourseBuyButton slug={course.slug} priceLabel={priceLabel} isAuthed={Boolean(user)} />
                  </div>

                  <Link
                    href={`/courses/${course.slug}/preview`}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1E4D8C] px-5 py-2.5 font-bold text-[#1E4D8C] transition-colors hover:bg-[#EFF6FF]"
                  >
                    <PlayCircle className="h-5 w-5" aria-hidden="true" /> Try 3 Questions Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold">What&apos;s inside</h2>
          <p className="mt-2 text-[#717680]">
            {course.sections.length} sections &middot; {totalLessons} practice sets
          </p>

          <div className="mt-8 space-y-4">
            {course.sections.map((section, i) => (
              <div key={section.id} className="overflow-hidden rounded-2xl border border-[#F1F5F9] bg-white">
                <div className="flex items-center justify-between gap-4 border-b border-[#F1F5F9] bg-[#F8FAFC] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E4D8C] text-sm font-extrabold text-white">
                      {i + 1}
                    </span>
                    <h3 className="font-extrabold text-[#0D2B45]">{section.title}</h3>
                  </div>
                  <span className="text-xs font-bold text-[#717680]">{section.lessons.length} sets</span>
                </div>
                <ul className="divide-y divide-[#F1F5F9]">
                  {section.lessons.map((lesson) => {
                    const unlocked = owned || lesson.isPreview
                    return (
                      <li key={lesson.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {unlocked ? (
                            <PlayCircle className="h-5 w-5 shrink-0 text-[#1E4D8C]" aria-hidden="true" />
                          ) : (
                            <Lock className="h-4 w-4 shrink-0 text-[#9aa3af]" aria-hidden="true" />
                          )}
                          <span className={`text-sm font-medium ${unlocked ? "text-[#0D2B45]" : "text-[#717680]"}`}>
                            {lesson.title}
                          </span>
                        </div>
                        {lesson.isPreview && !owned ? (
                          <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-extrabold text-[#1E4D8C]">
                            Preview
                          </span>
                        ) : lesson.estimatedMinutes ? (
                          <span className="text-xs font-bold text-[#717680]">{lesson.estimatedMinutes} min</span>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          {!owned && (
            <div className="mt-10 rounded-3xl border border-[#F1F5F9] bg-white p-8 text-center shadow-[0_12px_38px_rgba(6,21,36,0.06)]">
              <h3 className="text-2xl font-extrabold">Ready to start?</h3>
              <p className="mx-auto mt-2 max-w-md text-[#717680]">
                Take the free preview or unlock the full course for {priceLabel} — yours forever.
              </p>
              <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
                <Link
                  href={`/courses/${course.slug}/preview`}
                  className="flex-1 rounded-xl border-2 border-[#1E4D8C] px-5 py-3 font-bold text-[#1E4D8C] transition-colors hover:bg-[#EFF6FF]"
                >
                  Try 3 Free
                </Link>
                <div className="flex-1">
                  <CourseBuyButton slug={course.slug} priceLabel={priceLabel} isAuthed={Boolean(user)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
