import type { MetadataRoute } from "next"

const SITE_URL = "https://www.mycdlclass.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep private, transactional, and post-purchase pages out of the index.
        disallow: [
          "/admin",
          "/account",
          "/api/",
          "/login",
          "/reset-password",
          "/ebooks/success",
          "/training-courses/*/success",
          "/auth/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
