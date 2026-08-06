import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Sparkles } from "lucide-react"
import SiteHeader from "@/components/SiteHeader"
import Footer from "@/components/Footer"
import QuizPlayer from "@/components/courses/QuizPlayer"
import LanguageToggle from "@/components/courses/LanguageToggle"
import { getCourseBySlug, getPreviewQuestions } from "@/lib/courses/queries"
import { formatPrice } from "@/lib/courses/presentation"
import { getQuizStrings, normalizeLang } from "@/lib/courses/quizStrings"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug, "en")
  if (!course) return { title: "Preview not found" }
  return {
    title: `Free Preview — ${course.title} CDL Practice`,
    description: `Try 3 free ${course.title} CDL practice questions with instant explanations. No account required.`,
    alternates: { canonical: `/courses/${course.slug}/preview` },
    robots: { index: false },
  }
}

export default async function CoursePreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}) {
  const { slug } = await params
  const lang = normalizeLang((await searchParams).lang)
  const t = getQuizStrings(lang)

  const course = await getCourseBySlug(slug, lang)
  if (!course) notFound()

  const questions = await getPreviewQuestions(course.id, lang)

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      <section className="px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E4D8C] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t.backTo(course.title)}
            </Link>
            <LanguageToggle basePath={`/courses/${course.slug}/preview`} current={lang} />
          </div>

          <div className="mt-5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#14a86b] px-3 py-1 text-xs font-extrabold text-white">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> {t.freePreview}
            </span>
            <span className="text-sm font-bold text-[#717680]">{t.noAccountNeeded}</span>
          </div>

          <h1 className="mt-4 text-balance text-3xl font-extrabold md:text-4xl">
            {t.previewHeading(course.title)}
          </h1>
          <p className="mt-3 text-[#717680]">
            {t.previewIntro(course.questionCount, formatPrice(course.priceCents))}
          </p>

          <div className="mt-8">
            <QuizPlayer
              questions={questions}
              mode="preview"
              courseSlug={course.slug}
              courseTitle={course.title}
              priceLabel={formatPrice(course.priceCents)}
              lang={lang}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
