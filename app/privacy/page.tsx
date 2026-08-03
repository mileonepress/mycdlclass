import type { Metadata } from "next"
import Footer from "@/components/Footer"
import SiteHeader from "@/components/SiteHeader"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "The MyCDLClass Privacy Policy explains what information Mile One Press collects through the MyCDLClass website and mobile apps, how we use and share it, and the choices available to users.",
}

const sections = [
  {
    id: "who-we-are",
    heading: "1. Who We Are and Scope",
    body: [
      'Mile One Press ("Mile One Press," "MyCDLClass," "we," "us," or "our") provides online commercial driver license education, study materials, interactive courses, practice tests, and related services through https://www.mycdlclass.com (the "Website") and the MyCDLClass applications for Android and Apple iOS devices (the "Apps"). Together, the Website and Apps are referred to as the "Services."',
      "This policy applies whenever you visit, create an account, purchase or access a course, complete a lesson or practice test, contact us, or otherwise use the Services.",
    ],
  },
  {
    id: "information-we-collect",
    heading: "2. Information We Collect",
    subsections: [
      {
        title: "A. Account and Contact Information",
        list: [
          "Name, email address, username, account identifier, password or authentication credentials, and information you provide when contacting support.",
          "We may also collect language preferences and other profile information you choose to provide.",
        ],
      },
      {
        title: "B. Course Progress and Test Information",
        list: [
          "Courses enrolled in or purchased, lessons viewed or completed, study activity, practice-test questions and answers, scores, attempts, completion status, and related learning progress.",
          "This information is used to deliver the educational experience, save progress across devices, and improve course content.",
        ],
      },
      {
        title: "C. Payment and Purchase Information",
        list: [
          "Purchase history, transaction status, product or course purchased, subscription status, payment date, and transaction identifiers.",
          "Website payments may be processed by Stripe or another disclosed website payment provider. Mobile purchases may be processed through Apple In-App Purchase or Google Play Billing.",
          "We generally do not receive or store full payment-card numbers from Stripe, Apple, or Google. Those providers process payment credentials under their own privacy policies and terms.",
        ],
      },
      {
        title: "D. Device, Analytics, and Crash Information",
        list: [
          "Device type, operating system, app version, browser type, IP address, language, time zone, general region inferred from IP address, device or app identifiers, log data, pages or screens viewed, feature interactions, session dates and times, and referring URLs.",
          "Crash reports, diagnostics, performance data, error logs, and technical information needed to identify and fix problems.",
          "Cookies, local storage, software development kits (SDKs), and similar technologies may be used to keep you signed in, remember preferences, measure use, and maintain security.",
        ],
      },
      {
        title: "E. Information We Do Not Intend to Collect",
        body: [
          "The Services are not designed to collect precise GPS location, contacts, photos, videos, microphone recordings, health information, government identification numbers, or biometric information unless a future feature clearly requests the information and this policy and any required in-app disclosure are updated first.",
        ],
      },
    ],
  },
  {
    id: "how-we-use",
    heading: "3. How We Use Information",
    list: [
      "Create and manage accounts; authenticate users; and provide access to purchased or enrolled courses.",
      "Save course progress, score practice tests, display results, and synchronize learning activity across supported devices.",
      "Process, confirm, and administer purchases, subscriptions, refunds, and access rights.",
      "Operate, maintain, troubleshoot, secure, and improve the Website and Apps.",
      "Respond to support requests, service messages, account questions, and legal or safety concerns.",
      "Analyze usage and performance in aggregated or de-identified form to improve content, navigation, and reliability.",
      "Prevent fraud, abuse, unauthorized access, and violations of our terms.",
      "Comply with legal obligations and enforce our agreements.",
    ],
  },
  {
    id: "how-we-share",
    heading: "4. How We Share Information",
    body: ["We do not sell personal information for money. We may disclose information only as described below:"],
    list: [
      "Service providers: hosting, database, authentication, email, customer support, analytics, crash reporting, security, and other vendors that process information for us under contractual or legal obligations.",
      "Payment platforms: Stripe for applicable Website payments; Apple for iOS in-app purchases; and Google for Android in-app purchases. These providers receive information needed to process transactions and prevent fraud.",
      "Business and legal purposes: professional advisers, regulators, courts, law enforcement, or other parties when reasonably necessary to comply with law, protect rights or safety, investigate fraud, or enforce agreements.",
      "Business transfers: a buyer, successor, or other party involved in a merger, financing, acquisition, reorganization, bankruptcy, or sale of all or part of our business, subject to appropriate protections.",
      "At your direction or with your consent: when you request or authorize a disclosure.",
    ],
    bodyAfter: [
      "Third-party services may collect information directly through their technology. Their handling of information is governed by their own privacy notices. We require integrated providers to protect information consistent with applicable law and the purposes described in this policy.",
    ],
  },
  {
    id: "apple-google",
    heading: "5. Apple and Google Purchases",
    body: [
      "Purchases made through an Apple or Android app are processed by the applicable app-store provider. Apple or Google may collect payment credentials, billing contact information, device information, purchase history, and fraud-prevention data. We may receive a transaction identifier, product purchased, purchase status, subscription status, and other information needed to verify entitlement and provide access. Refunds and billing disputes for in-app purchases may be subject to the app store's rules and procedures.",
    ],
  },
  {
    id: "cookies",
    heading: "6. Cookies, Analytics, and Similar Technologies",
    body: [
      "The Website and Apps may use cookies, local storage, analytics tools, and SDKs for essential functions, security, preferences, performance measurement, and diagnostics. Where required by law, we will request consent before using non-essential technologies. Browser and device controls may allow you to limit cookies or certain identifiers, although disabling essential technologies may affect functionality.",
      "We do not use personal information for cross-app or cross-site behavioral advertising unless we first provide required notice and obtain any consent required by law or platform rules. If this practice changes, we will update this policy and the applicable app-store disclosures.",
    ],
  },
  {
    id: "data-retention",
    heading: "7. Data Retention",
    body: [
      "We retain personal information only for as long as reasonably necessary to provide the Services, maintain your account and course access, complete transactions, comply with tax, accounting, and legal obligations, resolve disputes, prevent fraud, and enforce agreements. Retention periods depend on the type of information and why it was collected.",
    ],
    list: [
      "Account and course-progress information is generally retained while the account remains active and for a reasonable period afterward, unless deletion is requested or longer retention is required by law.",
      "Transaction and purchase records may be retained for the period required for accounting, tax, fraud prevention, and legal compliance.",
      "Analytics, logs, and crash information may be retained for shorter operational periods or stored in aggregated or de-identified form.",
    ],
    bodyAfter: [
      "When information is no longer needed, we delete it, anonymize it, or securely isolate it until deletion is practicable, including from routine backups.",
    ],
  },
  {
    id: "account-deletion",
    heading: "8. Account Deletion and Your Choices",
    body: [
      "You may request access, correction, or deletion of your account and associated personal information by using the account settings available in the Apps or Website, when provided, or by emailing privacy@mycdlclass.com. We may need to verify your identity before completing a request.",
      "Deleting an account will generally delete or de-identify associated profile and course-progress information, subject to limited information we must retain for legal, security, fraud-prevention, payment, or accounting purposes. Deleting the App from a device does not by itself delete your account.",
      "You may also manage certain privacy choices through your browser, mobile operating system, Apple ID, Google account, or app-store settings. Marketing messages, if offered, will include an unsubscribe method; essential service and transaction messages may still be sent.",
    ],
  },
  {
    id: "state-rights",
    heading: "9. U.S. State Privacy Rights",
    body: [
      "Depending on where you live and subject to legal exceptions, you may have rights to know or access personal information, correct inaccurate information, delete information, obtain a portable copy, and opt out of certain targeted advertising, sales, or profiling. We do not discriminate against users for exercising applicable privacy rights. To submit a request, email privacy@mycdlclass.com and describe the request and the state where you reside. An authorized agent may submit a request where permitted by law, subject to verification.",
      "We do not currently sell personal information for monetary consideration. We also do not knowingly share personal information for cross-context behavioral advertising. If our practices change, we will provide legally required notices and opt-out methods.",
    ],
  },
  {
    id: "security",
    heading: "10. Security",
    body: [
      "We use reasonable administrative, technical, and organizational safeguards designed to protect personal information, such as access controls, secure authentication, encrypted transmission where appropriate, vendor management, monitoring, and backups. No internet transmission or storage system can be guaranteed to be completely secure, so users should protect passwords and notify us of suspected unauthorized access.",
    ],
  },
  {
    id: "childrens-privacy",
    heading: "11. Children's Privacy",
    body: [
      "The Services are intended for individuals preparing for commercial driver licensing and are not directed to children under 13. We do not knowingly collect personal information from children under 13. If we learn that such information was collected without appropriate authorization, we will take reasonable steps to delete it. A parent or guardian may contact privacy@mycdlclass.com with a concern.",
      "If the Services are later offered to schools or users under 18, Mile One Press will implement any additional notices, consents, contractual terms, and platform requirements that apply before collecting information in that context.",
    ],
  },
  {
    id: "international",
    heading: "12. International Users",
    body: [
      "Mile One Press is based in the United States. If you access the Services from another country, information may be processed in the United States or other locations where our service providers operate. Where required, we use appropriate safeguards for international transfers and honor applicable privacy rights.",
    ],
  },
  {
    id: "third-party-links",
    heading: "13. Third-Party Links and Services",
    body: [
      "The Services may contain links to third-party websites or services. We are not responsible for the privacy, security, or content practices of third parties that are not acting as our service providers. Review their privacy notices before providing information.",
    ],
  },
  {
    id: "changes",
    heading: "14. Changes to This Privacy Policy",
    body: [
      'We may update this policy to reflect changes in the Services, technology, vendors, laws, or business practices. We will post the revised policy at MyCDLClass.com with a new "Last Updated" date and provide additional notice when required. Continued use after the effective date of an update is subject to the revised policy.',
    ],
  },
]

const contactRows = [
  { label: "Business", value: "Mile One Press / MyCDLClass" },
  { label: "Business Email", value: "info@mycdlclass.com", href: "mailto:info@mycdlclass.com" },
  { label: "Website", value: "https://www.mycdlclass.com", href: "https://www.mycdlclass.com" },
  { label: "Mailing Address", value: "2347 Cove Lake Way, Stonecrest, GA 30058" },
]

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <SiteHeader />

      <section className="bg-[#061A2E] px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#1E4D8C]">Privacy Policy</p>
          <h1 className="mt-2 text-balance text-4xl font-extrabold md:text-5xl">MyCDLClass Privacy Policy</h1>
          <p className="mt-4 text-pretty text-lg text-white/75">Website, Android App, and Apple iOS App</p>
          <p className="mt-4 text-sm text-white/60">Effective Date: August 1, 2026 &nbsp;|&nbsp; Last Updated: August 1, 2026</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-14">
        <div className="rounded-2xl border border-[#1E4D8C]/20 bg-white p-6 shadow-sm md:p-8">
          <p className="leading-relaxed text-gray-600">
            This Privacy Policy applies to MyCDLClass.com and the MyCDLClass mobile applications operated by Mile One
            Press. It explains what information we collect, how we use and share it, and the choices available to users.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[#0D2B45]">{section.heading}</h2>

              {section.body?.map((paragraph, i) => (
                <p key={i} className="mt-4 leading-relaxed text-gray-600">
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul className="mt-4 space-y-3">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex gap-3 leading-relaxed text-gray-600">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E4D8C]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.subsections?.map((sub) => (
                <div key={sub.title} className="mt-6">
                  <h3 className="text-lg font-bold text-[#1E4D8C]">{sub.title}</h3>
                  {sub.body?.map((paragraph, i) => (
                    <p key={i} className="mt-3 leading-relaxed text-gray-600">
                      {paragraph}
                    </p>
                  ))}
                  {sub.list && (
                    <ul className="mt-3 space-y-3">
                      {sub.list.map((item, i) => (
                        <li key={i} className="flex gap-3 leading-relaxed text-gray-600">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E4D8C]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {section.bodyAfter?.map((paragraph, i) => (
                <p key={i} className="mt-4 leading-relaxed text-gray-600">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section id="contact" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#0D2B45]">15. Contact Us</h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              Questions, privacy requests, and account-deletion requests may be submitted to:
            </p>
            <dl className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {contactRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-3 sm:gap-4 ${
                    i !== 0 ? "border-t border-gray-100" : ""
                  }`}
                >
                  <dt className="text-sm font-bold uppercase tracking-wide text-[#0D2B45]">{row.label}</dt>
                  <dd className="text-gray-600 sm:col-span-2">
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.href.startsWith("http") ? "_blank" : undefined}
                        rel={row.href.startsWith("http") ? "noopener" : undefined}
                        className="font-medium text-[#1E4D8C] hover:underline"
                      >
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </article>

      <Footer />
    </main>
  )
}
