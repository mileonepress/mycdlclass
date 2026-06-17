import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import Footer from "@/components/Footer"
import { getCourses } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Free CDL Practice Tests | MyCDLClass",
  description:
    "Take free interactive CDL practice tests in English and Spanish. Real exam-style questions, instant scoring, and detailed answer explanations for all CDL endorsements.",
}

export default async function PracticeTestsPage() {
  const tests = await getCourses()

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <nav className="sticky top-0 z-50 bg-[#061A2E] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="MyCDLClass" width={58} height={58} />
            <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
          </Link>

          <div className="hidden gap-6 text-sm md:flex">
            <Link href="/practice-tests">Practice Tests</Link>
            <Link href="/ebooks">Ebooks</Link>
            <Link href="/about">About</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>

          <Link href="/ebooks" className="rounded-lg bg-[#16A34A] px-4 py-2 font-bold">
            Shop Ebooks
          </Link>
        </div>
      </nav>

      <section className="bg-[#061A2E] px-6 py-20 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#16A34A]">
          English &amp; Español
        </p>
        <h1 className="mt-2 text-balance text-4xl font-extrabold md:text-5xl">
          Free CDL Practice Tests
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-pretty text-lg text-white/85">
          Take a full interactive practice test for any CDL endorsement category. Real
          exam-style questions, instant feedback, and detailed answer explanations in
          English and Spanish &mdash; completely free.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="#tests" className="rounded-lg bg-[#16A34A] px-7 py-3 font-bold text-white">
            Choose a Practice Test
          </Link>
          <Link href="/ebooks" className="rounded-lg border border-white px-7 py-3 font-bold">
            Browse Prep Ebooks
          </Link>
        </div>
      </section>

      <section id="tests" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold">Interactive Practice Tests by Category</h2>
          <p className="mt-3 text-lg text-gray-600">
            Each test runs the same way: timed questions, instant scoring, and detailed answer
            explanations with full bilingual support.
          </p>
        </div>

        {tests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-lg font-bold">Practice tests are coming soon.</p>
            <p className="mt-2 text-gray-600">Check back shortly for interactive CDL practice tests.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => (
              <div key={test.id} className="flex flex-col rounded-2xl border bg-white p-6 shadow-lg">
                <div className="mb-4">
                  <span className="rounded-full bg-[#16A34A] px-3 py-1 text-xs font-bold text-white">
                    Free Interactive Test
                  </span>
                </div>

                <h3 className="text-xl font-bold">{test.title}</h3>
                <p className="mt-1 text-sm font-semibold text-[#16A34A]">{test.spanish_title}</p>
                {test.description && (
                  <p className="mt-3 text-sm text-gray-600">{test.description}</p>
                )}

                <div className="mt-auto pt-6">
                  <Link
                    href={`/practice-tests/${test.slug}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-5 py-3 text-center font-bold text-white transition-colors hover:bg-[#15803D]"
                  >
                    Start Practice Test
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link
                    href={`/practice-tests/${test.slug}?lang=es`}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#16A34A] px-5 py-3 text-center font-bold text-[#16A34A] transition-colors hover:bg-[#16A34A] hover:text-white"
                  >
                    Empezar en Español
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-bold">Study Offline with Prep Ebooks</h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Want to study away from your screen? Our downloadable CDL prep booklets are available in
            English and Spanish as instant PDF downloads.
          </p>
          <Link
            href="/ebooks"
            className="mt-8 inline-block rounded-lg bg-[#16A34A] px-8 py-4 text-lg font-bold text-white"
          >
            Browse Prep Ebooks
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
