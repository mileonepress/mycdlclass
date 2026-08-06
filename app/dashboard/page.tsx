import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { PlayCircle, Trophy, BookOpen, ArrowRight } from "lucide-react"
import SiteHeader from "@/components/SiteHeader"
import Footer from "@/components/Footer"
import LogoutButton from "@/components/LogoutButton"
import { getUserCourseProgress } from "@/lib/courses/queries"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "My Courses",
  robots: { index: false },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/dashboard")
  }

  const progress = await getUserCourseProgress(user.id, "en")

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      <section className="bg-gradient-to-br from-[#061A2E] to-[#1E4D8C] px-6 py-12 text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold md:text-4xl">My Courses</h1>
            <p className="mt-2 text-white/75">{user.email}</p>
          </div>
          <LogoutButton variant="nav" />
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          {progress.length === 0 ? (
            <div className="rounded-3xl border border-[#F1F5F9] bg-white p-10 text-center shadow-[0_12px_38px_rgba(6,21,36,0.06)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF]">
                <BookOpen className="h-8 w-8 text-[#1E4D8C]" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-2xl font-extrabold">No courses yet</h2>
              <p className="mx-auto mt-2 max-w-md text-[#717680]">
                You haven&apos;t unlocked any courses. Try a free 3-question preview, then unlock the full course to
                start practicing.
              </p>
              <Link
                href="/courses"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
              >
                Browse Courses <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-extrabold">Continue learning</h2>
                <Link href="/courses" className="text-sm font-extrabold text-[#1E4D8C] hover:underline">
                  Browse more &rarr;
                </Link>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {progress.map((p) => (
                  <div
                    key={p.courseId}
                    className="flex flex-col rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-[0_12px_38px_rgba(6,21,36,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-extrabold text-[#0D2B45]">{p.courseTitle}</h3>
                      {p.attempts > 0 && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E7F7EF] px-3 py-1 text-xs font-extrabold text-[#14a86b]">
                          <Trophy className="h-3.5 w-3.5" aria-hidden="true" /> {p.bestPercentage}%
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-[#717680]">
                      {p.attempts > 0
                        ? `${p.attempts} practice ${p.attempts === 1 ? "attempt" : "attempts"} · best score ${p.bestPercentage}%`
                        : "Not started yet — jump in and take your first practice exam."}
                    </p>

                    <div className="mt-5 flex-1" />
                    <Link
                      href={`/courses/${p.courseSlug}/learn`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E4D8C] px-5 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
                    >
                      <PlayCircle className="h-5 w-5" aria-hidden="true" />
                      {p.attempts > 0 ? "Keep practicing" : "Start course"}
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
