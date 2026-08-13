import type { MetadataRoute } from "next"
import { COURSE_SLUGS } from "@/lib/seoCourseData"

const SITE_URL = "https://www.mycdlclass.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/ebooks`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/es/cursos`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  // English and Spanish landing pages, each with reciprocal hreflang alternates.
  const coursePages: MetadataRoute.Sitemap = COURSE_SLUGS.flatMap((slug) => {
    const en = `${SITE_URL}/courses/${slug}`
    const es = `${SITE_URL}/es/cursos/${slug}`
    const languages = { "en-US": en, "es-US": es, "x-default": en }

    return [
      { url: en, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8, alternates: { languages } },
      { url: es, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8, alternates: { languages } },
    ]
  })

  return [...staticPages, ...coursePages]
}
