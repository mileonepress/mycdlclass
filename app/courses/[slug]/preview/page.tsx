import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Sparkles } from "lucide-react"
import SiteHeader from "@/components/SiteHeader"
import Footer from "@/components/Footer"
import QuizPlayer from "@/components/courses/QuizPlayer"
import { getCourseBySlug, getPreviewQuestions } from "@/lib/courses/queries"
import { formatPrice } from "@/lib/courses/presentation"

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
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = await getCourseBySlug(slug, "en")
  if (!course) notFound()

  const questions = await getPreviewQuestions(course.id, "en")

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      <section className="px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E4D8C] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to {course.title}
          </Link>

          <div className="mt-5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#14a86b] px-3 py-1 text-xs font-extrabold text-white">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Free Preview
            </span>
            <span className="text-sm font-bold text-[#717680]">No account needed</span>
          </div>

          <h1 className="mt-4 text-balance text-3xl font-extrabold md:text-4xl">
            {course.title}: 3 free practice questions
          </h1>
          <p className="mt-3 text-[#717680]">
            Answer each question to see instant feedback and an explanation. Ready for more? Unlock all{" "}
            {course.questionCount} questions for {formatPrice(course.priceCents)}.
          </p>

          <div className="mt-8">
            <QuizPlayer
              questions={questions}
              mode="preview"
              courseSlug={course.slug}
              courseTitle={course.title}
              priceLabel={formatPrice(course.priceCents)}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
