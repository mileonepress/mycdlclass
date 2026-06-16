import type { Metadata } from "next"

// Centralized SEO config so titles, descriptions, and keywords stay
// consistent across the whole site and app.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mycdlclass.com"
).replace(/\/$/, "")

export const SITE_NAME = "MyCDLClass"

// Highest-ROI target keywords woven across the site.
export const PRIMARY_KEYWORDS = [
  "CDL practice test",
  "CDL permit test",
  "CDL general knowledge practice test",
  "air brakes practice test",
  "combination vehicles practice test",
  "hazmat practice test",
  "Class A CDL training",
  "online CDL training",
  "CDL pre trip inspection",
  "Georgia CDL practice test",
]

const DEFAULT_OG_IMAGE = {
  url: "/logo.png",
  width: 1200,
  height: 630,
  alt: "MyCDLClass online CDL training and practice tests",
}

// Per-course SEO keyword sets for dynamic course and quiz pages.
export const COURSE_KEYWORDS: Record<string, string[]> = {
  "general-knowledge": [
    "CDL general knowledge practice test",
    "CDL permit test",
    "CDL general knowledge test",
  ],
  "air-brakes": ["air brakes practice test", "CDL air brakes test"],
  "combination-vehicles": [
    "combination vehicles practice test",
    "CDL combination test",
  ],
  "doubles-triples": ["doubles triples practice test", "CDL doubles triples test"],
  tanker: ["tanker practice test", "CDL tanker endorsement test"],
  hazmat: ["hazmat practice test", "CDL hazmat endorsement test"],
  passenger: ["passenger practice test", "CDL passenger endorsement test"],
  "school-bus": ["school bus practice test", "CDL school bus endorsement test"],
  "pre-trip-inspection": [
    "CDL pre trip inspection",
    "CDL pre trip inspection practice test",
  ],
}

type BuildMetadataInput = {
  title: string
  description: string
  path?: string
  keywords?: string[]
  /** Set false on pages that should not be indexed (dashboards, account, admin). */
  index?: boolean
}

// Helper that produces fully-formed, canonicalized metadata for a page.
export function buildMetadata({
  title,
  description,
  path = "/",
  keywords,
  index = true,
}: BuildMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`
  const mergedKeywords = Array.from(
    new Set([...(keywords ?? []), ...PRIMARY_KEYWORDS])
  )

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: { canonical: url },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [DEFAULT_OG_IMAGE],
      locale: "en_US",
      alternateLocale: ["es_US"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  }
}
