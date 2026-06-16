import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/lib/adminAuth"
import { createAdminClient } from "@/lib/supabase/admin"
import AdminNav from "@/components/AdminNav"

export const dynamic = "force-dynamic"

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export default async function AdminPage() {
  // Gate via the auth'd client (respects the user session).
  await createClient()
  const admin = await getAdminUser()
  if (!admin) redirect("/courses")

  // Use the service-role client for aggregate stats across all users.
  const db = createAdminClient()
  const today = startOfToday()

  const [
    coursesCount,
    purchasesCount,
    ebookCount,
    attemptsToday,
    purchasesToday,
    recentAttempts,
  ] = await Promise.all([
    db.from("courses").select("id", { count: "exact", head: true }),
    db.from("purchases").select("id", { count: "exact", head: true }).eq("status", "completed"),
    db.from("ebook_purchases").select("id", { count: "exact", head: true }).eq("status", "completed"),
    db.from("user_quiz_attempts").select("id", { count: "exact", head: true }).gte("created_at", today),
    db.from("purchases").select("amount").eq("status", "completed").gte("created_at", today),
    db
      .from("user_quiz_attempts")
      .select("percentage, passed, created_at, course_id")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const revenueToday = (purchasesToday.data || []).reduce(
    (sum: number, p: { amount: number | null }) => sum + (Number(p.amount) || 0),
    0,
  )

  const stats = [
    { label: "Courses", value: coursesCount.count ?? 0, href: "/admin/courses" },
    { label: "Course sales", value: purchasesCount.count ?? 0, href: "/admin/purchases" },
    { label: "Ebook sales", value: ebookCount.count ?? 0, href: "/admin/purchases" },
    { label: "Quizzes today", value: attemptsToday.count ?? 0, href: "/admin/analytics" },
  ]

  return (
    <>
      <AdminNav email={admin.email} />
      <main className="min-h-screen bg-[#F1F5F9] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16A34A]">Admin Portal</p>
          <h1 className="mt-1 text-3xl font-bold text-[#0D2B45]">Overview</h1>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="mt-1 text-3xl font-bold text-[#0D2B45]">{s.value}</p>
              </Link>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-[#0D2B45] p-5 text-white">
              <p className="text-sm text-white/70">Revenue today</p>
              <p className="mt-1 text-3xl font-bold">${revenueToday.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#0D2B45]">Quick actions</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/admin/courses"
                  className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-[#1E4D8C]"
                >
                  <p className="font-bold text-[#0D2B45]">Manage courses</p>
                  <p className="text-sm text-gray-500">View and edit all interactive courses.</p>
                </Link>
                <Link
                  href="/admin/access"
                  className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-[#1E4D8C]"
                >
                  <p className="font-bold text-[#0D2B45]">Issue access by email</p>
                  <p className="text-sm text-gray-500">Grant full courses or send ebooks to a customer.</p>
                </Link>
                <Link
                  href="/admin/analytics"
                  className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-[#1E4D8C]"
                >
                  <p className="font-bold text-[#0D2B45]">Daily scores &amp; activity</p>
                  <p className="text-sm text-gray-500">Track quiz scores, active users, and trends.</p>
                </Link>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#0D2B45]">Latest quiz activity</h2>
              <div className="mt-4 flex flex-col gap-2">
                {(recentAttempts.data || []).length === 0 ? (
                  <p className="text-sm text-gray-500">No quiz attempts yet.</p>
                ) : (
                  (recentAttempts.data || []).map(
                    (
                      a: { percentage: number; passed: boolean; created_at: string },
                      i: number,
                    ) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5"
                      >
                        <span className="text-sm text-gray-600">
                          {new Date(a.created_at).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="font-bold text-[#0D2B45]">{Math.round(a.percentage)}%</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              a.passed ? "bg-green-100 text-[#16A34A]" : "bg-red-100 text-red-600"
                            }`}
                          >
                            {a.passed ? "Passed" : "Failed"}
                          </span>
                        </span>
                      </div>
                    ),
                  )
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
