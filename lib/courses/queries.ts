import "server-only"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  type CourseDetail,
  type CourseSummary,
  type Lang,
  type QuizQuestion,
  type SectionDetail,
  PREVIEW_QUESTION_COUNT,
} from "./types"

function pickTranslation(rows: any[] | null | undefined, lang: Lang): any | undefined {
  if (!rows || rows.length === 0) return undefined
  return rows.find((r) => r.language_code === lang) ?? rows.find((r) => r.language_code === "en") ?? rows[0]
}

/**
 * Public catalog listing. Uses the anon server client (RLS: published courses
 * are world-readable). Question counts come from a lightweight aggregate.
 */
export async function getCourseCatalog(lang: Lang = "en"): Promise<CourseSummary[]> {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      `id, slug, category, course_type, thumbnail_path, is_free, price_cents,
       estimated_minutes, passing_score, sort_order,
       course_translations ( language_code, title, short_description )`,
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[v0] getCourseCatalog error:", error.message)
    return []
  }

  // Counts via the admin client (questions table has no public read policy).
  // NOTE: A single bulk `select("course_id")` is capped at 1000 rows by PostgREST,
  // which silently undercounts the ~1,086 seeded questions. Exact per-course head
  // counts sidestep the cap entirely and stay correct as the catalog grows.
  const admin = createAdminClient()
  const rows = courses ?? []
  const counts = await Promise.all(
    rows.map(async (c: any) => {
      const [{ count: qCount }, { count: eCount }] = await Promise.all([
        admin.from("questions").select("id", { count: "exact", head: true }).eq("course_id", c.id),
        admin
          .from("practice_tests")
          .select("id", { count: "exact", head: true })
          .eq("course_id", c.id)
          .eq("status", "published"),
      ])
      return { id: c.id, questionCount: qCount ?? 0, examCount: eCount ?? 0 }
    }),
  )
  const countById = Object.fromEntries(counts.map((r) => [r.id, r]))

  return rows.map((c: any) => {
    const t = pickTranslation(c.course_translations, lang)
    return {
      id: c.id,
      slug: c.slug,
      category: c.category,
      courseType: c.course_type,
      thumbnailPath: c.thumbnail_path,
      isFree: c.is_free,
      priceCents: c.price_cents,
      estimatedMinutes: c.estimated_minutes,
      passingScore: c.passing_score ?? 80,
      sortOrder: c.sort_order ?? 0,
      title: t?.title ?? c.slug,
      shortDescription: t?.short_description ?? null,
      questionCount: countById[c.id]?.questionCount ?? 0,
      examCount: countById[c.id]?.examCount ?? 0,
    }
  })
}

export async function getCourseBySlug(slug: string, lang: Lang = "en"): Promise<CourseDetail | null> {
  const supabase = await createClient()

  const { data: course, error } = await supabase
    .from("courses")
    .select(
      `id, slug, category, course_type, thumbnail_path, is_free, price_cents,
       estimated_minutes, passing_score, sort_order,
       course_translations ( language_code, title, short_description, seo_title, seo_description ),
       sections (
         id, section_key, sort_order, status,
         section_translations ( language_code, title, description ),
         lessons (
           id, lesson_key, lesson_type, sort_order, estimated_minutes, is_preview, status,
           lesson_translations ( language_code, title, summary )
         )
       ),
       practice_tests ( id, test_key, test_type, question_count, passing_score, time_limit_minutes, status )`,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error || !course) {
    if (error) console.error("[v0] getCourseBySlug error:", error.message)
    return null
  }

  const c: any = course
  const t = pickTranslation(c.course_translations, lang)

  const sections: SectionDetail[] = (c.sections ?? [])
    .filter((s: any) => s.status === "published")
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((s: any) => {
      const st = pickTranslation(s.section_translations, lang)
      return {
        id: s.id,
        sectionKey: s.section_key,
        sortOrder: s.sort_order ?? 0,
        title: st?.title ?? s.section_key ?? "Section",
        description: st?.description ?? null,
        lessons: (s.lessons ?? [])
          .filter((l: any) => l.status === "published")
          .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((l: any) => {
            const lt = pickTranslation(l.lesson_translations, lang)
            return {
              id: l.id,
              lessonKey: l.lesson_key,
              lessonType: l.lesson_type,
              sortOrder: l.sort_order ?? 0,
              estimatedMinutes: l.estimated_minutes,
              isPreview: l.is_preview ?? false,
              title: lt?.title ?? l.lesson_key ?? "Lesson",
              summary: lt?.summary ?? null,
            }
          }),
      }
    })

  const admin = createAdminClient()
  const [{ count: questionCount }, { count: examCount }] = await Promise.all([
    admin.from("questions").select("id", { count: "exact", head: true }).eq("course_id", c.id),
    admin.from("practice_tests").select("id", { count: "exact", head: true }).eq("course_id", c.id).eq("status", "published"),
  ])

  return {
    id: c.id,
    slug: c.slug,
    category: c.category,
    courseType: c.course_type,
    thumbnailPath: c.thumbnail_path,
    isFree: c.is_free,
    priceCents: c.price_cents,
    estimatedMinutes: c.estimated_minutes,
    passingScore: c.passing_score ?? 80,
    sortOrder: c.sort_order ?? 0,
    title: t?.title ?? c.slug,
    shortDescription: t?.short_description ?? null,
    seoTitle: t?.seo_title ?? null,
    seoDescription: t?.seo_description ?? null,
    questionCount: questionCount ?? 0,
    examCount: examCount ?? 0,
    sections,
    practiceTests: (c.practice_tests ?? [])
      .filter((p: any) => p.status === "published")
      .map((p: any) => ({
        id: p.id,
        testKey: p.test_key,
        testType: p.test_type,
        questionCount: p.question_count,
        passingScore: p.passing_score ?? 80,
        timeLimitMinutes: p.time_limit_minutes,
      })),
  }
}

/** Does this user own this course? Reads the entitlements table server-side. */
export async function hasEntitlement(userId: string | null, courseId: string): Promise<boolean> {
  if (!userId) return false
  const admin = createAdminClient()
  const { data } = await admin
    .from("course_entitlements")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle()
  return Boolean(data)
}

/**
 * Loads full question content for a course. ALWAYS runs through the service-role
 * client because the questions/answer_choices tables have no public read policy.
 * The caller is responsible for gating: pass `preview: true` to get only the
 * first N questions (the free taste), otherwise a valid entitlement is required.
 */
async function loadQuestions(courseId: string, lang: Lang, limit?: number): Promise<QuizQuestion[]> {
  const admin = createAdminClient()

  let query = admin
    .from("questions")
    .select(
      `id, question_key, question_type, difficulty, correct_answer_key, sort_order,
       question_translations ( language_code, question_text, explanation, study_reference ),
       answer_choices (
         id, answer_key, sort_order,
         choice_translations ( language_code, answer_text )
       )`,
    )
    .eq("course_id", courseId)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("question_key", { ascending: true })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) {
    console.error("[v0] loadQuestions error:", error.message)
    return []
  }

  return (data ?? []).map((q: any) => {
    const qt = pickTranslation(q.question_translations, lang)
    return {
      id: q.id,
      questionKey: q.question_key,
      questionType: q.question_type,
      difficulty: q.difficulty,
      sortOrder: q.sort_order ?? 0,
      text: qt?.question_text ?? "",
      explanation: qt?.explanation ?? null,
      studyReference: qt?.study_reference ?? null,
      correctAnswerKey: q.correct_answer_key,
      choices: (q.answer_choices ?? [])
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((ch: any) => {
          const ct = pickTranslation(ch.choice_translations, lang)
          return {
            id: ch.id,
            answerKey: ch.answer_key,
            sortOrder: ch.sort_order ?? 0,
            text: ct?.answer_text ?? "",
          }
        }),
    }
  })
}

/** The free 3-question preview for a course. Available to anyone. */
export async function getPreviewQuestions(courseId: string, lang: Lang = "en"): Promise<QuizQuestion[]> {
  return loadQuestions(courseId, lang, PREVIEW_QUESTION_COUNT)
}

/**
 * Full question set, gated by entitlement. Returns null when the user has not
 * purchased the course, so the caller can redirect to checkout.
 */
export async function getFullQuestions(
  userId: string | null,
  courseId: string,
  lang: Lang = "en",
): Promise<QuizQuestion[] | null> {
  const owns = await hasEntitlement(userId, courseId)
  if (!owns) return null
  return loadQuestions(courseId, lang)
}

/** Set of course ids the user owns — for dashboards / badges. */
export async function getOwnedCourseIds(userId: string | null): Promise<Set<string>> {
  if (!userId) return new Set()
  const admin = createAdminClient()
  const { data } = await admin.from("course_entitlements").select("course_id").eq("user_id", userId)
  return new Set((data ?? []).map((r: any) => r.course_id))
}

export interface CourseAttemptSummary {
  courseId: string
  courseSlug: string
  courseTitle: string
  bestPercentage: number
  attempts: number
  lastAttemptAt: string | null
}

/**
 * Per-owned-course progress summary for the dashboard: best score, attempt
 * count, and most recent attempt. Combines catalog + attempts server-side.
 */
export async function getUserCourseProgress(
  userId: string,
  lang: Lang = "en",
): Promise<CourseAttemptSummary[]> {
  const admin = createAdminClient()
  const catalog = await getCourseCatalog(lang)
  const ownedIds = await getOwnedCourseIds(userId)
  const owned = catalog.filter((c) => ownedIds.has(c.id))

  const { data: attempts } = await admin
    .from("course_quiz_attempts")
    .select("course_id, percentage, completed_at")
    .eq("user_id", userId)

  const byCourse: Record<string, { best: number; count: number; last: string | null }> = {}
  for (const a of attempts ?? []) {
    const rec = byCourse[a.course_id] ?? { best: 0, count: 0, last: null }
    rec.best = Math.max(rec.best, a.percentage ?? 0)
    rec.count += 1
    if (!rec.last || (a.completed_at && a.completed_at > rec.last)) rec.last = a.completed_at
    byCourse[a.course_id] = rec
  }

  return owned.map((c) => ({
    courseId: c.id,
    courseSlug: c.slug,
    courseTitle: c.title,
    bestPercentage: byCourse[c.id]?.best ?? 0,
    attempts: byCourse[c.id]?.count ?? 0,
    lastAttemptAt: byCourse[c.id]?.last ?? null,
  }))
}
