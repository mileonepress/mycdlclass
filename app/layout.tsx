import './globals.css'
import type { Metadata, Viewport } from 'next'
import { SITE_URL, SITE_NAME, PRIMARY_KEYWORDS } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CDL Practice Test & Online CDL Training | MyCDLClass',
    template: '%s | MyCDLClass',
  },
  description:
    'Free CDL practice tests and online CDL training in English & Spanish. Prepare for your CDL permit test with general knowledge, air brakes, combination vehicles, hazmat, and pre-trip inspection practice tests. Class A CDL training that works on any device.',
  keywords: PRIMARY_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'education',
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: 'CDL Practice Test & Online CDL Training | MyCDLClass',
    description:
      'Free bilingual CDL practice tests and online CDL training. Pass your CDL permit test the first time with realistic general knowledge, air brakes, combination vehicles, hazmat, and pre-trip inspection practice tests.',
    url: SITE_URL,
    locale: 'en_US',
    alternateLocale: ['es_US'],
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'MyCDLClass online CDL training and practice tests',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CDL Practice Test & Online CDL Training | MyCDLClass',
    description:
      'Free bilingual CDL practice tests and online CDL training. Pass your CDL permit test the first time.',
    images: ['/logo.png'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#061A2E',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: 'My CDL Class',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    'Online CDL training and bilingual (English & Spanish) CDL practice tests covering general knowledge, air brakes, combination vehicles, hazmat, and pre-trip inspection.',
  knowsLanguage: ['en', 'es'],
  areaServed: 'US',
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: ['en', 'es'],
  publisher: { '@id': `${SITE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/courses?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
