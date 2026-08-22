import Link from "next/link"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"
import { getAllCourses } from "@/lib/seoCourseData"
import { STUDY_GUIDE_PRICE_USD } from "@/lib/pricing"

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

      {/* Guías de estudio pagadas: dos formatos */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1E4D8C]">
              Dos Formas de Estudiar
            </p>
            <h2 className="mt-2 text-balance text-3xl font-bold text-[#0D2B45]">
              ¿Listo para la guía de estudio completa?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-gray-600">
              Cada guía de estudio CDL cubre las mismas preguntas estilo examen con explicaciones
              claras. Elige el formato que se adapte a tu forma de estudiar &mdash; solo ${STUDY_GUIDE_PRICE_USD}, pago único.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-[#F6F9FC] p-8 shadow-sm">
              <span className="w-fit rounded-full bg-[#1477DA] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Ebook Descargable
              </span>
              <h3 className="mt-4 text-xl font-bold text-[#0D2B45]">Guía de Estudio en PDF</h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Pago único con entrega instantánea por correo. Estudia sin conexión en cualquier
                dispositivo, sin necesidad de cuenta.
              </p>
              <Link
                href="/ebooks"
                className="mt-6 inline-flex w-fit items-center font-bold text-[#1E4D8C] hover:underline"
              >
                Ver ebooks &rarr;
              </Link>
            </div>
            <div className="flex flex-col rounded-2xl border-2 border-[#1E4D8C] bg-white p-8 shadow-lg">
              <span className="w-fit rounded-full bg-[#1E4D8C] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Curso Interactivo
              </span>
              <h3 className="mt-4 text-xl font-bold text-[#0D2B45]">Guía de Estudio Interactiva</h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Exámenes de práctica guiados en línea con retroalimentación instantánea,
                explicaciones y progreso guardado en tu cuenta.
              </p>
              <Link
                href="/training-courses"
                className="mt-6 inline-flex w-fit items-center font-bold text-[#1E4D8C] hover:underline"
              >
                Explorar cursos interactivos &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
