import Link from "next/link"
import { notFound } from "next/navigation"
import SiteHeader from "@/components/SiteHeader"
import { getLessonQuiz, FREE_PREVIEW_QUESTION_LIMIT, type Lang } from "@/lib/supabase/courseCatalog"
import { canAccessCourse, getCurrentUser } from "@/lib/access"
import QuizClient from "./QuizClient"

export const dynamic = "force-dynamic"

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; lessonKey: string }>
  searchParams: Promise<{ lang?: string }>
}) {
  const { slug, lessonKey } = await params
  const { lang: langParam } = await searchParams
  const lang: Lang = langParam === "es" ? "es" : "en"
  const es = lang === "es"

  const quiz = await getLessonQuiz(slug, lessonKey, lang)
  if (!quiz) notFound()

  const user = await getCurrentUser()
  const hasCourseAccess = await canAccessCourse(quiz.course, user?.id ?? null)
  const canView = hasCourseAccess || quiz.lesson.isPreview

  // Non-owners only ever get the free 3-question sample, even on a preview
  // lesson that technically contains the full exam.
  const previewMode = !hasCourseAccess && quiz.lesson.isPreview
  const totalQuestions = quiz.questions.length
  const questions = previewMode
    ? quiz.questions.slice(0, FREE_PREVIEW_QUESTION_LIMIT)
    : quiz.questions

  if (!canView) {
    return (
      <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
        <SiteHeader />
        <section className="mx-auto max-w-lg px-6 py-24 text-center">
          <div className="text-4xl">🔒</div>
          <h1 className="mt-4 text-2xl font-bold">
            {es ? "Esta lección está bloqueada" : "This lesson is locked"}
          </h1>
          <p className="mt-2 text-gray-600">
            {es
              ? "Compra el curso para acceder a todos los exámenes de práctica."
              : "Purchase the course to access all practice exams."}
          </p>
          <Link
            href={`/training-courses/${slug}${es ? "?lang=es" : ""}`}
            className="mt-6 inline-block rounded-lg bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
          >
            {es ? "Ver el curso" : "View the course"}
          </Link>
        </section>
      </main>
    )
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
        <SiteHeader />
        <section className="mx-auto max-w-lg px-6 py-24 text-center">
          <h1 className="text-2xl font-bold">{quiz.lesson.title}</h1>
          <p className="mt-2 text-gray-600">
            {es ? "Este examen aún no tiene preguntas." : "This exam has no questions yet."}
          </p>
          <Link
            href={`/training-courses/${slug}${es ? "?lang=es" : ""}`}
            className="mt-6 inline-block rounded-lg bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
          >
            {es ? "Volver al curso" : "Back to course"}
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />
      <QuizClient
        slug={slug}
        lang={lang}
        courseId={quiz.course.id}
        courseTitle={quiz.course.title}
        lessonId={quiz.lesson.id}
        lessonTitle={quiz.lesson.title}
        passingScore={quiz.course.passingScore ?? 80}
        isLoggedIn={!!user}
        questions={questions}
        previewMode={previewMode}
        totalCourseQuestions={totalQuestions}
        priceCents={quiz.course.priceCents}
      />
    </main>
  )
}
