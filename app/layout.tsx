import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import ViewTracker from '@/components/ViewTracker'

const GA_MEASUREMENT_ID = 'G-WDPDQQ21PP'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = 'https://www.mycdlclass.com'
const PARENT_URL = 'https://www.mileonepress.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MyCDLClass | Bilingual CDL Test Prep — Study Guides & Interactive Courses',
    template: '%s | MyCDLClass by MileOne Press',
  },
  description:
    'MyCDLClass, a MileOne Press brand, helps you pass your CDL exam the first time with bilingual English and Spanish test prep in two formats: downloadable study guide ebooks and interactive online courses with instant answer explanations and progress tracking. Just $14.99 per study guide.',
  applicationName: 'MyCDLClass',
  keywords: [
    'CDL test prep',
    'CDL practice test',
    'CDL study guide',
    'CDL training course',
    'interactive CDL course',
    'CDL prep ebook',
    'bilingual CDL prep',
    'Spanish CDL prep',
    'commercial driver license',
    'CDL exam questions',
    'MyCDLClass',
    'MileOne Press',
  ],
  authors: [{ name: 'MileOne Press', url: PARENT_URL }],
  creator: 'MileOne Press',
  publisher: 'MileOne Press',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'MyCDLClass by MileOne Press',
    title: 'MyCDLClass | Bilingual CDL Test Prep — Study Guides & Interactive Courses',
    description:
      'Pass your CDL exam with bilingual English and Spanish test prep from MileOne Press — downloadable study guide ebooks and interactive online courses.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyCDLClass | Bilingual CDL Test Prep — Study Guides & Interactive Courses',
    description:
      'Pass your CDL exam with bilingual English and Spanish test prep from MileOne Press — study guide ebooks and interactive online courses.',
  },
}

// Structured data connecting the MyCDLClass and MileOne Press brands so search
// engines treat them as the same CDL test prep publisher.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'MyCDLClass',
  alternateName: ['My CDL Class', 'MileOne Press', 'MileOne Press CDL'],
  url: SITE_URL,
  description:
    'MyCDLClass is the CDL test prep brand of MileOne Press, offering bilingual CDL study guides in English and Spanish as downloadable ebooks and interactive online courses.',
  brand: {
    '@type': 'Brand',
    name: 'MileOne Press',
    url: PARENT_URL,
  },
  parentOrganization: {
    '@type': 'Organization',
    name: 'MileOne Press',
    url: PARENT_URL,
    sameAs: [PARENT_URL],
  },
  sameAs: [PARENT_URL],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'MyCDLClass by MileOne Press',
  description:
    'Bilingual CDL test prep in English and Spanish from MileOne Press — study guide ebooks and interactive online courses.',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: ['en', 'es'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#061A2E',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`bg-background ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ViewTracker />
        {children}
        {/* Google Analytics (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
