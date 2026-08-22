import Link from "next/link"
import type { Metadata } from "next"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "MyCDLClass is the CDL test prep brand of MileOne Press, offering bilingual CDL study guides in two formats — downloadable PDF ebooks and interactive online courses — in English and Spanish to help drivers pass their CDL exam the first time.",
}

const values = [
  {
    title: "Bilingual by design",
    body: "Every study guide is available in both English and Spanish so language is never a barrier to your CDL.",
  },
  {
    title: "Built for real exams",
    body: "Our content mirrors the format and questions of the official CDL knowledge and endorsement tests.",
  },
  {
    title: "Two ways to study",
    body: "Choose a downloadable PDF ebook to study offline, or an interactive online course with instant feedback and saved progress.",
  },
]

const stats = [
  { value: "9", label: "CDL endorsement topics" },
  { value: "EN / ES", label: "Available in two languages" },
  { value: "$14.99", label: "One-time price per study guide" },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      <section className="bg-[#061A2E] px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#1E4D8C]">About Us</p>
          <h1 className="mt-2 text-balance text-4xl font-extrabold md:text-5xl">
            Helping drivers earn their CDL with confidence
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/75">
            MyCDLClass was created to make commercial driver&apos;s license preparation accessible,
            affordable, and available in both English and Spanish. Every study guide comes in two
            formats &mdash; a downloadable PDF ebook you can study offline, or an interactive online
            course with instant feedback and saved progress &mdash; so you can prep the way that
            works best for you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-8 text-center shadow-lg">
              <p className="text-3xl font-extrabold text-[#1E4D8C]">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-8">
        <h2 className="text-center text-3xl font-bold">A MileOne Press brand</h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-gray-600">
          MyCDLClass is the CDL test prep brand of{" "}
          <a
            href="https://www.mileonepress.com"
            target="_blank"
            rel="noopener"
            className="font-semibold text-[#1E4D8C] hover:underline"
          >
            MileOne Press
          </a>
          . Both brands share the same mission: making commercial driver&apos;s license exam
          preparation clear, affordable, and accessible to every driver. When you study with
          MyCDLClass, you&apos;re learning from the same team behind MileOne Press.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-8">
        <h2 className="text-center text-3xl font-bold">Our mission</h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-gray-600">
          We believe a great career starts with passing your CDL exam the first time. Our goal is to
          give every aspiring driver the tools, language support, and practice they need to walk into
          the testing center prepared and confident.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-center text-3xl font-bold">One study guide, two formats</h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-gray-600">
          Every topic covers the same real exam-style questions and clear explanations. Pick the
          format that fits how you like to study.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <span className="w-fit rounded-full bg-[#1477DA] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Downloadable Ebook
            </span>
            <h3 className="mt-4 text-xl font-bold text-[#0D2B45]">Study Guide PDF</h3>
            <p className="mt-2 leading-relaxed text-gray-600">
              A one-time purchase delivered instantly to your inbox. Study offline on any device with
              no account required.
            </p>
            <Link
              href="/ebooks"
              className="mt-6 inline-flex w-fit items-center font-bold text-[#1E4D8C] hover:underline"
            >
              Browse ebooks &rarr;
            </Link>
          </div>
          <div className="flex flex-col rounded-2xl border-2 border-[#1E4D8C] bg-white p-8 shadow-lg">
            <span className="w-fit rounded-full bg-[#1E4D8C] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Interactive Course
            </span>
            <h3 className="mt-4 text-xl font-bold text-[#0D2B45]">Online Interactive Study Guide</h3>
            <p className="mt-2 leading-relaxed text-gray-600">
              Guided practice exams online with instant right/wrong feedback, explanations, and saved
              progress so you always know what to review next.
            </p>
            <Link
              href="/training-courses"
              className="mt-6 inline-flex w-fit items-center font-bold text-[#1E4D8C] hover:underline"
            >
              Explore interactive courses &rarr;
            </Link>
          </div>
        </div>
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
            Pick your CDL study guide in English or Spanish &mdash; download the ebook or study online
            with the interactive course.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/ebooks"
              className="rounded-lg bg-white px-6 py-3 font-bold text-[#1E4D8C] transition-colors hover:bg-white/90"
            >
              Browse Ebooks
            </Link>
            <Link
              href="/training-courses"
              className="rounded-lg border-2 border-white px-6 py-3 font-bold text-white transition-colors hover:bg-white hover:text-[#1E4D8C]"
            >
              Interactive Courses
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
