import Image from "next/image"
import type { Metadata } from "next"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"
import EbookCheckoutButton from "@/components/EbookCheckoutButton"
import { listEbookProducts, EBOOK_PRICE } from "@/lib/ebookProducts"

export const metadata: Metadata = {
  title: "CDL Prep Ebooks (PDF) | MyCDLClass",
  description:
    "Downloadable CDL prep exam booklets in English and Spanish. Each PDF ebook is $9.99 and is delivered instantly to your email after purchase.",
}

export default function EbooksPage() {
  const ebooks = listEbookProducts()

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      <section className="bg-[#061A2E] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16A34A]">
            Downloadable PDF Ebooks
          </p>
          <h1 className="mt-2 text-balance text-4xl font-extrabold md:text-5xl">
            CDL Prep Exam Booklets
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-white/70">
            Study offline with our CDL prep booklets, available in English and Spanish. Each ebook is{" "}
            <span className="font-bold text-white">${EBOOK_PRICE}</span> and is delivered instantly to
            your email as a secure PDF download right after checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ebooks.map((ebook) => (
            <div
              key={ebook.slug}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl"
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
                <h2 className="text-lg font-bold text-[#0D2B45]">{ebook.title}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  CDL Prep Exam Booklet &middot; PDF
                </p>
                <p className="mt-3 text-2xl font-extrabold text-[#0D2B45]">${ebook.price}</p>
                <p className="mb-4 mt-1 text-xs text-gray-500">
                  Delivered to your email after purchase.
                </p>
                <div className="mt-auto">
                  <EbookCheckoutButton slug={ebook.slug} price={ebook.price} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-gray-500">
          Every ebook is delivered instantly to your email as a secure PDF after checkout &mdash; no
          account or subscription required.
        </p>
      </section>

      <Footer />
    </main>
  )
}
