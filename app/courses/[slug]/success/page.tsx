import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCourseBySlug } from "@/lib/supabase/queries";
import { verifyAndGrantSession } from "@/lib/verifySession";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; session_id?: string }>;
}) {
  const { slug } = await params;
  const { lang: langParam, session_id } = await searchParams;
  const lang = langParam === "es" ? "es" : "en";

  const course = await getCourseBySlug(slug);
  if (!course) {
    redirect("/courses");
  }

  // Verify the Stripe session and grant access (fallback for webhook latency).
  if (session_id) {
    await verifyAndGrantSession(session_id, slug);
  }

  const title = lang === "es" ? course.spanish_title : course.title;

  const t = lang === "es"
    ? {
        thanks: "¡Gracias por tu compra!",
        body: `Ya tienes acceso completo al curso de ${title}. Comienza a estudiar ahora.`,
        startLessons: "Comenzar Lecciones",
        practiceTest: "Examen de Práctica",
        browse: "Ver Todos los Cursos",
        receipt: "Recibirás un recibo de Stripe por correo electrónico.",
      }
    : {
        thanks: "Thank you for your purchase!",
        body: `You now have full access to the ${title} course. Start studying right away.`,
        startLessons: "Start Lessons",
        practiceTest: "Practice Test",
        browse: "Browse All Courses",
        receipt: "You will receive a Stripe receipt by email.",
      };

  const langSuffix = lang === "es" ? "?lang=es" : "";

  return (
    <main className="min-h-screen bg-[#F6F9FC]">
      <nav className="bg-[#061A2E] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="MyCDLClass" width={58} height={58} />
            <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
          </Link>
        </div>
      </nav>

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
            href={`/courses/${slug}${langSuffix}`}
            className="rounded-xl bg-[#16A34A] px-8 py-4 font-bold text-white transition-colors hover:bg-[#15803d]"
          >
            {t.startLessons}
          </Link>
          <Link
            href={`/courses/${slug}/quiz${langSuffix}`}
            className="rounded-xl bg-[#1E4D8C] px-8 py-4 font-bold text-white transition-colors hover:bg-[#163d6e]"
          >
            {t.practiceTest}
          </Link>
        </div>

        <Link href="/courses" className="mt-6 text-sm font-medium text-[#1E4D8C] hover:underline">
          {t.browse}
        </Link>

        <p className="mt-8 text-xs text-gray-400">{t.receipt}</p>
      </section>
    </main>
  );
}
