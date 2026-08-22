import Link from "next/link"
import NewsletterSignup from "@/components/NewsletterSignup"

export default function Footer() {
  return (
    <footer className="bg-[#061A2E] text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12">
          <NewsletterSignup
            source="footer"
            heading="Get CDL study tips & exam updates"
            subtext="Free CDL exam tips and new study guide releases in English and Spanish."
          />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="text-xl font-extrabold">
              My<span className="text-[#1E4D8C]">CDL</span>Class
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Bilingual CDL test prep to help you pass the first time &mdash; downloadable study guide
              ebooks and interactive online courses in English and Spanish.
            </p>
            <p className="mt-3 text-sm text-white/70">
              A{" "}
              <a
                href="https://www.mileonepress.com"
                target="_blank"
                rel="noopener"
                className="font-semibold text-[#1E4D8C] hover:underline"
              >
                MileOne Press
              </a>{" "}
              brand.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/80">Study & Shop</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/training-courses" className="hover:text-[#1E4D8C]">
                  Interactive CDL Courses
                </Link>
              </li>
              <li>
                <Link href="/ebooks" className="hover:text-[#1E4D8C]">
                  CDL Study Guide Ebooks
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#1E4D8C]">
                  Free CDL Practice Tests
                </Link>
              </li>
              <li>
                <Link href="/es/cursos" className="hover:text-[#1E4D8C]">
                  Exámenes CDL en Español
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/80">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/about" className="hover:text-[#1E4D8C]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#1E4D8C]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#1E4D8C]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="mailto:info@mycdlclass.com" className="hover:text-[#1E4D8C]">
                  info@mycdlclass.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/60">
          <p>
            &copy; {new Date().getFullYear()} MyCDLClass, a{" "}
            <a
              href="https://www.mileonepress.com"
              target="_blank"
              rel="noopener"
              className="hover:text-[#1E4D8C]"
            >
              MileOne Press
            </a>{" "}
            brand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
