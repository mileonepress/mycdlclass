import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/lib/adminAuth"
import { listEbookProducts } from "@/lib/ebookProducts"
import AdminNav from "@/components/AdminNav"
import { GrantEbookForm } from "@/components/admin/GrantAccessForms"

export const dynamic = "force-dynamic"

export default async function AdminAccessPage() {
  await createClient()
  const admin = await getAdminUser()
  if (!admin) redirect("/")

  const ebooks = listEbookProducts().map((e: { slug: string; title: string; languageLabel: string }) => ({
    slug: e.slug,
    label: `${e.title} (${e.languageLabel})`,
  }))

  return (
    <>
      <AdminNav email={admin.email} />
      <main className="min-h-screen bg-[#F1F5F9] px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16A34A]">Admin Portal</p>
          <h1 className="mt-1 text-3xl font-bold text-[#0D2B45]">Issue an Ebook by Email</h1>
          <p className="mt-1 text-gray-600">
            Manually send an ebook download link to a customer.
          </p>

          <div className="mt-8">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#0D2B45]">Issue an ebook</h2>
              <p className="mb-4 mt-1 text-sm text-gray-500">
                Sends a secure, private download link to the recipient&apos;s email.
              </p>
              <GrantEbookForm ebooks={ebooks} />
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
