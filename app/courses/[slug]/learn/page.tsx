import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import SiteHeader from "@/components/SiteHeader"
import Footer from "@/components/Footer"
import QuizPlayer from "@/components/courses/QuizPlayer"
import LanguageToggle from "@/components/courses/LanguageToggle"
import { getCourseBySlug, getFullQuestions, hasEntitlement } from "@/lib/courses/queries"
import { verifyAndGrantFromSession } from "@/lib/courseEntitlements"
import { formatPrice } from "@/lib/courses/presentation"
import { langHref } from "@/lib/courses/siteStrings"
import { getQuizStrings, normalizeLang } from "@/lib/courses/quizStrings"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Course — Interactive CDL Practice",
  robots: { index: false },
}

export default async function CourseLearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ session_id?: string; lang?: string }>
}) {
  const { slug } = await params
  const { session_id, lang: rawLang } = await searchParams
  const lang = normalizeLang(rawLang)
  const t = getQuizStrings(lang)

  const course = await getCourseBySlug(slug, lang)
  if (!course) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Must be signed in to access owned content.
  if (!user) {
    redirect(`/login?next=/courses/${slug}/learn`)
  }

  // Post-checkout fallback: if arriving from Stripe with a session_id and the
  // webhook hasn't granted yet, verify + grant directly.
  let owned = await hasEntitlement(user.id, course.id)
  const justPurchased = Boolean(session_id) && !owned
  if (justPurchased && session_id) {
    owned = await verifyAndGrantFromSession(session_id, user.id, course.id)
  }

  const questions = owned ? await getFullQuestions(user.id, course.id, lang) : null

  // Not entitled — send back to the sales page.
  if (!questions) {
    redirect(`/courses/${slug}`)
  }

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      <section className="px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={langHref(`/courses/${course.slug}`, lang)}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E4D8C] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {course.title}
            </Link>
            <LanguageToggle
              basePath={`/courses/${course.slug}/learn`}
              current={lang}
              extraQuery={{ session_id }}
            />
          </div>

          {justPurchased && (
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#B7E4CC] bg-[#E7F7EF] px-4 py-3 text-sm font-bold text-[#0f7a4f]">
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" /> {t.purchaseComplete}
            </div>
          )}

          <h1 className="mt-5 text-balance text-3xl font-extrabold md:text-4xl">{course.title}</h1>
          <p className="mt-2 text-[#717680]">{t.passInfo(questions.length, course.passingScore)}</p>

          <div className="mt-8">
            <QuizPlayer
              questions={questions}
              mode="full"
              courseSlug={course.slug}
              courseId={course.id}
              courseTitle={course.title}
              priceLabel={formatPrice(course.priceCents)}
              passingScore={course.passingScore}
              lang={lang}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
