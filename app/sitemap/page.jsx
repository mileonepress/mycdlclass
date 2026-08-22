import Link from "next/link"
import { getAllCourses } from "@/lib/seoCourseData"

const sitemap = [
  {
    title: "Free Practice Tests (SEO)",
    pages: [
      { name: "CDL Practice Tests", url: "/courses", goal: "English catalog, top-of-funnel entry" },
      { name: "Exámenes en Español", url: "/es/cursos", goal: "Spanish catalog for bilingual reach" },
    ],
  },
  {
    title: "Main Pages",
    pages: [
      { name: "Homepage", url: "/", goal: "Introduce brand and main CTA" },
      { name: "Interactive Courses", url: "/training-courses", goal: "Sell online interactive study guides" },
      { name: "Study Guide Ebooks", url: "/ebooks", goal: "Sell downloadable PDF study guides" },
      { name: "About", url: "/about", goal: "Build trust and explain mission" },
      { name: "Contact", url: "/contact", goal: "Order, download, and account support" },
    ],
  },
  {
    title: "Customer Account",
    pages: [
      { name: "Log In", url: "/login", goal: "Customer & admin sign-in" },
      { name: "My Courses", url: "/account", goal: "Access purchased interactive courses" },
      { name: "Order Success", url: "/ebooks/success", goal: "Instant PDF delivery by email" },
    ],
  },
  {
    title: "Owner",
    pages: [
      { name: "Admin Dashboard", url: "/admin", goal: "Overview of sales & access" },
      { name: "Purchases", url: "/admin/purchases", goal: "Manage orders & entitlements" },
    ],
  },
]

const journey = [
  "Free Practice Test",
  "Choose a Format",
  "Secure Checkout",
  "Instant Access",
  "Study & Pass",
]

export default function VisualSitemapPage() {
  const courses = getAllCourses("en")

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <section className="bg-[#061A2E] px-6 py-16 text-center text-white">
        <h1 className="text-balance text-4xl font-extrabold sm:text-5xl">MyCDLClass Visual Sitemap</h1>
        <p className="mx-auto mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-white/85">
          Navigation blueprint for our bilingual CDL test prep &mdash; interactive online courses and
          downloadable study guide ebooks in English and Spanish.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/ebooks"
            className="rounded-lg bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
          >
            Browse Ebooks
          </Link>
          <Link
            href="/about"
            className="rounded-lg border border-white px-6 py-3 font-bold text-white transition-colors hover:bg-white hover:text-[#061A2E]"
          >
            About Us
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {sitemap.map((group) => (
            <div key={group.title} className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="border-b border-gray-200 pb-3 text-2xl font-bold">{group.title}</h2>

              <div className="mt-6 flex flex-col gap-4">
                {group.pages.map((page) => (
                  <Link
                    key={`${group.title}-${page.name}`}
                    href={page.url}
                    className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-[#1E4D8C] hover:bg-[#EFF6FF]"
                  >
                    <p className="font-bold">{page.name}</p>
                    <p className="mt-1 text-sm text-gray-600">{page.url}</p>
                    <p className="mt-2 text-sm font-medium text-[#1E4D8C]">{page.goal}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">CDL Practice Test Landing Pages</h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-center leading-relaxed text-gray-600">
            Each topic has an indexable English and Spanish page with free practice questions that
            funnel into the matching prep ebook.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div key={course.slug} className="rounded-xl border border-gray-200 p-5">
                <p className="font-bold text-[#0D2B45]">{course.shortTitle}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold">
                  <Link href={`/courses/${course.slug}`} className="text-[#1E4D8C] hover:underline">
                    English →
                  </Link>
                  <Link
                    href={`/es/cursos/${course.slug}`}
                    hrefLang="es"
                    className="text-[#1E4D8C] hover:underline"
                  >
                    Español →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F6F9FC] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Recommended User Journey</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            {journey.map((step, index) => (
              <div key={step} className="rounded-xl border border-gray-200 p-5 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1E4D8C] font-bold text-white">
                  {index + 1}
                </div>
                <p className="font-bold">{step}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-pretty text-center leading-relaxed text-gray-600">
            Primary path: visitors try a free practice test, choose an interactive course or a
            downloadable ebook, complete a secure one-time checkout, and get instant access to study
            and pass their CDL exam.
          </p>
        </div>
      </section>

      <section className="bg-[#061A2E] px-6 py-16 text-center text-white">
        <h2 className="text-3xl font-bold sm:text-4xl">Conversion Goal</h2>
        <p className="mx-auto mt-4 max-w-3xl text-pretty leading-relaxed text-white/85">
          Every main page should include a clear CTA to start an interactive course or download a
          study guide ebook.
        </p>
      </section>
    </main>
  )
}
