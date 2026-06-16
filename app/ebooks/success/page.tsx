import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe"
import { recordAndDeliverEbook } from "@/lib/ebookDelivery"
import { getEbookProduct } from "@/lib/ebookProducts"

export const metadata = {
  title: "Purchase Complete | MyCDLClass Ebooks",
}

export default async function EbookSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  if (!session_id) {
    redirect("/ebooks")
  }

  let title = "your ebook"
  let downloadUrl: string | null = null
  let payerEmail: string | null = null

  // Verify the session with Stripe (can't be spoofed) and deliver as a fallback
  // for any webhook latency, then surface an immediate download link.
  try {
    const session: Stripe.Checkout.Session =
      await getStripe().checkout.sessions.retrieve(session_id)

    if (session.payment_status === "paid" && session.metadata?.kind === "ebook") {
      const product = getEbookProduct(session.metadata.ebook_slug || "")
      if (product) title = `${product.title} (${product.languageLabel})`
      payerEmail =
        session.customer_details?.email || session.customer_email || null

      const result = await recordAndDeliverEbook(session)
      if (result.ok && result.token) {
        downloadUrl = `/api/ebooks/download?token=${encodeURIComponent(result.token)}`
      }
    }
  } catch (err) {
    console.error("[v0] ebook success: verify failed:", err)
  }

  return (
    <main className="min-h-screen bg-[#F6F9FC]">
      <nav className="bg-[#061A2E] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="MyCDLClass" width={58} height={58} />
            <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
          </Link>
        </div>
      </nav>

      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-8 rounded-full bg-[#16A34A] p-6">
          <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-extrabold text-[#0D2B45]">Thank you for your purchase!</h1>
        <p className="mt-4 max-w-xl text-lg text-gray-600">
          We&apos;ve emailed a secure download link for <span className="font-semibold">{title}</span>
          {payerEmail ? (
            <>
              {" "}
              to <span className="font-semibold">{payerEmail}</span>
            </>
          ) : null}
          . You can also download it right now below.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          {downloadUrl ? (
            <a
              href={downloadUrl}
              className="rounded-xl bg-[#16A34A] px-8 py-4 font-bold text-white transition-colors hover:bg-[#15803d]"
            >
              Download your PDF
            </a>
          ) : (
            <p className="max-w-md rounded-xl bg-white px-6 py-4 text-sm text-gray-600 shadow">
              Your download link is on its way to your email. If you don&apos;t see it within a few
              minutes, check your spam folder.
            </p>
          )}
          <Link
            href="/ebooks"
            className="rounded-xl bg-[#1E4D8C] px-8 py-4 font-bold text-white transition-colors hover:bg-[#163d6e]"
          >
            Browse More Ebooks
          </Link>
        </div>

        <p className="mt-8 max-w-md text-xs text-gray-400">
          Keep your confirmation email — your download link lets you re-download the PDF anytime. You
          will also receive a Stripe receipt by email.
        </p>
      </section>
    </main>
  )
}
