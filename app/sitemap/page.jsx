import Link from "next/link"

const sitemap = [
  {
    title: "Start",
    pages: [
      { name: "Homepage", url: "/", goal: "Introduce brand and main CTA" },
      { name: "Free Practice Test", url: "/free-practice-test", goal: "Capture free users" },
      { name: "Courses", url: "/courses", goal: "Show all 9 CDL courses" },
    ],
  },
  {
    title: "Learning Experience",
    pages: [
      { name: "General Knowledge", url: "/courses/general-knowledge", goal: "Buy course via PayPal" },
      { name: "Air Brakes", url: "/courses/air-brakes", goal: "Buy course via PayPal" },
      { name: "Combination Vehicles", url: "/courses/combination-vehicles", goal: "Buy course via PayPal" },
      { name: "Doubles/Triples", url: "/courses/doubles-triples", goal: "Buy course via PayPal" },
      { name: "Tanker Vehicles", url: "/courses/tanker", goal: "Buy course via PayPal" },
      { name: "HazMat", url: "/courses/hazmat", goal: "Buy course via PayPal" },
      { name: "Passenger", url: "/courses/passenger", goal: "Buy course via PayPal" },
      { name: "School Bus", url: "/courses/school-bus", goal: "Buy course via PayPal" },
      { name: "Pre-Trip Inspection", url: "/courses/pre-trip-inspection", goal: "Buy course via PayPal" },
    ],
  },
  {
    title: "Account & Conversion",
    pages: [
      { name: "Login / Sign Up", url: "/login", goal: "Student account access" },
      { name: "Dashboard", url: "/dashboard", goal: "Show premium app experience" },
      { name: "My Account", url: "/account", goal: "Manage account" },
      { name: "Admin", url: "/admin", goal: "Manage content and students" },
    ],
  },
]

const journey = [
  "Homepage",
  "Free Practice Test",
  "Courses",
  "Course Page",
  "PayPal Checkout",
]

export default function VisualSitemapPage() {
  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <section className="bg-[#061A2E] px-6 py-16 text-center text-white">
        <h1 className="text-balance text-4xl font-extrabold sm:text-5xl">MyCDLClass Visual Sitemap</h1>
        <p className="mx-auto mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-white/85">
          UX blueprint for navigation, course discovery, free practice tests, and per-course PayPal checkout.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/free-practice-test"
            className="rounded-lg bg-[#16A34A] px-6 py-3 font-bold text-white transition-colors hover:bg-[#15803D]"
          >
            Start Free Test
          </Link>
          <Link
            href="/courses"
            className="rounded-lg border border-white px-6 py-3 font-bold text-white transition-colors hover:bg-white hover:text-[#061A2E]"
          >
            Browse Courses
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
            Primary conversion path: visitors try free questions, browse all 9 CDL courses, then purchase individual
            courses with a one-time PayPal payment.
          </p>
        </div>
      </section>

      <section className="bg-[#061A2E] px-6 py-16 text-center text-white">
        <h2 className="text-3xl font-bold sm:text-4xl">Conversion Goal</h2>
        <p className="mx-auto mt-4 max-w-3xl text-pretty leading-relaxed text-white/85">
          Every main page should include a clear CTA to either start a free practice test or purchase a course with
          PayPal.
        </p>
      </section>
    </main>
  )
}
