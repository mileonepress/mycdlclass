import SeoCoursePage from "@/components/seo/SeoCoursePage"
import { COURSE_SLUGS, getCourse } from "@/lib/seoCourseData"

const SITE_URL = "https://www.mycdlclass.com"

export function generateStaticParams() {
  return COURSE_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const course = getCourse(slug, "en")
  if (!course) return {}

  return {
    title: course.title,
    description: course.metaDescription,
    keywords: [course.primaryKeyword],
    alternates: {
      canonical: `${SITE_URL}/courses/${slug}`,
      languages: {
        "en-US": `${SITE_URL}/courses/${slug}`,
        "es-US": `${SITE_URL}/es/cursos/${slug}`,
        "x-default": `${SITE_URL}/courses/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/courses/${slug}`,
      title: course.title,
      description: course.metaDescription,
    },
  }
}

export default async function CourseLandingPage({ params }) {
  const { slug } = await params
  return <SeoCoursePage slug={slug} lang="en" />
}
