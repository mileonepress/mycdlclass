import Link from "next/link"
import { redirect } from "next/navigation"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"
import { getPublishedCourses } from "@/lib/supabase/courseCatalog"
import { getCurrentUser, getEntitledCourseIds } from "@/lib/access"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "My Courses",
  description: "Access the interactive CDL training courses you have purchased.",
  robots: { index: false, follow: false },
}

function formatPrice(cents: number | null): string {
  if (!cents || cents <= 0) return "Free"
  return `$${(cents / 100).toFixed(2)}`
}

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login?next=/account")
  }

  const [courses, entitledIds] = await Promise.all([
    getPublishedCourses("en"),
    getEntitledCourseIds(user.id),
  ])

  const entitledSet = new Set(entitledIds)
  const ownedCourses = courses.filter((c) => entitledSet.has(c.id))

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      <section className="bg-[#061A2E] px-6 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#4C8DE0]">My Account</p>
          <h1 className="mt-2 text-balance text-3xl font-extrabold md:text-4xl">My Courses</h1>
          <p className="mt-3 max-w-2xl text-pretty text-white/75">
            Signed in as <span className="font-semibold text-white">{user.email}</span>. Pick up
            right where you left off in your interactive CDL training courses.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        {ownedCourses.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#0D2B45]">You haven&apos;t enrolled in a course yet</h2>
            <p className="mx-auto mt-2 max-w-md text-pretty text-gray-600">
              Browse our interactive CDL training courses to start studying with instant feedback and
              progress tracking, or grab a downloadable study guide ebook.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/training-courses"
                className="rounded-lg bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
              >
                Explore Interactive Courses
              </Link>
              <Link
                href="/ebooks"
                className="rounded-lg border border-[#1E4D8C] px-6 py-3 font-bold text-[#1E4D8C] transition-colors hover:bg-[#1E4D8C] hover:text-white"
              >
                Browse Study Guide Ebooks
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0D2B45]">
                {ownedCourses.length} {ownedCourses.length === 1 ? "course" : "courses"} enrolled
              </h2>
              <Link href="/training-courses" className="text-sm font-bold text-[#1E4D8C] hover:underline">
                Browse more courses →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ownedCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/training-courses/${course.slug}`}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#EAF2FC] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1E4D8C]">
                      {course.category || "Course"}
                    </span>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      Enrolled
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[#0D2B45]">{course.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                    {course.shortDescription}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-gray-500">
                    <span>{course.lessonCount} practice exams</span>
                    {course.estimatedMinutes ? <span>{course.estimatedMinutes} min</span> : null}
                  </div>

                  <span className="mt-4 text-sm font-bold text-[#1E4D8C]">Continue studying →</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      <Footer />
    </main>
  )
}
