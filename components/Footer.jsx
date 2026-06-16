import Link from "next/link"
import NewsletterSignup from "@/components/NewsletterSignup"

export default function Footer() {
  return (
    <footer className="bg-[#061A2E] text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12">
          <NewsletterSignup source="footer" />
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-extrabold">
              My<span className="text-[#16A34A]">CDL</span>Class
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Bilingual CDL training and practice tests to help you pass your exam.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/80">Learn</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/courses" className="hover:text-[#16A34A]">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/free-practice-test" className="hover:text-[#16A34A]">
                  Free Practice Test
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#16A34A]">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/80">Account</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/login" className="hover:text-[#16A34A]">
                  Login / Sign Up
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#16A34A]">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/80">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
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
