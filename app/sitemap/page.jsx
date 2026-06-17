import Link from "next/link"

const sitemap = [
  {
    title: "Start",
    pages: [
      { name: "Homepage", url: "/", goal: "Introduce brand and main CTA" },
      { name: "Practice Tests", url: "/practice-tests", goal: "Free interactive CDL tests" },
      { name: "Ebooks", url: "/ebooks", goal: "Sell downloadable prep PDFs" },
    ],
  },
  {
    title: "Practice Tests",
    pages: [
      { name: "General Knowledge", url: "/practice-tests/general-knowledge", goal: "Free interactive test" },
      { name: "Air Brakes", url: "/practice-tests/air-brakes", goal: "Free interactive test" },
      { name: "Combination Vehicles", url: "/practice-tests/combination-vehicles", goal: "Free interactive test" },
      { name: "Doubles/Triples", url: "/practice-tests/doubles-triples", goal: "Free interactive test" },
      { name: "Tanker Vehicles", url: "/practice-tests/tanker", goal: "Free interactive test" },
      { name: "HazMat", url: "/practice-tests/hazmat", goal: "Free interactive test" },
      { name: "Passenger", url: "/practice-tests/passenger", goal: "Free interactive test" },
      { name: "School Bus", url: "/practice-tests/school-bus", goal: "Free interactive test" },
      { name: "Pre-Trip Inspection", url: "/practice-tests/pre-trip-inspection", goal: "Free interactive test" },
    ],
  },
  {
    title: "Account & Conversion",
    pages: [
      { name: "Login / Sign Up", url: "/login", goal: "Student account access" },
      { name: "Dashboard", url: "/dashboard", goal: "Scores & ebook purchases" },
      { name: "My Account", url: "/account", goal: "Manage account" },
      { name: "Admin", url: "/admin/purchases", goal: "Manage ebook sales & access" },
    ],
  },
]

const journey = [
  "Homepage",
  "Practice Tests",
  "Take a Test",
  "Browse Ebooks",
  "Ebook Checkout",
]

export default function VisualSitemapPage() {
  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <section className="bg-[#061A2E] px-6 py-16 text-center text-white">
        <h1 className="text-balance text-4xl font-extrabold sm:text-5xl">MyCDLClass Visual Sitemap</h1>
        <p className="mx-auto mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-white/85">
          UX blueprint for navigation, free interactive practice tests, and prep ebook sales.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/practice-tests"
            className="rounded-lg bg-[#16A34A] px-6 py-3 font-bold text-white transition-colors hover:bg-[#15803D]"
          >
            Start Free Test
          </Link>
          <Link
            href="/ebooks"
            className="rounded-lg border border-white px-6 py-3 font-bold text-white transition-colors hover:bg-white hover:text-[#061A2E]"
          >
            Browse Ebooks
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
                    key={page.url}
                    href={page.url}
                    className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-[#16A34A] hover:bg-green-50"
                  >
                    <p className="font-bold">{page.name}</p>
                    <p className="mt-1 text-sm text-gray-600">{page.url}</p>
                    <p className="mt-2 text-sm font-medium text-[#16A34A]">{page.goal}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Recommended User Journey</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            {journey.map((step, index) => (
              <div key={step} className="rounded-xl border border-gray-200 p-5 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A] font-bold text-white">
                  {index + 1}
                </div>
                <p className="font-bold">{step}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-pretty text-center leading-relaxed text-gray-600">
            Primary path: visitors take free interactive practice tests, then purchase prep ebooks
            with a one-time payment for offline study.
          </p>
        </div>
      </section>

      <section className="bg-[#061A2E] px-6 py-16 text-center text-white">
        <h2 className="text-3xl font-bold sm:text-4xl">Conversion Goal</h2>
        <p className="mx-auto mt-4 max-w-3xl text-pretty leading-relaxed text-white/85">
          Every main page should include a clear CTA to either start a free practice test or buy a
          prep ebook.
        </p>
      </section>
    </main>
  )
}
