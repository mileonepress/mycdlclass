import Link from "next/link"

const sitemap = [
  {
    title: "Main Pages",
    pages: [
      { name: "Homepage", url: "/", goal: "Introduce brand and main CTA" },
      { name: "Ebooks", url: "/ebooks", goal: "Sell downloadable prep PDFs" },
      { name: "About", url: "/about", goal: "Build trust and explain mission" },
      { name: "Contact", url: "/contact", goal: "Order and download support" },
    ],
  },
  {
    title: "Purchase Flow",
    pages: [
      { name: "Browse Ebooks", url: "/ebooks", goal: "Pick a CDL prep ebook" },
      { name: "Secure Checkout", url: "/ebooks", goal: "One-time Stripe payment" },
      { name: "Order Success", url: "/ebooks/success", goal: "Instant PDF delivery by email" },
    ],
  },
  {
    title: "Owner",
    pages: [
      { name: "Login", url: "/login", goal: "Owner sign-in" },
      { name: "Admin", url: "/admin/purchases", goal: "Manage ebook sales & access" },
    ],
  },
]

const journey = ["Homepage", "Browse Ebooks", "Secure Checkout", "Email Delivery", "Download PDF"]

export default function VisualSitemapPage() {
  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <section className="bg-[#061A2E] px-6 py-16 text-center text-white">
        <h1 className="text-balance text-4xl font-extrabold sm:text-5xl">MyCDLClass Visual Sitemap</h1>
        <p className="mx-auto mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-white/85">
          UX blueprint for navigation and bilingual CDL prep ebook sales.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/ebooks"
            className="rounded-lg bg-[#16A34A] px-6 py-3 font-bold text-white transition-colors hover:bg-[#15803D]"
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
            Primary path: visitors browse prep ebooks, purchase with a one-time payment, and receive
            a secure PDF download by email for offline study.
          </p>
        </div>
      </section>

      <section className="bg-[#061A2E] px-6 py-16 text-center text-white">
        <h2 className="text-3xl font-bold sm:text-4xl">Conversion Goal</h2>
        <p className="mx-auto mt-4 max-w-3xl text-pretty leading-relaxed text-white/85">
          Every main page should include a clear CTA to browse and buy a prep ebook.
        </p>
      </section>
    </main>
  )
}
