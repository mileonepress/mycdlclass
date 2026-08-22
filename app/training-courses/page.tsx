import Link from "next/link";
import Image from "next/image";
import { getCourses } from "@/lib/supabase/queries";
import { getCourseProduct } from "@/lib/courseProducts";
import Footer from "@/components/Footer";

export const metadata = {
  title: "CDL Training Courses | MyCDLClass",
  description:
    "Interactive online CDL training courses with lessons, practice tests, and detailed explanations. Bilingual English & Spanish support.",
};

export default async function TrainingCoursesPage() {
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
            <Link href="/training-courses">Courses</Link>
            <Link href="/courses">Free Tests</Link>
            <Link href="/ebooks">Ebooks</Link>
          </div>

          <Link href="/courses" className="rounded-lg bg-[#16A34A] px-4 py-2 font-bold">
            Free Test
          </Link>
        </div>
      </nav>

      <section className="bg-[#061A2E] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-balance">CDL Training Courses</h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto text-pretty">
            Study online with professional CDL lessons, practice tests,
            detailed explanations, and bilingual support.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link href="/courses" className="bg-[#16A34A] px-6 py-3 rounded-lg font-bold">
              Start Free Practice Test
            </Link>
            <Link href="#courses" className="border border-white px-6 py-3 rounded-lg font-bold">
              Browse All Courses
            </Link>
          </div>
        </div>
      </section>

      <section id="courses" className="max-w-7xl mx-auto py-16 px-6">
        {courses.length === 0 ? (
          <p className="text-center text-gray-500">Courses are coming soon.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const product = getCourseProduct(course.slug);
              const isPaid = !!product && !course.is_free;
              return (
                <div key={course.id} className="bg-white rounded-2xl shadow-lg border p-6 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-[#0D2B45]">{course.title}</h2>
                      <p className="mt-1 text-sm font-semibold text-[#16A34A]">{course.spanish_title}</p>
                    </div>
                    {isPaid ? (
                      <span className="bg-[#1E4D8C] text-white text-xs px-3 py-1 rounded-full">
                        ${product!.price}
                      </span>
                    ) : (
                      <span className="bg-[#16A34A] text-white text-xs px-3 py-1 rounded-full">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-gray-600 flex-1">{course.description}</p>
                  <div className="mt-6">
                    <Link
                      href={`/training-courses/${course.slug}`}
                      className="block text-center bg-[#1E4D8C] text-white py-3 rounded-lg font-bold hover:bg-[#163d6e] transition"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#0D2B45] text-balance">Why Students Choose MyCDLClass</h2>
          <div className="grid md:grid-cols-4 gap-6 mt-10">
            <Feature title="Bilingual" text="English & Spanish course options." />
            <Feature title="Practice Tests" text="Real CDL-style exam questions." />
            <Feature title="Mobile Friendly" text="Study on any device." />
            <Feature title="Track Progress" text="Save your scores and lessons." />
          </div>
        </div>
      </section>

      <section className="bg-[#061A2E] text-white py-20 text-center px-6">
        <h2 className="text-4xl font-bold text-balance">Ready to Pass Your CDL Exam?</h2>
        <p className="mt-4 text-xl text-pretty">Join thousands of future CDL drivers preparing with MyCDLClass.</p>
        <Link href="#courses" className="inline-block mt-8 bg-[#16A34A] px-8 py-4 rounded-lg font-bold text-lg">
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
      <h3 className="font-bold text-lg text-[#0D2B45]">{title}</h3>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
}
