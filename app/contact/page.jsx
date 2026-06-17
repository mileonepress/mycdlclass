import Link from "next/link"
import ContactForm from "./ContactForm"

export const metadata = {
  title: "Contact Us | MyCDLClass",
  description: "Get in touch with the MyCDLClass team for help with courses, payments, or account questions.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Nav */}
      <nav className="bg-[#061A2E] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-extrabold">
            My<span className="text-[#16A34A]">CDL</span>Class
          </Link>
          <div className="hidden gap-6 text-sm md:flex">
            <Link href="/practice-tests">Practice Tests</Link>
            <Link href="/ebooks">Ebooks</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
          <Link href="/practice-tests" className="rounded-lg bg-[#16A34A] px-4 py-2 font-bold">
            Start Free Test
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#061A2E] px-6 pb-16 pt-6 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-extrabold">Contact Us</h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-white/85">
            Questions about a course, a payment, or your account? Send us a message and we&apos;ll get back to you by
            email as soon as we can.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
