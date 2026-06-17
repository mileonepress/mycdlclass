import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import Footer from "@/components/Footer"
import LogoutButton from "@/components/LogoutButton"
import { createClient } from "@/lib/supabase/server"
import { getCourses, getBestQuizScore } from "@/lib/supabase/queries"
import { getEbookProduct } from "@/lib/ebookProducts"
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

  // Practice tests reuse the question catalog (one "test" per category).
  const tests = await getCourses()

  // Best practice-test score per category for this user.
  const testStats = await Promise.all(
    tests.map(async (test) => {
      const bestScore = await getBestQuizScore(user.id, test.id)
      return { test, bestScore }
    }),
  )

  const attemptedCount = testStats.filter((s) => s.bestScore).length
  const passedCount = testStats.filter((s) => s.bestScore?.passed).length

  // Ebook purchases for this user (download links live in the buyer's email).
  const { data: ebookRows } = await supabase
    .from("ebook_purchases")
    .select("ebook_slug, language, download_token, created_at")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })

  const ebooks = (ebookRows || []).map((row) => ({
    ...row,
    product: getEbookProduct(row.ebook_slug),
  }))

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <nav className="sticky top-0 z-50 bg-[#061A2E] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="MyCDLClass" width={58} height={58} />
            <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
          </Link>
          <div className="hidden gap-6 text-sm md:flex">
            <Link href="/practice-tests">Practice Tests</Link>
            <Link href="/ebooks">Ebooks</Link>
            <Link href="/account">Account</Link>
            {isAdmin && <Link href="/admin/purchases">Admin</Link>}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/practice-tests" className="hidden rounded-lg bg-[#16A34A] px-4 py-2 font-bold sm:inline-block">
              Practice Tests
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
            <StatCard label="Tests Attempted" value={`${attemptedCount}/${tests.length}`} />
            <StatCard label="Tests Passed" value={`${passedCount}`} />
            <StatCard label="Ebooks Owned" value={`${ebooks.length}`} />
          </div>
        </div>
      </section>

      {/* Practice test progress */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Practice Test Progress</h2>
          <Link href="/practice-tests" className="text-sm font-bold text-[#1E4D8C] hover:underline">
            View all tests
          </Link>
        </div>

        {tests.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-lg font-bold">Practice tests are coming soon.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testStats.map(({ test, bestScore }) => (
              <div key={test.id} className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{test.title}</h3>
                    <p className="text-sm text-[#16A34A]">{test.spanish_title}</p>
                  </div>
                  {bestScore?.passed ? (
                    <span className="rounded-full bg-[#E7F7ED] px-3 py-1 text-xs font-bold text-[#16A34A]">
                      Passed
                    </span>
                  ) : bestScore ? (
                    <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-bold text-[#B45309]">
                      In progress
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#E6F0FF] px-3 py-1 text-xs font-bold text-[#1E4D8C]">
                      Not started
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  {bestScore ? (
                    <p className="text-sm text-gray-600">
                      Best score: <span className="font-bold text-[#0D2B45]">{bestScore.percentage}%</span>{" "}
                      ({bestScore.score}/{bestScore.total_questions})
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">You haven&apos;t taken this test yet.</p>
                  )}
                </div>

                <div className="mt-6">
                  <Link
                    href={`/practice-tests/${test.slug}`}
                    className="inline-block w-full rounded-lg bg-[#16A34A] py-2.5 text-center text-sm font-bold text-white hover:bg-[#15803d]"
                  >
                    {bestScore ? "Retake Test" : "Start Test"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Ebook purchases */}
      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Ebooks</h2>
            <Link href="/ebooks" className="text-sm font-bold text-[#1E4D8C] hover:underline">
              Browse ebooks
            </Link>
          </div>

          {ebooks.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-[#F6F9FC] p-10 text-center">
              <p className="text-lg font-bold">You haven&apos;t purchased any ebooks yet.</p>
              <p className="mt-2 text-gray-600">
                Grab a downloadable CDL prep booklet to study offline in English or Spanish.
              </p>
              <Link
                href="/ebooks"
                className="mt-6 inline-block rounded-xl bg-[#16A34A] px-7 py-3 font-bold text-white"
              >
                Shop Ebooks
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ebooks.map((eb) => (
                <div
                  key={`${eb.ebook_slug}-${eb.created_at}`}
                  className="flex items-center justify-between rounded-xl border bg-[#F6F9FC] p-5"
                >
                  <div>
                    <h3 className="font-bold">{eb.product?.title || eb.ebook_slug}</h3>
                    <p className="text-sm text-[#16A34A]">
                      {eb.product?.languageLabel || (eb.language === "es" ? "Spanish" : "English")}
                    </p>
                  </div>
                  {eb.download_token ? (
                    <a
                      href={`/api/ebooks/download?token=${encodeURIComponent(eb.download_token)}`}
                      className="rounded-lg bg-[#1E4D8C] px-4 py-2 text-sm font-bold text-white hover:bg-[#163d6e]"
                    >
                      Download
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
