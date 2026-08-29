import Link from "next/link"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"
import { getPublishedCourses, FREE_PREVIEW_QUESTION_LIMIT, type Lang } from "@/lib/supabase/courseCatalog"
import { getCurrentUser, getEntitledCourseIds } from "@/lib/access"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "CDL Training Courses — Interactive Practice Exams",
  description:
    "Interactive, bilingual CDL training courses with full practice exams, instant answer explanations, and progress tracking for every CDL endorsement.",
}

function formatPrice(cents: number | null): string {
  if (!cents || cents <= 0) return "Free"
  return `$${(cents / 100).toFixed(2)}`
}

export default async function TrainingCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const { lang: langParam } = await searchParams
  const lang: Lang = langParam === "es" ? "es" : "en"
  const es = lang === "es"

  const courses = await getPublishedCourses(lang)

  const user = await getCurrentUser()
  const entitledIds = user ? new Set(await getEntitledCourseIds(user.id)) : new Set<string>()

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      <section className="bg-[#061A2E] px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#4C8DE0]">
            {es ? "Cursos de Entrenamiento CDL" : "CDL Training Courses"}
          </p>
          <h1 className="mt-2 text-balance text-4xl font-extrabold md:text-5xl">
            {es
              ? "Cursos interactivos para aprobar tu examen CDL"
              : "Interactive courses to pass your CDL exam"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-white/75">
            {es
              ? `Exámenes de práctica completos con explicaciones instantáneas y seguimiento de tu progreso, en inglés y español. Prueba ${FREE_PREVIEW_QUESTION_LIMIT} preguntas gratis de cualquier curso, sin registrarte.`
              : `Full practice exams with instant answer explanations and progress tracking, in English and Spanish. Try ${FREE_PREVIEW_QUESTION_LIMIT} free questions from any course — no sign-up needed.`}
          </p>
          <Link
            href={es ? "/training-courses" : "/training-courses?lang=es"}
            className="mt-6 inline-block rounded-lg border border-white/40 px-6 py-3 font-bold transition-colors hover:bg-white hover:text-[#061A2E]"
          >
            {es ? "View in English" : "Ver en Español"}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        {courses.length === 0 ? (
          <p className="text-center text-gray-600">
            {es ? "No hay cursos disponibles todavía." : "No courses are available yet."}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const owned = entitledIds.has(course.id)
              return (
                <Link
                  key={course.id}
                  href={`/training-courses/${course.slug}${es ? "?lang=es" : ""}`}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#EAF2FC] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1E4D8C]">
                      {course.category || (es ? "Curso" : "Course")}
                    </span>
                    {owned ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        {es ? "Adquirido" : "Owned"}
                      </span>
                    ) : (
                      <span className="text-sm font-extrabold text-[#0D2B45]">
                        {course.isFree ? (es ? "Gratis" : "Free") : formatPrice(course.priceCents)}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-4 text-lg font-bold text-[#0D2B45]">{course.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                    {course.shortDescription}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-gray-500">
                    <span>
                      {course.lessonCount} {es ? "exámenes" : "practice exams"}
                    </span>
                    {course.estimatedMinutes ? <span>{course.estimatedMinutes} min</span> : null}
                  </div>

                  {!owned && !course.isFree ? (
                    <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                      {es
                        ? `${FREE_PREVIEW_QUESTION_LIMIT} preguntas gratis para probar`
                        : `${FREE_PREVIEW_QUESTION_LIMIT} free questions to try`}
                    </span>
                  ) : null}

                  <span className="mt-4 text-sm font-bold text-[#1E4D8C]">
                    {owned
                      ? es
                        ? "Continuar →"
                        : "Continue →"
                      : es
                        ? "Probar gratis →"
                        : "Try free →"}
                  </span>
                </Link>
              )
            })}
          </div>
        )}

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#1E4D8C]/20 bg-white p-6 shadow-sm sm:flex-row">
          <div>
            <h2 className="text-lg font-bold text-[#0D2B45]">
              {es ? "¿Prefieres estudiar sin conexión?" : "Prefer to study offline?"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {es
                ? "El mismo material de estudio CDL también está disponible como ebook en PDF descargable, sin necesidad de cuenta."
                : "The same CDL study guide is also available as a downloadable PDF ebook — no account needed."}
            </p>
          </div>
          <Link
            href="/ebooks"
            className="shrink-0 rounded-lg border border-[#1E4D8C] px-5 py-2.5 font-bold text-[#1E4D8C] transition-colors hover:bg-[#1E4D8C] hover:text-white"
          >
            {es ? "Ver ebooks de estudio" : "Browse Study Guide Ebooks"}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
