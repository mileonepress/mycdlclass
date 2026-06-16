import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"
import { COURSE_PRODUCTS } from "@/lib/courseProducts"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/free-practice-test`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/courses`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/ebooks`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly" as const, priority: 0.5 },
  ].map((route) => ({ ...route, lastModified: now }))

  const courseSlugs = Object.keys(COURSE_PRODUCTS)
  const courseRoutes: MetadataRoute.Sitemap = courseSlugs.flatMap((slug) => [
    {
      url: `${SITE_URL}/courses/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/courses/${slug}/quiz`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ])

  return [...staticRoutes, ...courseRoutes]
}
