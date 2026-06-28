import './globals.css'
import type { Metadata, Viewport } from 'next'

const SITE_URL = 'https://www.mycdlclass.com'
const PARENT_URL = 'https://www.mileonepress.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'My CDL Class by MileOne Press | Bilingual CDL Prep Ebooks (PDF)',
    template: '%s | MyCDLClass by MileOne Press',
  },
  description:
    'MyCDLClass, a MileOne Press brand, sells downloadable bilingual CDL test prep ebooks in English and Spanish. Instant PDF delivery after a simple one-time purchase — no account required. Study on PC, Mac, Android, and Apple devices.',
  applicationName: 'MyCDLClass',
  keywords: [
    'CDL test prep',
    'CDL practice',
    'CDL prep ebooks',
    'CDL study guide',
    'bilingual CDL prep',
    'Spanish CDL prep',
    'commercial driver license',
    'MyCDLClass',
    'MileOne Press',
    'mileonepress',
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
    title: 'MyCDLClass by MileOne Press | Bilingual CDL Prep Ebooks',
    description:
      'CDL test prep ebooks in English and Spanish from MileOne Press. Instant PDF delivery, no account required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyCDLClass by MileOne Press | Bilingual CDL Prep Ebooks',
    description:
      'CDL test prep ebooks in English and Spanish from MileOne Press. Instant PDF delivery, no account required.',
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
    'MyCDLClass is the CDL test prep brand of MileOne Press, offering bilingual CDL prep ebooks in English and Spanish.',
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
  description: 'Bilingual CDL test prep ebooks in English and Spanish from MileOne Press.',
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
    <html lang="en" className="bg-background">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
