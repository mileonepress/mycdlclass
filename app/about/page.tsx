import Image from "next/image"
import Link from "next/link"
import Footer from "@/components/Footer"
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "MyCDLClass provides bilingual online CDL training, free CDL practice tests, and prep ebooks in English and Spanish to help drivers pass the CDL permit test the first time.",
  path: "/about",
})

const values = [
  {
    title: "Bilingual by design",
    body: "Every course, practice test, and ebook is available in both English and Spanish so language is never a barrier to your CDL.",
  },
  {
    title: "Built for real exams",
    body: "Our questions, explanations, and booklets mirror the format and content of the official CDL knowledge and endorsement tests.",
  },
  {
    title: "Study anywhere",
    body: "Learn on your phone, tablet, or computer, and take your prep ebooks offline as downloadable PDFs.",
  },
]

const stats = [
  { value: "9", label: "CDL endorsement courses" },
  { value: "EN / ES", label: "Available in two languages" },
  { value: "100%", label: "Interactive practice tests" },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <nav className="sticky top-0 z-50 bg-[#061A2E] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="MyCDLClass" width={58} height={58} />
            <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
          </Link>

          <div className="hidden gap-6 text-sm md:flex">
            <Link href="/courses">Courses</Link>
            <Link href="/free-practice-test">Free Test</Link>
            <Link href="/ebooks">Ebooks</Link>
            <Link href="/about">About</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>

          <Link href="/courses" className="rounded-lg bg-[#16A34A] px-4 py-2 font-bold">
            Browse Courses
          </Link>
        </div>
      </nav>

      <section className="bg-[#061A2E] px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16A34A]">About Us</p>
          <h1 className="mt-2 text-balance text-4xl font-extrabold md:text-5xl">
            Helping drivers earn their CDL with confidence
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/75">
            MyCDLClass was created to make commercial driver&apos;s license training accessible,
            affordable, and available in both English and Spanish. We combine clear lessons,
            realistic interactive practice tests, and downloadable prep ebooks so you can study the
            way that works best for you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-8 text-center shadow-lg">
              <p className="text-3xl font-extrabold text-[#16A34A]">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-8">
        <h2 className="text-center text-3xl font-bold">Our mission</h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-gray-600">
          We believe a great career starts with passing your CDL exam the first time. Our goal is to
          give every aspiring driver the tools, language support, and practice they need to walk into
          the testing center prepared and confident.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-2xl bg-white p-8 shadow-lg">
              <h3 className="text-xl font-bold text-[#0D2B45]">{value.title}</h3>
              <p className="mt-3 leading-relaxed text-gray-600">{value.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[#1E4D8C] p-10 text-center text-white">
          <h2 className="text-balance text-3xl font-bold">Ready to start studying?</h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-white/80">
            Take a free interactive practice test, browse our bilingual courses, or grab a prep ebook
            to study offline.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/free-practice-test"
              className="rounded-lg bg-[#16A34A] px-6 py-3 font-bold text-white transition-colors hover:bg-[#15803d]"
            >
              Free Practice Test
            </Link>
            <Link
              href="/courses"
              className="rounded-lg border-2 border-white px-6 py-3 font-bold text-white transition-colors hover:bg-white hover:text-[#1E4D8C]"
            >
              Browse Courses
            </Link>
            <Link
              href="/ebooks"
              className="rounded-lg border-2 border-white px-6 py-3 font-bold text-white transition-colors hover:bg-white hover:text-[#1E4D8C]"
            >
              Shop Ebooks
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
