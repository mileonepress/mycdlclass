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
  if (!admin) redirect("/dashboard")

  // Use the service-role client for aggregate stats across all users.
  const db = createAdminClient()
  const today = startOfToday()

  const [ebookCount, ebookToday, recentEbooks] = await Promise.all([
    db.from("ebook_purchases").select("id", { count: "exact", head: true }).eq("status", "completed"),
    db.from("ebook_purchases").select("amount").eq("status", "completed").gte("created_at", today),
    db
      .from("ebook_purchases")
      .select("ebook_slug, language, payer_email, amount, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ])

  const revenueToday = (ebookToday.data || []).reduce(
    (sum: number, p: { amount: number | null }) => sum + (Number(p.amount) || 0),
    0,
  )

  const stats = [
    { label: "Ebook sales", value: ebookCount.count ?? 0, href: "/admin/purchases" },
    { label: "Sales today", value: (ebookToday.data || []).length, href: "/admin/purchases" },
  ]

  return (
    <>
      <AdminNav email={admin.email} />
      <main className="min-h-screen bg-[#F1F5F9] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16A34A]">Admin Portal</p>
          <h1 className="mt-1 text-3xl font-bold text-[#0D2B45]">Overview</h1>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  href="/admin/purchases"
                  className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-[#1E4D8C]"
                >
                  <p className="font-bold text-[#0D2B45]">View ebook purchases</p>
                  <p className="text-sm text-gray-500">Review all completed ebook sales and revenue.</p>
                </Link>
                <Link
                  href="/admin/access"
                  className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-[#1E4D8C]"
                >
                  <p className="font-bold text-[#0D2B45]">Issue an ebook by email</p>
                  <p className="text-sm text-gray-500">Send a secure download link to a customer.</p>
                </Link>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#0D2B45]">Latest ebook sales</h2>
              <div className="mt-4 flex flex-col gap-2">
                {(recentEbooks.data || []).length === 0 ? (
                  <p className="text-sm text-gray-500">No ebook purchases yet.</p>
                ) : (
                  (recentEbooks.data || []).map(
                    (
                      e: {
                        ebook_slug: string
                        language: string
                        payer_email: string | null
                        created_at: string
                      },
                      i: number,
                    ) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5"
                      >
                        <span className="text-sm text-[#0D2B45]">
                          {e.ebook_slug}{" "}
                          <span className="uppercase text-gray-400">({e.language})</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {e.payer_email || new Date(e.created_at).toLocaleDateString()}
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
