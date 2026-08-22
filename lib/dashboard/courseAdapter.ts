import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"
import type {
  CatalogTotals,
  ContentStatus,
  CourseFamilyDetail,
  CourseFamilySummary,
  LanguageCode,
  LocalizedCourseOffering,
  TranslationCompleteness,
} from "@/lib/contracts/course-adapter.contract"

/**
 * Course Dashboard Adapter — READ implementation (Checkpoint 2, preview).
 *
 * Reads the LIVE primary Supabase project (aibndllvunylmxborsad) through the
 * service-role client. Every method here is READ-ONLY (SELECT only): the
 * secured dashboard can render the real 9-family / 18-offering catalog in
 * preview WITHOUT changing production. Mutating methods from the contract
 * (updateCourseMeta / upsertTranslation / setCourseStatus) are intentionally
 * NOT implemented in Checkpoint 2 — they require the audited write path that
 * lands with proposed migrations 0001/0003 after production approval.
 */

const LANGS: LanguageCode[] = ["en", "es"]

function normStatus(s: string | null): ContentStatus {
  switch (s) {
    case "draft":
    case "ready_for_review":
    case "published":
    case "archived":
      return s
    default:
      return "draft"
  }
}

export async function listCourseFamilies(): Promise<CourseFamilySummary[]> {
  const db = createAdminClient()

  const { data: courses, error } = await db
    .from("courses")
    .select(
      "id,slug,category,course_type,status,is_free,price_cents,estimated_minutes,sort_order,thumbnail_path",
    )
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[v0] listCourseFamilies error:", error.message)
    return []
  }
  if (!courses?.length) return []

  const ids = courses.map((c) => c.id)

  const [{ data: translations }, { data: sections }, { data: practiceTests }] = await Promise.all([
    db
      .from("course_translations")
      .select("course_id,language_code,title,short_description,seo_title,seo_description")
      .in("course_id", ids),
    db.from("sections").select("id,course_id").in("course_id", ids),
    db.from("practice_tests").select("id,course_id").in("course_id", ids),
  ])

  const sectionIds = (sections ?? []).map((s) => s.id)
  const { data: lessons } = sectionIds.length
    ? await db.from("lessons").select("id,section_id").in("section_id", sectionIds)
    : { data: [] as { id: string; section_id: string }[] }

  const practiceTestIds = (practiceTests ?? []).map((p) => p.id)
  const { data: ptq } = practiceTestIds.length
    ? await db
        .from("practice_test_questions")
        .select("question_id,practice_test_id")
        .in("practice_test_id", practiceTestIds)
    : { data: [] as { question_id: string; practice_test_id: string }[] }

  // Map sections -> course, lessons -> course
  const sectionToCourse = new Map((sections ?? []).map((s) => [s.id, s.course_id]))
  const sectionCountByCourse = new Map<string, number>()
  for (const s of sections ?? [])
    sectionCountByCourse.set(s.course_id, (sectionCountByCourse.get(s.course_id) ?? 0) + 1)

  const lessonCountByCourse = new Map<string, number>()
  for (const l of lessons ?? []) {
    const cid = sectionToCourse.get(l.section_id)
    if (cid) lessonCountByCourse.set(cid, (lessonCountByCourse.get(cid) ?? 0) + 1)
  }

  const ptCountByCourse = new Map<string, number>()
  for (const p of practiceTests ?? [])
    ptCountByCourse.set(p.course_id, (ptCountByCourse.get(p.course_id) ?? 0) + 1)

  // Distinct question count per course (via practice_test_questions)
  const ptToCourse = new Map((practiceTests ?? []).map((p) => [p.id, p.course_id]))
  const questionSetByCourse = new Map<string, Set<string>>()
  for (const row of ptq ?? []) {
    const cid = ptToCourse.get(row.practice_test_id)
    if (!cid) continue
    if (!questionSetByCourse.has(cid)) questionSetByCourse.set(cid, new Set())
    questionSetByCourse.get(cid)!.add(row.question_id)
  }

  const translationsByCourse = new Map<string, typeof translations>()
  for (const t of translations ?? []) {
    if (!translationsByCourse.has(t.course_id)) translationsByCourse.set(t.course_id, [])
    translationsByCourse.get(t.course_id)!.push(t)
  }

  return courses.map((c) => {
    const ts = translationsByCourse.get(c.id) ?? []
    const completeness: TranslationCompleteness[] = LANGS.map((lang) => {
      const t = ts.find((x) => x.language_code === lang)
      const hasTitle = !!t?.title
      const hasShortDescription = !!t?.short_description
      const hasSeo = !!t?.seo_title && !!t?.seo_description
      const present = [hasTitle, hasShortDescription, hasSeo].filter(Boolean).length
      return { language: lang, hasTitle, hasShortDescription, hasSeo, completeness: present / 3 }
    })

    return {
      id: c.id,
      slug: c.slug,
      category: c.category,
      courseType: c.course_type,
      status: normStatus(c.status),
      isFree: c.is_free,
      priceCents: c.price_cents,
      estimatedMinutes: c.estimated_minutes,
      sortOrder: c.sort_order,
      coverPath: c.thumbnail_path,
      offeringCount: ts.filter((t) => t.title).length,
      sectionCount: sectionCountByCourse.get(c.id) ?? 0,
      lessonCount: lessonCountByCourse.get(c.id) ?? 0,
      questionCount: questionSetByCourse.get(c.id)?.size ?? 0,
      practiceTestCount: ptCountByCourse.get(c.id) ?? 0,
      translations: completeness,
      storeProductIds: [],
    }
  })
}

export async function getCatalogTotals(): Promise<CatalogTotals> {
  const families = await listCourseFamilies()
  const byStatus: Record<ContentStatus, number> = {
    draft: 0,
    ready_for_review: 0,
    published: 0,
    archived: 0,
  }
  let offerings = 0
  for (const f of families) {
    byStatus[f.status] += 1
    offerings += f.offeringCount
  }
  return { families: families.length, localizedOfferings: offerings, byStatus }
}

export async function getCourseFamily(id: string): Promise<CourseFamilyDetail | null> {
  const families = await listCourseFamilies()
  const summary = families.find((f) => f.id === id)
  if (!summary) return null

  const db = createAdminClient()
  const { data: translations } = await db
    .from("course_translations")
    .select("course_id,language_code,title,short_description")
    .eq("course_id", id)

  const offerings: LocalizedCourseOffering[] = LANGS.map((lang) => {
    const t = (translations ?? []).find((x) => x.language_code === lang)
    return {
      courseId: id,
      slug: summary.slug,
      language: lang,
      title: t?.title ?? null,
      shortDescription: t?.short_description ?? null,
      status: summary.status,
    }
  })

  let coverAsset = null
  if (summary.coverPath) {
    const { data } = await db.from("media_assets").select("*").eq("storage_path", summary.coverPath).maybeSingle()
    coverAsset = data ?? null
  }

  return { ...summary, offerings, coverAsset }
}
