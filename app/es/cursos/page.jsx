import Link from "next/link"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"
import { getAllCourses } from "@/lib/seoCourseData"

const SITE_URL = "https://www.mycdlclass.com"

export const metadata = {
  title: "Exámenes de Práctica CDL Gratis (Español e Inglés)",
  description:
    "Exámenes de práctica CDL gratis en español con explicaciones al instante: Conocimientos Generales, Frenos de Aire, Vehículos Combinados, Materiales Peligrosos, Cisterna, Pasajeros, Autobús Escolar e Inspección Previa al Viaje.",
  alternates: {
    canonical: `${SITE_URL}/es/cursos`,
    languages: {
      "es-US": `${SITE_URL}/es/cursos`,
      "en-US": `${SITE_URL}/courses`,
      "x-default": `${SITE_URL}/courses`,
    },
  },
}

export default function CursosCatalogPage() {
  const courses = getAllCourses("es")

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Exámenes de práctica CDL",
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: course.title,
      url: `${SITE_URL}/es/cursos/${course.slug}`,
    })),
  }

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]" lang="es">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <SiteHeader />

      <section className="bg-[#061A2E] px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#4C8DE0]">Exámenes CDL Gratis</p>
          <h1 className="mt-2 text-balance text-4xl font-extrabold md:text-5xl">
            Exámenes de Práctica CDL Gratis en Español
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-white/75">
            Empieza con tres preguntas gratis estilo examen y explicaciones al instante para cada tema CDL, y descarga
            el ebook completo cuando estés listo.
          </p>
          <Link
            href="/courses"
            hrefLang="en"
            className="mt-6 inline-block rounded-lg border border-white/40 px-6 py-3 font-bold transition-colors hover:bg-white hover:text-[#061A2E]"
          >
            View in English
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/es/cursos/${course.slug}`}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <h2 className="text-lg font-bold text-[#0D2B45]">{course.shortTitle}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{course.metaDescription}</p>
              <span className="mt-4 text-sm font-bold text-[#1E4D8C]">Comenzar práctica gratis →</span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
