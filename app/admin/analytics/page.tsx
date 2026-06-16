import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/lib/adminAuth"
import { createAdminClient } from "@/lib/supabase/admin"
import AdminNav from "@/components/AdminNav"

export const dynamic = "force-dynamic"

function dayKey(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default async function AdminAnalyticsPage() {
  await createClient()
  const admin = await getAdminUser()
  if (!admin) redirect("/courses")

  const db = createAdminClient()
  const since = new Date()
  since.setDate(since.getDate() - 13)
  since.setHours(0, 0, 0, 0)
  const sinceIso = since.toISOString()

  const [attemptsRes, usersRes, coursesRes] = await Promise.all([
    db
      .from("user_quiz_attempts")
      .select("user_id, percentage, passed, created_at, course_id")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false }),
    db.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    db.from("courses").select("id, title"),
  ])

  const attempts = attemptsRes.data || []
  const allUsers = usersRes.data?.users || []
  const courseName = new Map<string, string>()
  for (const c of coursesRes.data || []) courseName.set(c.id, c.title)

  // Build last 14 days buckets.
  const days: { key: string; count: number; avg: number; passRate: number }[] = []
  const buckets = new Map<string, { sum: number; n: number; passed: number }>()
  for (const a of attempts) {
    const k = dayKey(a.created_at)
    const b = buckets.get(k) || { sum: 0, n: 0, passed: 0 }
    b.sum += Number(a.percentage) || 0
    b.n += 1
    if (a.passed) b.passed += 1
    buckets.set(k, b)
  }
  for (let i = 0; i < 14; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    const k = dayKey(d.toISOString())
    const b = buckets.get(k)
    days.push({
      key: k,
      count: b?.n || 0,
      avg: b && b.n ? Math.round(b.sum / b.n) : 0,
      passRate: b && b.n ? Math.round((b.passed / b.n) * 100) : 0,
    })
  }
  const maxCount = Math.max(1, ...days.map((d) => d.count))

  // Active users in window + new signups today.
  const activeUserIds = new Set(attempts.map((a) => a.user_id))
  const startToday = new Date()
  startToday.setHours(0, 0, 0, 0)
  const newToday = allUsers.filter(
    (u) => u.created_at && new Date(u.created_at) >= startToday,
  ).length

  // Recent users list.
  const recentUsers = [...allUsers]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12)

  const totalToday = days[days.length - 1]?.count || 0
  const avgToday = days[days.length - 1]?.avg || 0

  const summary = [
    { label: "Total users", value: allUsers.length },
    { label: "New users today", value: newToday },
    { label: "Active users (14d)", value: activeUserIds.size },
    { label: "Quizzes today", value: totalToday },
  ]

  return (
    <>
      <AdminNav email={admin.email} />
      <main className="min-h-screen bg-[#F1F5F9] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16A34A]">Admin Portal</p>
          <h1 className="mt-1 text-3xl font-bold text-[#0D2B45]">Daily Scores &amp; Activity</h1>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summary.map((s) => (
              <div key={s.label} className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="mt-1 text-3xl font-bold text-[#0D2B45]">{s.value}</p>
              </div>
            ))}
          </div>

          <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0D2B45]">Quiz attempts (last 14 days)</h2>
              <p className="text-sm text-gray-500">Avg score today: <span className="font-bold text-[#0D2B45]">{avgToday}%</span></p>
            </div>
            <div className="mt-6 flex h-48 items-end gap-2">
              {days.map((d) => (
                <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t bg-[#16A34A]"
                      style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count ? "4px" : "0" }}
                      title={`${d.count} attempts · avg ${d.avg}% · ${d.passRate}% pass`}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">{d.key}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0D2B45]">Recent quiz scores</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Course</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.slice(0, 20).map((a, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 pr-4 text-gray-600">{new Date(a.created_at).toLocaleString()}</td>
                      <td className="py-2 pr-4 text-[#0D2B45]">{courseName.get(a.course_id) || "—"}</td>
                      <td className="py-2 pr-4 font-bold text-[#0D2B45]">{Math.round(a.percentage)}%</td>
                      <td className="py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            a.passed ? "bg-green-100 text-[#16A34A]" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {a.passed ? "Passed" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {attempts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-gray-500">
                        No quiz activity in the last 14 days.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0D2B45]">Recent users</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Joined</th>
                    <th className="py-2">Last sign-in</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4 text-[#0D2B45]">{u.email}</td>
                      <td className="py-2 pr-4 text-gray-600">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-2 text-gray-600">
                        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
