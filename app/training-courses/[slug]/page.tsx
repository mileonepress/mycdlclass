import Link from "next/link"
import { notFound } from "next/navigation"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"
import StripeCheckoutButton from "@/components/StripeCheckoutButton"
import { getCourseDetail, type Lang } from "@/lib/supabase/courseCatalog"
import { canAccessCourse, getCurrentUser } from "@/lib/access"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = await getCourseDetail(slug, "en")
  if (!course) return { title: "Course not found" }
  return {
    title: `${course.title} — CDL Training Course`,
    description: course.shortDescription,
  }
}

function formatPrice(cents: number | null): string {
  if (!cents || cents <= 0) return "Free"
  return `$${(cents / 100).toFixed(2)}`
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}) {
  const { slug } = await params
  const { lang: langParam } = await searchParams
  const lang: Lang = langParam === "es" ? "es" : "en"
  const es = lang === "es"

  const course = await getCourseDetail(slug, lang)
  if (!course) notFound()

  const user = await getCurrentUser()
  const hasAccess = await canAccessCourse(course, user?.id ?? null)
  const langQuery = es ? "?lang=es" : ""

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-[#061A2E] px-6 py-14 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/training-courses${langQuery}`}
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            ← {es ? "Todos los cursos" : "All courses"}
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#4C8DE0]">
              {course.category || (es ? "Curso" : "Course")}
            </span>
            {course.isFree ? (
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-300">
                {es ? "Gratis" : "Free"}
              </span>
            ) : hasAccess ? (
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-300">
                {es ? "Adquirido" : "Owned"}
              </span>
            ) : (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                {formatPrice(course.priceCents)}
              </span>
            )}
          </div>
          <h1 className="mt-4 text-balance text-4xl font-extrabold md:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-pretty text-white/75">{course.shortDescription}</p>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-white/70">
            <span>
              {course.lessonCount} {es ? "exámenes de práctica" : "practice exams"}
            </span>
            {course.estimatedMinutes ? (
              <span>
                {course.estimatedMinutes} {es ? "minutos" : "minutes"}
              </span>
            ) : null}
            {course.passingScore ? (
              <span>
                {es ? "Aprobación" : "Passing score"}: {course.passingScore}%
              </span>
            ) : null}
          </div>

          {/* Purchase / language actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {!course.isFree && !hasAccess ? (
              user ? (
                <StripeCheckoutButton slug={course.slug} lang={lang} priceCents={course.priceCents} />
              ) : (
                <Link
                  href={`/login?next=/training-courses/${course.slug}${es ? "%3Flang=es" : ""}`}
                  className="rounded-lg bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
                >
                  {es ? "Inicia sesión para comprar" : "Log in to buy"}
                </Link>
              )
            ) : null}
            <Link
              href={es ? `/training-courses/${course.slug}` : `/training-courses/${course.slug}?lang=es`}
              className="rounded-lg border border-white/40 px-6 py-3 font-bold transition-colors hover:bg-white hover:text-[#061A2E]"
            >
              {es ? "View in English" : "Ver en Español"}
            </Link>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="mx-auto max-w-4xl px-6 py-14">
        <h2 className="text-2xl font-bold text-[#0D2B45]">
          {es ? "Contenido del curso" : "Course content"}
        </h2>

        <div className="mt-6 space-y-6">
          {course.sections.map((section) => (
            <div key={section.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 bg-[#F6F9FC] px-6 py-4">
                <h3 className="font-bold text-[#0D2B45]">{section.title}</h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {section.lessons.map((lesson) => {
                  const unlocked = hasAccess || lesson.isPreview
                  const href = `/training-courses/${course.slug}/quiz/${lesson.lessonKey}${langQuery}`
                  return (
                    <li key={lesson.id} className="flex items-center justify-between gap-4 px-6 py-4">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#0D2B45]">{lesson.title}</p>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {lesson.questionCount} {es ? "preguntas" : "questions"}
                          {lesson.isPreview ? ` · ${es ? "Vista previa gratis" : "Free preview"}` : ""}
                        </p>
                      </div>
                      {unlocked ? (
                        <Link
                          href={href}
                          className="shrink-0 rounded-lg bg-[#1E4D8C] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#173B66]"
                        >
                          {es ? "Comenzar" : "Start"}
                        </Link>
                      ) : (
                        <span
                          className="shrink-0 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-400"
                          aria-label={es ? "Bloqueado" : "Locked"}
                        >
                          🔒 {es ? "Bloqueado" : "Locked"}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {!course.isFree && !hasAccess ? (
          <div className="mt-10 rounded-2xl border border-[#1E4D8C]/20 bg-[#EAF2FC] p-6 text-center">
            <p className="text-lg font-bold text-[#0D2B45]">
              {es
                ? "Desbloquea todos los exámenes de práctica"
                : "Unlock all practice exams"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {es
                ? "Compra el curso completo por"
                : "Get full course access for"}{" "}
              {formatPrice(course.priceCents)}.
            </p>
            <div className="mt-4 flex justify-center">
              {user ? (
                <StripeCheckoutButton slug={course.slug} lang={lang} priceCents={course.priceCents} />
              ) : (
                <Link
                  href={`/login?next=/training-courses/${course.slug}`}
                  className="rounded-lg bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
                >
                  {es ? "Inicia sesión para comprar" : "Log in to buy"}
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </section>

      <Footer />
    </main>
  )
}
