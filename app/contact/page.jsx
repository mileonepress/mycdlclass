import ContactForm from "./ContactForm"
import SiteHeader from "@/components/SiteHeader"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Contact Us",
  description:
    "Contact the MyCDLClass support team for help with your CDL study guide ebook, interactive course access, or account.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-[#061A2E] px-6 pb-16 pt-12 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-extrabold">Contact Us</h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-white/85">
            Questions about your study guide download, interactive course access, or account? Send us
            a message and our support team will get back to you by email as soon as we can.
          </p>
          <p className="mt-6 text-pretty text-base text-white/85">
            Prefer email? Reach us directly at{" "}
            <a href="mailto:info@mycdlclass.com" className="font-semibold text-[#1E4D8C] hover:underline">
              info@mycdlclass.com
            </a>
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
