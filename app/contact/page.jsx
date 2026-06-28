import ContactForm from "./ContactForm"
import SiteHeader from "@/components/SiteHeader"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Contact Us | MyCDLClass",
  description: "Get in touch with the MyCDLClass team for help with your CDL prep ebook order or download.",
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
            Questions about an ebook order or your PDF download? Send us a message and we&apos;ll get
            back to you by email as soon as we can.
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
