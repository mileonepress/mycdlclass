import Link from "next/link";
import Image from "next/image";
import { getCourses } from "@/lib/supabase/queries";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "CDL Training Courses & Practice Tests Online",
  description:
    "Online CDL training courses with full practice tests for general knowledge, air brakes, combination vehicles, hazmat, tanker, passenger, school bus, and pre-trip inspection. Bilingual Class A CDL training in English and Spanish.",
  path: "/courses",
});

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="min-h-screen bg-[#F6F9FC]">
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
            <Link href="/dashboard">Dashboard</Link>
          </div>

          <Link href="/free-practice-test" className="rounded-lg bg-[#16A34A] px-4 py-2 font-bold">
            Free Test
          </Link>
        </div>
      </nav>

      <section className="bg-[#061A2E] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold">CDL Training Courses</h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto">
            Online CDL training with professional lessons, realistic CDL practice
            tests, detailed answer explanations, and bilingual English and Spanish
            support &mdash; from general knowledge and air brakes to hazmat and
            pre-trip inspection.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link href="/free-practice-test" className="bg-[#16A34A] px-6 py-3 rounded-lg font-bold">
              Start Free Practice Test
            </Link>
            <Link href="/courses" className="border border-white px-6 py-3 rounded-lg font-bold">
              Browse All Courses
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-[#0D2B45]">{course.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-[#16A34A]">{course.spanish_title}</p>
                </div>
                {course.is_free ? (
                  <span className="bg-[#16A34A] text-white text-xs px-3 py-1 rounded-full">
                    Free Preview
                  </span>
                ) : (
                  <span className="bg-[#1E4D8C] text-white text-xs px-3 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <p className="mt-4 text-gray-600">{course.description}</p>
              <div className="mt-6">
                <Link
                  href={`/courses/${course.slug}`}
                  className="block text-center bg-[#1E4D8C] text-white py-3 rounded-lg font-bold hover:bg-[#163d6e] transition"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#0D2B45]">Why Students Choose MyCDLClass</h2>
          <div className="grid md:grid-cols-4 gap-6 mt-10">
            <Feature title="Bilingual" text="English & Spanish course options." />
            <Feature title="Practice Tests" text="Real CDL-style exam questions." />
            <Feature title="Mobile Friendly" text="Study on any device." />
            <Feature title="Certificates" text="Track and document progress." />
          </div>
        </div>
      </section>

      <section className="bg-[#061A2E] text-white py-20 text-center">
        <h2 className="text-4xl font-bold">Ready to Pass Your CDL Exam?</h2>
        <p className="mt-4 text-xl">Join thousands of future CDL drivers preparing with MyCDLClass.</p>
        <Link href="/courses" className="inline-block mt-8 bg-[#16A34A] px-8 py-4 rounded-lg font-bold text-lg">
          Browse Courses
        </Link>
      </section>
      <Footer />
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-6 border rounded-xl">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
}
