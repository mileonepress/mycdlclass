import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import Footer from "@/components/Footer"
import LogoutButton from "@/components/LogoutButton"
import { createClient } from "@/lib/supabase/server"
import { getCourses, getLessons, getUserProgress, getBestQuizScore } from "@/lib/supabase/queries"
import { getPurchasedSlugs, isPaidCourse } from "@/lib/access"
import { getCourseProduct } from "@/lib/courseProducts"
import { isAdminEmail } from "@/lib/adminAuth"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/dashboard")}`)
  }

  const isAdmin = isAdminEmail(user.email)

  const [courses, purchasedSlugs] = await Promise.all([getCourses(), getPurchasedSlugs(user.id)])
  const purchasedSet = new Set(purchasedSlugs)

  // Courses the user can study: free courses + purchased paid courses.
  const myCourses = courses.filter((c) => !isPaidCourse(c.slug) || purchasedSet.has(c.slug))
  const availableCourses = courses.filter((c) => isPaidCourse(c.slug) && !purchasedSet.has(c.slug))

  // Compute progress + best score per accessible course.
  const courseStats = await Promise.all(
    myCourses.map(async (course) => {
      const lessons = await getLessons(course.id)
      const lessonIds = lessons.map((l) => l.id)
      let completed = 0
      if (lessonIds.length > 0) {
        const progress = await getUserProgress(user.id, lessonIds)
        completed = progress.filter((p) => p.completed).length
      }
      const bestScore = await getBestQuizScore(user.id, course.id)
      const percent = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0
      return {
        course,
        totalLessons: lessons.length,
        completedLessons: completed,
        percent,
        bestScore,
      }
    }),
  )

  const totalLessons = courseStats.reduce((sum, s) => sum + s.totalLessons, 0)
  const totalCompleted = courseStats.reduce((sum, s) => sum + s.completedLessons, 0)
  const passedCount = courseStats.filter((s) => s.bestScore?.passed).length

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
            <Link href="/account">Account</Link>
            {isAdmin && <Link href="/admin/purchases">Admin</Link>}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/courses" className="hidden rounded-lg bg-[#16A34A] px-4 py-2 font-bold sm:inline-block">
              Browse Courses
            </Link>
            <LogoutButton variant="nav" />
          </div>
        </div>
      </nav>

      {/* Header + stats */}
      <section className="bg-[#061A2E] px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="font-bold text-[#16A34A]">Your Dashboard</p>
          <h1 className="mt-2 text-4xl font-extrabold">Welcome back</h1>
          <p className="mt-2 text-white/80">{user.email}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Courses Unlocked" value={`${myCourses.length}`} />
            <StatCard label="Lessons Completed" value={`${totalCompleted}/${totalLessons}`} />
            <StatCard label="Tests Passed" value={`${passedCount}`} />
          </div>
        </div>
      </section>

      {/* My courses */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="text-2xl font-bold">My Courses</h2>

        {myCourses.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-lg font-bold">You haven&apos;t unlocked any courses yet.</p>
            <p className="mt-2 text-gray-600">Purchase a course to start studying and tracking your progress.</p>
            <Link
              href="/courses"
              className="mt-6 inline-block rounded-xl bg-[#16A34A] px-7 py-3 font-bold text-white"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courseStats.map(({ course, percent, completedLessons, totalLessons, bestScore }) => (
              <div key={course.id} className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{course.title}</h3>
                    <p className="text-sm text-[#16A34A]">{course.spanish_title}</p>
                  </div>
                  {isPaidCourse(course.slug) ? (
                    <span className="rounded-full bg-[#E6F0FF] px-3 py-1 text-xs font-bold text-[#1E4D8C]">
                      Owned
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#E7F7ED] px-3 py-1 text-xs font-bold text-[#16A34A]">
                      Free
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <div className="flex items-center gap-3">
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full bg-[#16A34A] transition-all" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-sm font-bold">{percent}%</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {completedLessons} of {totalLessons} lessons completed
                  </p>
                  {bestScore && (
                    <p className="mt-1 text-sm text-gray-600">
                      Best test score: <span className="font-bold">{bestScore.percentage}%</span>
                      {bestScore.passed && <span className="ml-1 text-[#16A34A]">Passed</span>}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="flex-1 rounded-lg bg-[#1E4D8C] py-2.5 text-center text-sm font-bold text-white hover:bg-[#163d6e]"
                  >
                    {percent > 0 ? "Continue" : "Start"}
                  </Link>
                  <Link
                    href={`/courses/${course.slug}/quiz`}
                    className="flex-1 rounded-lg border border-[#1E4D8C] py-2.5 text-center text-sm font-bold text-[#1E4D8C] hover:bg-[#F6F9FC]"
                  >
                    Practice Test
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Available to unlock */}
      {availableCourses.length > 0 && (
        <section className="bg-white px-6 py-14">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold">Unlock More Courses</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableCourses.map((course) => {
                const product = getCourseProduct(course.slug)
                return (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="flex items-center justify-between rounded-xl border bg-[#F6F9FC] p-5 transition-colors hover:border-[#16A34A]"
                  >
                    <div>
                      <h3 className="font-bold">{course.title}</h3>
                      <p className="text-sm text-[#16A34A]">{course.spanish_title}</p>
                    </div>
                    {product && <span className="font-extrabold text-[#16A34A]">${product.price}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-6">
      <p className="text-3xl font-extrabold text-[#16A34A]">{value}</p>
      <p className="mt-1 text-sm text-white/80">{label}</p>
    </div>
  )
}
