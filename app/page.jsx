import Image from "next/image"
import Link from "next/link"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"
import EbookCheckoutButton from "@/components/EbookCheckoutButton"
import { listEbookProducts, EBOOK_PRICE } from "@/lib/ebookProducts"

export default function HomePage() {
  const featured = listEbookProducts().slice(0, 6)

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
        <div>
          <p className="mb-3 font-bold text-[#16A34A]">English &amp; Español CDL Prep Ebooks</p>

          <h1 className="text-balance text-5xl font-extrabold leading-tight md:text-6xl">
            Pass Your CDL Test
            <span className="block text-[#16A34A]">The First Time</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg">
            Downloadable CDL prep ebooks with real exam-style questions and clear explanations. Buy
            once, get an instant PDF in your inbox, and study on any device &mdash; no account needed.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/ebooks"
              className="rounded-lg bg-[#16A34A] px-6 py-3 font-bold text-white transition-colors hover:bg-[#15803d]"
            >
              Browse Ebooks
            </Link>
            <Link href="/about" className="rounded-lg border border-[#0D2B45] px-6 py-3 font-bold">
              How It Works
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Bilingual", "Instant PDF", "Mobile Ready", "No Account"].map((item) => (
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

      {/* How it works */}
      <section className="bg-[#061A2E] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-[#16A34A]">
            Simple &amp; Seamless
          </p>
          <h2 className="mt-2 text-center text-4xl font-bold">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/70">
            Buying your CDL prep ebook takes less than a minute &mdash; no sign-up, no subscription.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step
              number="1"
              title="Pick Your Ebook"
              text="Choose your CDL topic in English or Spanish from our catalog."
            />
            <Step
              number="2"
              title="Checkout Securely"
              text="Pay once with a secure card checkout. No account to create."
            />
            <Step
              number="3"
              title="Download Instantly"
              text="Your PDF is emailed right away so you can study offline, anywhere."
            />
          </div>
        </div>
      </section>

      {/* Featured ebooks */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#16A34A]">
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
                      ebook.language === "es" ? "bg-[#1E4D8C]" : "bg-[#16A34A]"
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
              className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-8 py-3 font-bold text-white transition-colors hover:bg-[#15803d]"
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
          <Feature title="Bilingual Editions" text="Every booklet in English and Spanish." />
          <Feature title="Instant Delivery" text="PDF emailed the moment you check out." />
          <Feature title="Study Anywhere" text="Read on phone, tablet, or computer, offline." />
          <Feature title="No Account Needed" text="One-time purchase, no sign-up or subscription." />
        </div>
      </section>

      <Footer />
    </main>
  )
}

function Step({ number, title, text }) {
  return (
    <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#16A34A] text-xl font-extrabold text-white">
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
