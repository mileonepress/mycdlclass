import Link from "next/link"
import { notFound } from "next/navigation"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"
import EbookCheckoutButton from "@/components/EbookCheckoutButton"
import FreePracticeQuiz from "@/components/seo/FreePracticeQuiz"
import { getAllCourses, getCatalogUrl, getCourse, getCourseUrl, SITE_URL } from "@/lib/seoCourseData"
import { EBOOK_PRICE } from "@/lib/ebookProducts"

function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export default function SeoCoursePage({ slug, lang }) {
  const course = getCourse(slug, lang)
  if (!course) notFound()

  const questions = course.questions
  const currentUrl = getCourseUrl(slug, lang)
  const alternateLang = lang === "es" ? "en" : "es"
  const alternateUrl = getCourseUrl(slug, alternateLang)
  const catalogPath = new URL(getCatalogUrl(lang)).pathname
  const alternatePath = new URL(alternateUrl).pathname
  // Each landing page funnels into the matching bilingual ebook product.
  const ebookSlug = `${slug}-${lang}`
  const related = getAllCourses(lang)
    .filter((item) => item.slug !== slug)
    .slice(0, 3)

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${course.title} — CDL Prep Ebook (PDF)`,
    description: course.metaDescription,
    url: currentUrl,
    inLanguage: lang,
    category: "CDL test preparation ebook",
    brand: { "@type": "Brand", name: "MyCDLClass" },
    offers: {
      "@type": "Offer",
      price: Number(EBOOK_PRICE).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: currentUrl,
    },
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: course.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: lang === "es" ? "Inicio" : "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: lang === "es" ? "Exámenes CDL" : "CDL Practice Tests",
        item: getCatalogUrl(lang),
      },
      { "@type": "ListItem", position: 3, name: course.shortTitle, item: currentUrl },
    ],
  }

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]" lang={lang}>
      <JsonLd data={productJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <SiteHeader />

      {/* Hero */}
      <section className="bg-[#061A2E] px-6 py-14 text-white">
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/60">
            <Link href="/" className="hover:text-white">
              {lang === "es" ? "Inicio" : "Home"}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={catalogPath} className="hover:text-white">
              {lang === "es" ? "Exámenes CDL" : "CDL Practice Tests"}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">{course.shortTitle}</span>
          </nav>

          <p className="text-sm font-semibold uppercase tracking-wider text-[#4C8DE0]">{course.freeLabel}</p>
          <h1 className="mt-2 text-balance text-4xl font-extrabold leading-tight md:text-5xl">{course.heading}</h1>
          <p className="mt-4 max-w-2xl text-pretty text-white/75">{course.metaDescription}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#free-practice-test"
              className="rounded-lg bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
            >
              {course.startLabel}
            </a>
            <Link
              href={alternatePath}
              hrefLang={alternateLang}
              className="rounded-lg border border-white/40 px-6 py-3 font-bold text-white transition-colors hover:bg-white hover:text-[#061A2E]"
            >
              {lang === "es" ? "Read in English" : "Leer en Español"}
            </Link>
          </div>
        </div>
      </section>

      {/* About + what you'll practice */}
      <section className="mx-auto max-w-4xl px-6 py-14" aria-labelledby="about-course">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 id="about-course" className="text-2xl font-bold md:text-3xl">
              {lang === "es" ? `Prepárate para ${course.shortTitle}` : `Prepare for ${course.shortTitle}`}
            </h2>
            <div className="mt-4 flex flex-col gap-4 leading-relaxed text-gray-700">
              {course.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">
                {lang === "es" ? "Lo que practicarás" : "What you will practice"}
              </h2>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-gray-700">
                {course.learn.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-0.5 font-bold text-[#1E4D8C]">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Free practice test */}
      <section id="free-practice-test" className="bg-white px-6 py-14" aria-labelledby="practice-heading">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#1E4D8C]">{course.freeLabel}</p>
          <h2 id="practice-heading" className="mt-2 text-2xl font-bold md:text-3xl">
            {lang === "es"
              ? "Responde y recibe la explicación al instante"
              : "Answer each question for an instant explanation"}
          </h2>
          <div className="mt-8">
            <FreePracticeQuiz questions={questions} lang={lang} scoreLabel={course.scoreLabel} />
          </div>
        </div>
      </section>

      {/* Sales / checkout */}
      <section className="px-6 py-14" aria-labelledby="full-course-heading">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[#061A2E] p-8 text-white md:p-10">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4C8DE0]">
                {course.oneTimeLabel} · ${EBOOK_PRICE}
              </p>
              <h2 id="full-course-heading" className="mt-2 text-2xl font-bold md:text-3xl">
                {lang === "es"
                  ? `Obtén el ebook completo de ${course.shortTitle}`
                  : `Get the full ${course.shortTitle} prep ebook`}
              </h2>
              <p className="mt-4 leading-relaxed text-white/75">
                {lang === "es"
                  ? "Descarga el PDF completo con más preguntas estilo examen y explicaciones claras. Pago único, entrega instantánea por correo y sin necesidad de crear una cuenta."
                  : "Download the complete PDF with more exam-style questions and clear explanations. One-time payment, instant email delivery, and no account required."}
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <EbookCheckoutButton slug={ebookSlug} price={EBOOK_PRICE} />
              <Link href="/ebooks" className="text-center text-sm font-semibold text-[#4C8DE0] hover:text-white">
                {course.ebookLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-6 py-14" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-4xl">
          <h2 id="faq-heading" className="text-2xl font-bold md:text-3xl">
            {lang === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}
          </h2>
          <div className="mt-6 flex flex-col gap-3">
            {course.faq.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-gray-200 bg-[#F6F9FC] p-5">
                <summary className="cursor-pointer list-none font-bold text-[#0D2B45] marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span aria-hidden="true" className="text-[#1E4D8C] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-gray-700">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto max-w-4xl px-6 py-14" aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-2xl font-bold md:text-3xl">
          {lang === "es" ? "Más práctica CDL" : "More CDL practice"}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={new URL(getCourseUrl(item.slug, lang)).pathname}
              className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-[#1E4D8C]"
            >
              <strong className="text-[#0D2B45]">{item.shortTitle}</strong>
              <span className="text-sm font-semibold text-[#1E4D8C]">
                {lang === "es" ? "Práctica gratis →" : "Free practice →"}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link href={catalogPath} className="font-semibold text-[#1E4D8C] hover:underline">
            {course.catalogLabel}
          </Link>
        </div>
      </section>

      <p className="mx-auto max-w-4xl px-6 pb-14 text-sm leading-relaxed text-gray-500">{course.disclaimer}</p>

      <Footer />
    </main>
  )
}
