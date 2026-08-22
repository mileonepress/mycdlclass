import Link from "next/link"
import { redirect } from "next/navigation"
import SiteHeader from "@/components/SiteHeader"
import { getStripe } from "@/lib/stripe"
import { getCourseDetail, type Lang } from "@/lib/supabase/courseCatalog"
import { verifyAndGrantSession } from "@/lib/courseEntitlements"

export const dynamic = "force-dynamic"

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string; session_id?: string }>
}) {
  const { slug } = await params
  const { lang: langParam, session_id } = await searchParams
  const lang: Lang = langParam === "es" ? "es" : "en"
  const es = lang === "es"

  const course = await getCourseDetail(slug, lang)
  if (!course) redirect("/training-courses")

  // Verify the Stripe session and grant access (fallback for webhook latency).
  if (session_id) {
    await verifyAndGrantSession(session_id, getStripe)
  }

  const langSuffix = es ? "?lang=es" : ""
  const firstLessonKey = course.sections[0]?.lessons[0]?.lessonKey

  const t = es
    ? {
        thanks: "¡Gracias por tu compra!",
        body: `Ya tienes acceso completo al curso ${course.title}. Comienza a estudiar ahora.`,
        start: "Comenzar el curso",
        firstExam: "Ir al primer examen",
        browse: "Ver todos los cursos",
        receipt: "Recibirás un recibo de Stripe por correo electrónico.",
      }
    : {
        thanks: "Thank you for your purchase!",
        body: `You now have full access to the ${course.title} course. Start studying right away.`,
        start: "Go to the course",
        firstExam: "Start the first exam",
        browse: "Browse all courses",
        receipt: "You will receive a Stripe receipt by email.",
      }

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-8 rounded-full bg-[#16A34A] p-6">
          <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-extrabold text-[#0D2B45]">{t.thanks}</h1>
        <p className="mt-4 max-w-xl text-lg text-gray-600">{t.body}</p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href={`/training-courses/${slug}${langSuffix}`}
            className="rounded-xl bg-[#1E4D8C] px-8 py-4 font-bold text-white transition-colors hover:bg-[#163d6e]"
          >
            {t.start}
          </Link>
          {firstLessonKey ? (
            <Link
              href={`/training-courses/${slug}/quiz/${firstLessonKey}${langSuffix}`}
              className="rounded-xl bg-[#16A34A] px-8 py-4 font-bold text-white transition-colors hover:bg-[#15803d]"
            >
              {t.firstExam}
            </Link>
          ) : null}
        </div>

        <Link href="/training-courses" className="mt-6 text-sm font-medium text-[#1E4D8C] hover:underline">
          {t.browse}
        </Link>

        <p className="mt-8 text-xs text-gray-400">{t.receipt}</p>
      </section>
    </main>
  )
}
