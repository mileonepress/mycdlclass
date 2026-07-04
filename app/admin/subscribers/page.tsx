import Link from "next/link"
import { redirect } from "next/navigation"
import { getAdminUser, getAdminEmails } from "@/lib/adminAuth"
import { createAdminClient } from "@/lib/supabase/admin"
import AdminNav from "@/components/AdminNav"

export const dynamic = "force-dynamic"

type SubscriberRow = {
  id: string
  email: string
  first_name: string | null
  language: string | null
  kit_subscriber_id: string | null
  created_at: string
}

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

export default async function AdminSubscribersPage() {
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
    redirect(`/login?next=${encodeURIComponent("/admin/subscribers")}`)
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("email_subscribers")
    .select("id, email, first_name, language, kit_subscriber_id, created_at")
    .order("created_at", { ascending: false })
    .limit(5000)

  const subscribers = (data || []) as SubscriberRow[]
  const startToday = new Date()
  startToday.setHours(0, 0, 0, 0)
  const newToday = subscribers.filter((s) => new Date(s.created_at) >= startToday).length
  const english = subscribers.filter((s) => s.language === "en").length
  const spanish = subscribers.filter((s) => s.language === "es").length

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <AdminNav email={admin.email} />

      <section className="bg-[#061A2E] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="font-bold text-[#16A34A]">Owner Tools</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="mt-2 text-3xl font-extrabold">Subscribers</h1>
              <p className="mt-2 text-white/80">Newsletter &amp; ebook update list</p>
            </div>
            <a
              href="/api/admin/export?type=subscribers"
              className="rounded-lg bg-[#16A34A] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#15803D]"
            >
              Export CSV
            </a>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total subscribers" value={`${subscribers.length}`} />
            <StatCard label="New today" value={`${newToday}`} />
            <StatCard label="English" value={`${english}`} />
            <StatCard label="Spanish" value={`${spanish}`} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-4 text-xl font-bold">All subscribers</h2>
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load subscribers: {error.message}
          </div>
        ) : subscribers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-lg font-bold">No subscribers yet.</p>
            <p className="mt-2 text-gray-600">Newsletter signups from the site will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-[#F6F9FC] text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">First name</th>
                  <th className="px-4 py-3">Lang</th>
                  <th className="px-4 py-3">Kit synced</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-[#F6F9FC]">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDate(s.created_at)}</td>
                    <td className="px-4 py-3 font-medium">{s.email}</td>
                    <td className="px-4 py-3">{s.first_name || "—"}</td>
                    <td className="px-4 py-3 uppercase">{s.language || "—"}</td>
                    <td className="px-4 py-3">
                      {s.kit_subscriber_id ? (
                        <span className="rounded-full bg-[#E7F7ED] px-2.5 py-1 text-xs font-bold text-[#16A34A]">
                          Synced
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
                          Local only
                        </span>
                      )}
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
