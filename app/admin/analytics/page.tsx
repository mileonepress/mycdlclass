import Link from "next/link"
import { redirect } from "next/navigation"
import { getAdminUser, getAdminEmails } from "@/lib/adminAuth"
import { createAdminClient } from "@/lib/supabase/admin"
import AdminNav from "@/components/AdminNav"

export const dynamic = "force-dynamic"

type ViewRow = {
  path: string
  session_id: string | null
  referrer: string | null
  country: string | null
  created_at: string
}

function dayKey(value: string) {
  return new Date(value).toISOString().slice(0, 10)
}

function referrerLabel(referrer: string | null): string {
  if (!referrer) return "Direct / none"
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "")
    return host || "Direct / none"
  } catch {
    return referrer.slice(0, 60)
  }
}

export default async function AdminAnalyticsPage() {
  const admin = await getAdminUser()
  const adminEmails = getAdminEmails()

  if (adminEmails.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F9FC] px-6 text-[#0D2B45]">
        <div className="max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold">Admin not configured</h1>
          <p className="mt-3 text-gray-600">
            Set the <code className="rounded bg-gray-100 px-1.5 py-0.5">ADMIN_EMAILS</code> environment variable
            (comma-separated) to the owner email(s), then reload this page.
          </p>
          <Link href="/" className="mt-6 inline-block rounded-lg bg-[#1E4D8C] px-5 py-2.5 font-bold text-white">
            Back home
          </Link>
        </div>
      </main>
    )
  }

  if (!admin) {
    redirect(`/login?next=${encodeURIComponent("/admin/analytics")}`)
  }

  const supabase = createAdminClient()

  // Pull the last 30 days of views (bounded) and aggregate in memory.
  const since = new Date()
  since.setDate(since.getDate() - 30)
  since.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from("page_views")
    .select("path, session_id, referrer, country, created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(20000)

  const rows = (data || []) as ViewRow[]

  // Today boundaries.
  const startToday = new Date()
  startToday.setHours(0, 0, 0, 0)
  const start7 = new Date()
  start7.setDate(start7.getDate() - 6)
  start7.setHours(0, 0, 0, 0)

  const totalViews = rows.length
  const viewsToday = rows.filter((r) => new Date(r.created_at) >= startToday).length
  const uniqueVisitors = new Set(rows.map((r) => r.session_id || "anon")).size
  const uniqueToday = new Set(
    rows.filter((r) => new Date(r.created_at) >= startToday).map((r) => r.session_id || "anon"),
  ).size

  // Views per day for the last 7 days (chronological).
  const dayCounts = new Map<string, number>()
  for (let i = 0; i < 7; i++) {
    const d = new Date(start7)
    d.setDate(start7.getDate() + i)
    dayCounts.set(d.toISOString().slice(0, 10), 0)
  }
  for (const r of rows) {
    const k = dayKey(r.created_at)
    if (dayCounts.has(k)) dayCounts.set(k, (dayCounts.get(k) || 0) + 1)
  }
  const dailySeries = Array.from(dayCounts.entries())
  const maxDaily = Math.max(1, ...dailySeries.map(([, c]) => c))

  // Top pages.
  const pageCounts = new Map<string, number>()
  for (const r of rows) pageCounts.set(r.path, (pageCounts.get(r.path) || 0) + 1)
  const topPages = Array.from(pageCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // Top referrers.
  const refCounts = new Map<string, number>()
  for (const r of rows) {
    const label = referrerLabel(r.referrer)
    refCounts.set(label, (refCounts.get(label) || 0) + 1)
  }
  const topReferrers = Array.from(refCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <AdminNav email={admin.email} />

      <section className="bg-[#061A2E] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="font-bold text-[#1E4D8C]">Owner Tools</p>
          <h1 className="mt-2 text-3xl font-extrabold">Traffic &amp; Views</h1>
          <p className="mt-2 text-white/80">Page views over the last 30 days</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Views today" value={`${viewsToday}`} />
            <StatCard label="Unique visitors today" value={`${uniqueToday}`} />
            <StatCard label="Views (30 days)" value={`${totalViews}`} />
            <StatCard label="Unique visitors (30 days)" value={`${uniqueVisitors}`} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load analytics: {error.message}. Make sure the{" "}
            <code className="rounded bg-red-100 px-1.5 py-0.5">page_views</code> table exists.
          </div>
        ) : totalViews === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-lg font-bold">No views recorded yet.</p>
            <p className="mt-2 text-gray-600">
              Views are recorded as visitors browse the public site. Check back after some traffic comes in.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Views · last 7 days</h2>
              <div className="mt-6 flex items-end justify-between gap-3">
                {dailySeries.map(([day, count]) => (
                  <div key={day} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-bold text-[#0D2B45]">{count}</span>
                    <div
                      className="w-full rounded-t-md bg-[#1E4D8C]"
                      style={{ height: `${Math.max(4, (count / maxDaily) * 160)}px` }}
                      aria-hidden="true"
                    />
                    <span className="text-[10px] text-gray-500">
                      {new Date(day).toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">Top pages</h2>
                <table className="mt-4 w-full text-left text-sm">
                  <thead className="border-b text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="py-2">Path</th>
                      <th className="py-2 text-right">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPages.map(([path, count]) => (
                      <tr key={path} className="border-b last:border-0">
                        <td className="py-2.5 pr-4 font-medium">{path}</td>
                        <td className="py-2.5 text-right font-bold">{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">Top referrers</h2>
                <table className="mt-4 w-full text-left text-sm">
                  <thead className="border-b text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="py-2">Source</th>
                      <th className="py-2 text-right">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topReferrers.map(([label, count]) => (
                      <tr key={label} className="border-b last:border-0">
                        <td className="py-2.5 pr-4 font-medium">{label}</td>
                        <td className="py-2.5 text-right font-bold">{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-6">
      <p className="text-3xl font-extrabold text-[#1E4D8C]">{value}</p>
      <p className="mt-1 text-sm text-white/80">{label}</p>
    </div>
  )
}
