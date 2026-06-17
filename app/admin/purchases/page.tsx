import Link from "next/link"
import { redirect } from "next/navigation"
import { getAdminUser, getAdminEmails } from "@/lib/adminAuth"
import { createAdminClient } from "@/lib/supabase/admin"
import AdminNav from "@/components/AdminNav"

export const dynamic = "force-dynamic"

function formatDate(value: string | null) {
  if (!value) return "—"
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatAmount(amount: number | null, currency: string | null) {
  if (amount == null) return "—"
  const code = (currency || "usd").toUpperCase()
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(amount)
  } catch {
    return `${amount} ${code}`
  }
}

export default async function AdminPurchasesPage() {
  const admin = await getAdminUser()

  // If no admin emails are configured at all, surface a setup hint instead of a silent redirect.
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
    redirect(`/login?next=${encodeURIComponent("/admin/purchases")}`)
  }

  const supabase = createAdminClient()
  const { data: ebookRows, error } = await supabase
    .from("ebook_purchases")
    .select("id, ebook_slug, language, payer_email, amount, currency, status, granted_by, stripe_session_id, created_at")
    .order("created_at", { ascending: false })
    .limit(500)

  const ebooks = ebookRows || []
  const completedEbooks = ebooks.filter((r) => r.status === "completed")
  const totalRevenue = completedEbooks.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <AdminNav email={admin.email} />

      <section className="bg-[#061A2E] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="font-bold text-[#16A34A]">Owner Tools</p>
          <h1 className="mt-2 text-3xl font-extrabold">Purchases</h1>
          <p className="mt-2 text-white/80">Ebook sales</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Ebook Sales" value={`${completedEbooks.length}`} />
            <StatCard label="Total Records" value={`${ebooks.length}`} />
            <StatCard label="Revenue (completed)" value={formatAmount(totalRevenue, "usd")} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-4 text-xl font-bold">Ebook purchases</h2>
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load purchases: {error.message}
          </div>
        ) : ebooks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-lg font-bold">No ebook purchases yet.</p>
            <p className="mt-2 text-gray-600">
              Completed ebook checkouts and admin-issued ebooks will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-[#F6F9FC] text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Ebook</th>
                  <th className="px-4 py-3">Lang</th>
                  <th className="px-4 py-3">Buyer Email</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                </tr>
              </thead>
              <tbody>
                {ebooks.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-[#F6F9FC]">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3 font-medium">{r.ebook_slug}</td>
                    <td className="px-4 py-3 uppercase">{r.language}</td>
                    <td className="px-4 py-3">{r.payer_email || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold">{formatAmount(Number(r.amount), r.currency)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          r.status === "completed"
                            ? "bg-[#E7F7ED] text-[#16A34A]"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {r.status || "unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {r.granted_by ? `Admin (${r.granted_by})` : r.stripe_session_id ? "Stripe" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
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
