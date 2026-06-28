import Link from "next/link"
import NewsletterSignup from "@/components/NewsletterSignup"

export default function Footer() {
  return (
    <footer className="bg-[#061A2E] text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12">
          <NewsletterSignup
            source="footer"
            heading="Get CDL study tips & ebook updates"
            subtext="New CDL prep ebooks and exam tips in English and Spanish."
          />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="text-xl font-extrabold">
              My<span className="text-[#16A34A]">CDL</span>Class
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Downloadable bilingual CDL prep ebooks to help you pass your exam. Instant PDF delivery,
              no account required.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/80">Shop</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/ebooks" className="hover:text-[#16A34A]">
                  CDL Prep Ebooks
                </Link>
              </li>
              <li>
                <Link href="/ebooks" className="hover:text-[#16A34A]">
                  English Editions
                </Link>
              </li>
              <li>
                <Link href="/ebooks" className="hover:text-[#16A34A]">
                  Spanish Editions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/80">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/about" className="hover:text-[#16A34A]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#16A34A]">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} MyCDLClass. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
