import Image from "next/image"
import Link from "next/link"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"
import EbookCheckoutButton from "@/components/EbookCheckoutButton"
import CourseCard from "@/components/courses/CourseCard"
import LanguageToggle from "@/components/courses/LanguageToggle"
import { listEbookProducts, EBOOK_PRICE } from "@/lib/ebookProducts"
import { getCourseCatalog } from "@/lib/courses/queries"
import { getSiteStrings, langHref } from "@/lib/courses/siteStrings"
import { normalizeLang } from "@/lib/courses/quizStrings"

export const dynamic = "force-dynamic"

export default async function HomePage({ searchParams }) {
  const lang = normalizeLang((await searchParams)?.lang)
  const t = getSiteStrings(lang)
  const featured = listEbookProducts().slice(0, 3)
  const courses = await getCourseCatalog(lang)

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061A2E] via-[#0B2B5E] to-[#1E4D8C] text-white">
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <div className="flex justify-end">
            <LanguageToggle basePath="/" current={lang} />
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-6 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-[#7Fb2ff]">
              {t.home.heroEyebrow}
            </p>

            <h1 className="text-balance text-5xl font-extrabold leading-tight md:text-6xl">
              {t.home.heroTitleTop}
              <span className="block text-[#7Fb2ff]">{t.home.heroTitleBottom}</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg text-white/80">
              {t.home.heroLeadPre}
              <span className="font-bold text-white">{t.home.heroLeadBold}</span>
              {t.home.heroLeadPost}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={langHref("/courses", lang)}
                className="rounded-xl bg-white px-6 py-3 font-bold text-[#0B2B5E] transition-transform hover:-translate-y-0.5"
              >
                {t.home.ctaCourses}
              </Link>
              <Link
                href="/ebooks"
                className="rounded-xl border border-white/40 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
              >
                {t.common.browseEbooks}
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <HeroStat value={`${courses.length}`} label={t.home.statCourses} />
              <HeroStat value="800+" label={t.home.statQuestions} />
              <HeroStat value="EN / ES" label={t.common.bilingual} />
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur ring-1 ring-white/15">
            <Image src="/logo.png" alt="MyCDLClass logo" width={620} height={620} className="mx-auto" priority />
          </div>
        </div>
      </section>

      {/* Featured interactive courses */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1E4D8C]">{t.home.coursesEyebrow}</p>
            <h2 className="mt-2 text-4xl font-bold text-[#0D2B45]">{t.home.coursesTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">{t.home.coursesLead}</p>
          </div>

          {courses.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} lang={lang} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-gray-500">{t.home.coursesEmpty}</p>
          )}

          <div className="mt-12 text-center">
            <Link
              href={langHref("/courses", lang)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1E4D8C] px-8 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
            >
              {t.home.viewAllCourses}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#061A2E] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-[#7Fb2ff]">
            {t.home.howEyebrow}
          </p>
          <h2 className="mt-2 text-center text-4xl font-bold">{t.home.howTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/70">{t.home.howLead}</p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step number="1" title={t.home.step1Title} text={t.home.step1Text} />
            <Step number="2" title={t.home.step2Title} text={t.home.step2Text} />
            <Step number="3" title={t.home.step3Title} text={t.home.step3Text} />
          </div>
        </div>
      </section>

      {/* Featured ebooks */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1E4D8C]">{t.home.ebooksEyebrow}</p>
            <h2 className="mt-2 text-4xl font-bold text-[#0D2B45]">{t.home.ebooksTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              {t.home.ebooksLeadPre}
              <span className="font-bold text-[#0D2B45]">${EBOOK_PRICE}</span>
              {t.home.ebooksLeadPost}
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((ebook) => (
              <div
                key={ebook.slug}
                className="flex flex-col overflow-hidden rounded-2xl bg-[#F6F9FC] shadow-lg transition-shadow hover:shadow-xl"
              >
                <div className="relative aspect-[3/4] w-full bg-[#0D2B45]">
                  <Image
                    src={ebook.cover || "/placeholder.svg"}
                    alt={`${ebook.title} (${ebook.languageLabel}) CDL prep ebook cover`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain"
                  />
                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white ${
                      ebook.language === "es" ? "bg-[#1E4D8C]" : "bg-[#1477DA]"
                    }`}
                  >
                    {ebook.languageLabel}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-[#0D2B45]">{ebook.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{t.home.ebookSubtitle}</p>
                  <p className="mt-3 text-2xl font-extrabold text-[#0D2B45]">${ebook.price}</p>
                  <div className="mt-4 flex-1" />
                  <EbookCheckoutButton slug={ebook.slug} price={ebook.price} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/ebooks"
              className="inline-flex items-center gap-2 rounded-lg border border-[#1E4D8C] px-8 py-3 font-bold text-[#1E4D8C] transition-colors hover:bg-[#EFF6FF]"
            >
              {t.home.viewAllEbooks}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-[#F6F9FC] px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
          <Feature title={t.home.feat1Title} text={t.home.feat1Text} />
          <Feature title={t.home.feat2Title} text={t.home.feat2Text} />
          <Feature title={t.home.feat3Title} text={t.home.feat3Text} />
          <Feature title={t.home.feat4Title} text={t.home.feat4Text} />
        </div>
      </section>

      <Footer />
    </main>
  )
}

function HeroStat({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <div className="text-2xl font-extrabold tracking-tight">{value}</div>
      <div className="text-xs font-bold text-white/70">{label}</div>
    </div>
  )
}

function Step({ number, title, text }) {
  return (
    <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E4D8C] text-xl font-extrabold text-white">
        {number}
      </div>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-white/70">{text}</p>
    </div>
  )
}

function Feature({ title, text }) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-xl font-bold text-[#0D2B45]">{title}</h3>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  )
}
