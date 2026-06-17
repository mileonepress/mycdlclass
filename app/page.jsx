import Image from "next/image"
import Link from "next/link"
import Footer from "@/components/Footer"

const categories = [
  { title: "General Knowledge", spanish: "Conocimientos Generales", slug: "general-knowledge" },
  { title: "Air Brakes", spanish: "Frenos de Aire", slug: "air-brakes" },
  { title: "Combination Vehicles", spanish: "Vehículos Combinados", slug: "combination-vehicles" },
  { title: "Doubles/Triples", spanish: "Remolques Dobles/Triples", slug: "doubles-triples" },
  { title: "Tanker Vehicles", spanish: "Vehículos Cisterna", slug: "tanker" },
  { title: "HazMat", spanish: "Materiales Peligrosos", slug: "hazmat" },
  { title: "Passenger", spanish: "Vehículos de Pasajeros", slug: "passenger" },
  { title: "School Bus", spanish: "Autobús Escolar", slug: "school-bus" },
  { title: "Pre-Trip Inspection", spanish: "Inspección Previa al Viaje", slug: "pre-trip-inspection" },
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
            <Link href="/practice-tests">Practice Tests</Link>
            <Link href="/ebooks">Ebooks</Link>
            <Link href="/about">About</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>

          <Link href="/practice-tests" className="rounded-lg bg-[#16A34A] px-4 py-2 font-bold">
            Start Free Test
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
        <div>
          <p className="mb-3 font-bold text-[#16A34A]">
            English &amp; Español CDL Prep
          </p>

          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            Pass Your CDL Test
            <span className="block text-[#16A34A]">The First Time</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg">
            Free interactive CDL practice tests and downloadable prep ebooks &mdash; with real
            exam-style questions and detailed explanations. Study from your phone, tablet, or
            computer.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/practice-tests"
              className="rounded-lg bg-[#16A34A] px-6 py-3 font-bold text-white"
            >
              Start Free Practice Test
            </Link>

            <Link
              href="/ebooks"
              className="rounded-lg border border-[#0D2B45] px-6 py-3 font-bold"
            >
              Shop Prep Ebooks
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Bilingual", "Free Tests", "Mobile Ready", "PDF Ebooks"].map((item) => (
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

      <section id="practice-tests" className="bg-[#061A2E] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-[#16A34A]">
            Free &amp; Bilingual
          </p>
          <h2 className="mt-2 text-center text-4xl font-bold">CDL Practice Tests</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/70">
            Practice all 9 CDL endorsement categories with full interactive tests. Real questions,
            instant feedback, and answer explanations &mdash; start in English or Spanish with one tap.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="flex flex-col rounded-xl bg-white p-6 text-[#0D2B45] shadow-lg transition-all hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#0D2B45]">{cat.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-[#16A34A]">{cat.spanish}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#16A34A] px-3 py-1 text-xs font-bold text-white">
                    Free
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>Interactive practice test</span>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <Link
                    href={`/practice-tests/${cat.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-5 py-2.5 font-bold text-white transition-colors hover:bg-[#15803D]"
                  >
                    Start Practice Test
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href={`/practice-tests/${cat.slug}?lang=es`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#16A34A] px-5 py-2.5 font-bold text-[#16A34A] transition-colors hover:bg-[#16A34A] hover:text-white"
                  >
                    Empezar en Español
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/practice-tests"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-3 font-bold text-white transition-colors hover:bg-white hover:text-[#061A2E]"
            >
              View All Practice Tests
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section id="ebooks" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16A34A]">
            Study Offline
          </p>
          <h2 className="mt-2 text-4xl font-bold text-[#0D2B45]">CDL Prep Ebooks</h2>
          <p className="mt-3 text-gray-600">
            Downloadable CDL prep booklets in English and Spanish. Each PDF is delivered instantly to
            your email after a simple one-time purchase. No subscriptions.
          </p>

          <div className="mt-8 inline-flex flex-col items-center rounded-2xl bg-[#F6F9FC] px-10 py-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#16A34A]">
              Per Ebook
            </p>
            <p className="mt-2">
              <span className="text-5xl font-extrabold">$9.99</span>
            </p>
            <p className="mt-2 text-sm text-gray-500">One-time payment · Instant PDF download</p>
            <ul className="mt-6 space-y-2 text-left text-sm">
              <li>✓ English &amp; Spanish editions</li>
              <li>✓ Real CDL exam-style content</li>
              <li>✓ Delivered instantly by email</li>
              <li>✓ Study anytime, offline</li>
            </ul>
            <Link
              href="/ebooks"
              className="mt-8 block rounded-lg bg-[#16A34A] px-8 py-3 text-center font-bold text-white"
            >
              Browse Ebooks
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#F6F9FC] px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
          <Feature title="Free Practice Tests" text="Practice every endorsement at no cost." />
          <Feature title="Bilingual Support" text="English and Spanish for every test." />
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
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-xl font-bold text-[#0D2B45]">{title}</h3>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  )
}
