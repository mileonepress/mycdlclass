import Image from "next/image"
import Link from "next/link"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"
import EbookCheckoutButton from "@/components/EbookCheckoutButton"
import CourseCard from "@/components/courses/CourseCard"
import { listEbookProducts, EBOOK_PRICE } from "@/lib/ebookProducts"
import { getCourseCatalog } from "@/lib/courses/queries"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const featured = listEbookProducts().slice(0, 3)
  const courses = await getCourseCatalog("en")
  const totalQuestions = courses.reduce((sum, c) => sum + c.questionCount, 0)

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061A2E] via-[#0B2B5E] to-[#1E4D8C] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-[#7Fb2ff]">
              Interactive CDL Prep &middot; English &amp; Español
            </p>

            <h1 className="text-balance text-5xl font-extrabold leading-tight md:text-6xl">
              Pass Your CDL Test
              <span className="block text-[#7Fb2ff]">The First Time</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg text-white/80">
              Interactive practice courses with real exam-style questions, instant explanations, and progress
              tracking. Try <span className="font-bold text-white">3 questions free</span> in any course &mdash; no
              account needed to start.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="rounded-xl bg-white px-6 py-3 font-bold text-[#0B2B5E] transition-transform hover:-translate-y-0.5"
              >
                Explore Courses
              </Link>
              <Link
                href="/ebooks"
                className="rounded-xl border border-white/40 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
              >
                Browse Ebooks
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <HeroStat value={`${courses.length}`} label="Courses" />
              <HeroStat value={totalQuestions > 0 ? `${totalQuestions.toLocaleString()}+` : "1,000+"} label="Questions" />
              <HeroStat value="EN / ES" label="Bilingual" />
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur ring-1 ring-white/15">
            <Image
              src="/logo.png"
              alt="MyCDLClass logo"
              width={620}
              height={620}
              className="mx-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured interactive courses */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1E4D8C]">Learn Interactively</p>
            <h2 className="mt-2 text-4xl font-bold text-[#0D2B45]">Interactive CDL Courses</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Practice with exam-style questions and get instant explanations. Every course includes a free
              3-question preview.
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-gray-500">Courses are being prepared. Check back shortly.</p>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1E4D8C] px-8 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
            >
              View All Courses
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
            Simple &amp; Seamless
          </p>
          <h2 className="mt-2 text-center text-4xl font-bold">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/70">
            Start practicing in under a minute &mdash; try questions free, then unlock everything with a one-time
            purchase.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step number="1" title="Try It Free" text="Take 3 free practice questions in any course — no account required." />
            <Step number="2" title="Unlock the Course" text="One-time purchase unlocks every question, exam, and explanation." />
            <Step number="3" title="Track Your Progress" text="Take scored practice exams and watch your readiness improve." />
          </div>
        </div>
      </section>

      {/* Featured ebooks */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1E4D8C]">Study Offline</p>
            <h2 className="mt-2 text-4xl font-bold text-[#0D2B45]">Prefer a Downloadable Ebook?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Get the same trusted content as a PDF for just{" "}
              <span className="font-bold text-[#0D2B45]">${EBOOK_PRICE}</span> &mdash; instant delivery, study
              anywhere.
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
                  <p className="mt-1 text-sm text-gray-500">CDL Prep Exam Booklet &middot; PDF</p>
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
              View All Ebooks
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
          <Feature title="Exam-Style Questions" text="Practice with realistic CDL test questions." />
          <Feature title="Instant Explanations" text="Understand every answer as you go." />
          <Feature title="English & Spanish" text="Study in the language you're most comfortable with." />
          <Feature title="One-Time Purchase" text="No subscriptions — unlock a course and keep it." />
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
