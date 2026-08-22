import Image from "next/image"
import Link from "next/link"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"
import EbookCheckoutButton from "@/components/EbookCheckoutButton"
import { listEbookProducts, EBOOK_PRICE } from "@/lib/ebookProducts"
import { getPublishedCourses } from "@/lib/supabase/courseCatalog"

export default async function HomePage() {
  const featured = listEbookProducts().slice(0, 6)

  // Live interactive-course catalog (for the lowest price shown in the format comparison).
  let courseFromPrice = null
  try {
    const courses = await getPublishedCourses("en")
    const paidPrices = courses
      .filter((c) => !c.isFree && typeof c.priceCents === "number" && c.priceCents > 0)
      .map((c) => c.priceCents)
    if (paidPrices.length) courseFromPrice = (Math.min(...paidPrices) / 100).toFixed(2)
  } catch {
    courseFromPrice = null
  }

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
        <div>
          <p className="mb-3 font-bold text-[#1E4D8C]">Bilingual CDL Study Guides &mdash; English &amp; Español</p>

          <h1 className="text-balance text-5xl font-extrabold leading-tight md:text-6xl">
            Pass Your CDL Test
            <span className="block text-[#1E4D8C]">The First Time</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg">
            The same trusted CDL prep, your way: grab a downloadable{" "}
            <span className="font-bold">ebook</span> to study offline, or take the{" "}
            <span className="font-bold">interactive course</span> online with instant feedback and
            progress tracking. Choose the format that fits how you learn.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/ebooks"
              className="rounded-lg bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
            >
              Browse Ebooks
            </Link>
            <Link
              href="/training-courses"
              className="rounded-lg border border-[#1E4D8C] px-6 py-3 font-bold text-[#1E4D8C] transition-colors hover:bg-[#1E4D8C] hover:text-white"
            >
              Explore Interactive Courses
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Bilingual", "Two Formats", "Mobile Ready", "Real Exam Prep"].map((item) => (
              <div key={item} className="rounded-xl bg-white p-4 shadow">
                <svg
                  className="h-5 w-5 text-[#1E4D8C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <p className="mt-1 font-bold">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-2xl">
          <Image
            src="/logo.png"
            alt="MyCDLClass logo"
            width={620}
            height={620}
            className="mx-auto"
            priority
          />
        </div>
      </section>

      {/* Two ways to study */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1E4D8C]">
              Two Ways to Study
            </p>
            <h2 className="mt-2 text-balance text-4xl font-bold text-[#0D2B45]">
              Pick the Study Guide Format That Fits You
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-gray-600">
              Every MyCDLClass study guide covers the same real exam-style questions and clear
              explanations. The only difference is how you want to study.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* Ebook */}
            <div className="flex flex-col rounded-3xl border border-gray-200 bg-[#F6F9FC] p-8 shadow-sm">
              <span className="w-fit rounded-full bg-[#1477DA] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Downloadable Ebook
              </span>
              <h3 className="mt-4 text-2xl font-bold text-[#0D2B45]">CDL Study Guide (PDF)</h3>
              <p className="mt-2 text-pretty text-gray-600">
                Buy once and get an instant PDF in your inbox. Study offline on any device &mdash; no
                account or subscription required.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "One-time payment, instant email delivery",
                  "Study offline, anywhere, on any device",
                  "No account or login needed",
                  "English or Spanish edition",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 font-bold text-[#1477DA]">✓</span>
                    <span className="text-[#0D2B45]">{point}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-3xl font-extrabold text-[#0D2B45]">
                ${EBOOK_PRICE}
                <span className="ml-1 text-base font-medium text-gray-500">per ebook</span>
              </p>
              <div className="mt-auto pt-6">
                <Link
                  href="/ebooks"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
                >
                  Browse Study Guide Ebooks
                </Link>
              </div>
            </div>

            {/* Interactive course */}
            <div className="flex flex-col rounded-3xl border-2 border-[#1E4D8C] bg-white p-8 shadow-lg">
              <span className="w-fit rounded-full bg-[#1E4D8C] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Interactive Course
              </span>
              <h3 className="mt-4 text-2xl font-bold text-[#0D2B45]">Online Interactive Study Guide</h3>
              <p className="mt-2 text-pretty text-gray-600">
                Work through guided practice exams online with instant right/wrong feedback,
                explanations, and saved progress so you always know what to review next.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Interactive practice exams with instant feedback",
                  "Progress tracking and quiz scores saved to your account",
                  "Free preview lessons before you buy",
                  "English or Spanish, study on any device",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 font-bold text-[#1E4D8C]">✓</span>
                    <span className="text-[#0D2B45]">{point}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-3xl font-extrabold text-[#0D2B45]">
                {courseFromPrice ? (
                  <>
                    ${courseFromPrice}
                    <span className="ml-1 text-base font-medium text-gray-500">per course</span>
                  </>
                ) : (
                  <span className="text-2xl">Free previews available</span>
                )}
              </p>
              <div className="mt-auto pt-6">
                <Link
                  href="/training-courses"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
                >
                  Explore Interactive Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#061A2E] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-[#1E4D8C]">
            Simple &amp; Seamless
          </p>
          <h2 className="mt-2 text-center text-4xl font-bold">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/70">
            Getting started takes less than a minute &mdash; whichever study guide format you choose.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step
              number="1"
              title="Pick Your Format"
              text="Choose a downloadable ebook or an interactive course, in English or Spanish."
            />
            <Step
              number="2"
              title="Checkout Securely"
              text="Pay once with a secure card checkout. Ebooks need no account; courses unlock on login."
            />
            <Step
              number="3"
              title="Start Studying"
              text="Ebooks arrive by email instantly; interactive courses open right in your browser."
            />
          </div>
        </div>
      </section>

      {/* Free practice tests */}
      <section className="bg-[#F6F9FC] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-8 shadow-lg md:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#1E4D8C]">
                  Try Before You Buy
                </p>
                <h2 className="mt-2 text-balance text-3xl font-bold text-[#0D2B45] md:text-4xl">
                  Free CDL Practice Tests
                </h2>
                <p className="mt-4 max-w-xl text-pretty text-gray-600">
                  Take real exam-style practice questions with instant answer explanations for
                  General Knowledge, Air Brakes, HazMat, Combination Vehicles, and more &mdash;
                  available in English and Spanish. No account needed.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href="/courses"
                    className="rounded-lg bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
                  >
                    Start Free Practice
                  </Link>
                  <Link
                    href="/es/cursos"
                    hrefLang="es"
                    className="rounded-lg border border-[#0D2B45] px-6 py-3 font-bold transition-colors hover:bg-[#0D2B45] hover:text-white"
                  >
                    Practicar en Español
                  </Link>
                </div>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  "General Knowledge",
                  "Air Brakes",
                  "Combination Vehicles",
                  "HazMat",
                  "Tanker",
                  "Pre-Trip Inspection",
                ].map((topic) => (
                  <li
                    key={topic}
                    className="rounded-xl border border-gray-200 bg-[#F6F9FC] px-4 py-3 font-bold text-[#0D2B45]"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured ebooks */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1E4D8C]">
              Study Offline
            </p>
            <h2 className="mt-2 text-4xl font-bold text-[#0D2B45]">Popular CDL Prep Ebooks</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Each ebook is just{" "}
              <span className="font-bold text-[#0D2B45]">${EBOOK_PRICE}</span> &mdash; a one-time
              payment with instant PDF delivery.
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
              className="inline-flex items-center gap-2 rounded-lg bg-[#1E4D8C] px-8 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
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
          <Feature title="Bilingual Editions" text="Every study guide in English and Spanish." />
          <Feature title="Two Study Formats" text="Downloadable ebook or interactive online course." />
          <Feature title="Real Exam Prep" text="Exam-style questions with clear answer explanations." />
          <Feature title="Study Anywhere" text="Learn on your phone, tablet, or computer." />
        </div>
      </section>

      <Footer />
    </main>
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
