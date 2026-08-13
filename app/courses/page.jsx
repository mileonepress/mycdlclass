import Link from "next/link"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"
import { getAllCourses } from "@/lib/seoCourseData"

const SITE_URL = "https://www.mycdlclass.com"

export const metadata = {
  title: "Free CDL Practice Tests (English & Spanish)",
  description:
    "Free bilingual CDL practice tests with instant answer explanations for General Knowledge, Air Brakes, Combination Vehicles, HazMat, Tanker, Passenger, School Bus, and Pre-Trip Inspection.",
  alternates: {
    canonical: `${SITE_URL}/courses`,
    languages: {
      "en-US": `${SITE_URL}/courses`,
      "es-US": `${SITE_URL}/es/cursos`,
      "x-default": `${SITE_URL}/courses`,
    },
  },
}

export default function CoursesCatalogPage() {
  const courses = getAllCourses("en")

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "CDL Practice Tests",
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: course.title,
      url: `${SITE_URL}/courses/${course.slug}`,
    })),
  }

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <SiteHeader />

      <section className="bg-[#061A2E] px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#4C8DE0]">Free CDL Practice Tests</p>
          <h1 className="mt-2 text-balance text-4xl font-extrabold md:text-5xl">
            Free CDL Practice Tests in English &amp; Spanish
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-white/75">
            Start with three free exam-style questions and instant explanations for each CDL topic, then download the
            full prep ebook when you&apos;re ready.
          </p>
          <Link
            href="/es/cursos"
            hrefLang="es"
            className="mt-6 inline-block rounded-lg border border-white/40 px-6 py-3 font-bold transition-colors hover:bg-white hover:text-[#061A2E]"
          >
            Ver en Español
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <h2 className="text-lg font-bold text-[#0D2B45]">{course.shortTitle}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{course.metaDescription}</p>
              <span className="mt-4 text-sm font-bold text-[#1E4D8C]">Start free practice →</span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
