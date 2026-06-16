import Image from "next/image"
import Link from "next/link"
import Footer from "@/components/Footer"

const courses = [
  { title: "General Knowledge", spanish: "Conocimientos Generales", slug: "general-knowledge", free: true },
  { title: "Air Brakes", spanish: "Frenos de Aire", slug: "air-brakes", free: false },
  { title: "Combination Vehicles", spanish: "Vehículos Combinados", slug: "combination-vehicles", free: false },
  { title: "Doubles/Triples", spanish: "Remolques Dobles/Triples", slug: "doubles-triples", free: false },
  { title: "Tanker Vehicles", spanish: "Vehículos Cisterna", slug: "tanker", free: false },
  { title: "HazMat", spanish: "Materiales Peligrosos", slug: "hazmat", free: false },
  { title: "Passenger", spanish: "Vehículos de Pasajeros", slug: "passenger", free: false },
  { title: "School Bus", spanish: "Autobús Escolar", slug: "school-bus", free: false },
  { title: "Pre-Trip Inspection", spanish: "Inspección Previa al Viaje", slug: "pre-trip-inspection", free: true },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <nav className="sticky top-0 z-50 bg-[#061A2E] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="MyCDLClass" width={58} height={58} />
            <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
          </Link>

          <div className="hidden gap-6 text-sm md:flex">
            <Link href="/courses">Courses</Link>
            <Link href="/free-practice-test">Free Test</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>

          <Link href="/courses" className="rounded-lg bg-[#16A34A] px-4 py-2 font-bold">
            Browse Courses
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
        <div>
          <p className="mb-3 font-bold text-[#16A34A]">
            English & Español CDL Practice Tests
          </p>

          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            Pass Your CDL Test
            <span className="block text-[#16A34A]">The First Time</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg">
            Study CDL lessons, free practice tests, premium exams, explanations,
            and progress tracking from your phone, tablet, or computer.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/free-practice-test"
              className="rounded-lg bg-[#16A34A] px-6 py-3 font-bold text-white"
            >
              Start Free Practice Test
            </Link>

            <a
              href="#courses"
              className="rounded-lg border border-[#0D2B45] px-6 py-3 font-bold"
            >
              Browse Courses
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Bilingual", "Free Tests", "Mobile Ready", "Certificates"].map((item) => (
              <div key={item} className="rounded-xl bg-white p-4 shadow">
                <p className="font-bold text-[#16A34A]">✓</p>
                <p className="font-bold">{item}</p>
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

      <section id="courses" className="bg-[#061A2E] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-[#16A34A]">
            Bilingual Learning
          </p>
          <h2 className="mt-2 text-center text-4xl font-bold">CDL Course Library</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/70">
            Master all 9 CDL endorsement categories with our comprehensive bilingual study materials. 
            Switch between English and Spanish anytime.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="group relative overflow-hidden rounded-xl bg-white p-6 text-[#0D2B45] transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0D2B45] group-hover:text-[#1E4D8C]">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-[#16A34A]">
                      {course.spanish}
                    </p>
                  </div>
                  {course.free ? (
                    <span className="rounded-full bg-[#16A34A] px-3 py-1 text-xs font-bold text-white">
                      Free
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#1E4D8C] px-3 py-1 text-xs font-bold text-white">
                      Premium
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Lessons & Practice Tests</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-[#1E4D8C] opacity-0 transition-opacity group-hover:opacity-100">
                  <span>Start Learning</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-3 font-bold text-white transition-colors hover:bg-white hover:text-[#061A2E]"
            >
              View All Courses
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section id="practice" className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="text-4xl font-bold">Try an Interactive Practice Test</h2>
          <p className="mt-3 text-lg">
            Every course has a full interactive practice test &mdash; just like General Knowledge.
            Real questions, instant feedback, answer explanations, and scoring in English &amp; Spanish.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.slug}
                className="flex flex-col rounded-xl border p-5 transition-shadow hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-[#0D2B45]">{course.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-[#16A34A]">{course.spanish}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#16A34A] px-3 py-1 text-xs font-bold text-white">
                    Interactive
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  Timed practice questions with instant feedback and explanations.
                </p>
                <Link
                  href={`/courses/${course.slug}/quiz`}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-5 py-2.5 font-bold text-white transition-colors hover:bg-[#15803D]"
                >
                  Start Practice Test
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#061A2E] px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold">Simple, Per-Course Pricing</h2>
          <p className="mt-3 text-white/80">
            Pay once per course. No subscriptions, no recurring charges. Lifetime access in English & Spanish.
          </p>

          <div className="mt-8 inline-flex flex-col items-center rounded-2xl bg-white px-10 py-8 text-[#0D2B45]">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#16A34A]">
              Per Course
            </p>
            <p className="mt-2">
              <span className="text-5xl font-extrabold">$9.99</span>
            </p>
            <p className="mt-2 text-sm text-gray-500">One-time payment · Lifetime access</p>
            <ul className="mt-6 space-y-2 text-left text-sm">
              <li>✓ Full lessons & practice tests</li>
              <li>✓ English & Spanish</li>
              <li>✓ Detailed answer explanations</li>
              <li>✓ Lifetime access</li>
            </ul>
            <Link
              href="/courses"
              className="mt-8 block rounded-lg bg-[#16A34A] px-8 py-3 text-center font-bold text-white"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
          <Feature title="Free Practice Tests" text="Start learning before subscribing." />
          <Feature title="Bilingual Support" text="English and Spanish course modes." />
          <Feature title="App Ready" text="Designed for Android and Apple launch." />
          <Feature title="Pass Focused" text="Built around CDL exam preparation." />
        </div>
      </section>

      <Footer />
    </main>
  )
}

function Feature({ title, text }) {
  return (
    <div className="rounded-xl border p-6">
      <h3 className="text-xl font-bold text-[#0D2B45]">{title}</h3>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  )
}
