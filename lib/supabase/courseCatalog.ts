import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"

export type Lang = "en" | "es"

export type CourseSummary = {
  id: string
  slug: string
  category: string | null
  courseType: string | null
  isFree: boolean
  priceCents: number | null
  estimatedMinutes: number | null
  passingScore: number | null
  thumbnailPath: string | null
  title: string
  shortDescription: string
  lessonCount: number
}

export type LessonSummary = {
  id: string
  lessonKey: string
  lessonType: string | null
  isPreview: boolean
  title: string
  summary: string
  questionCount: number
}

export type SectionSummary = {
  id: string
  sectionKey: string
  title: string
  lessons: LessonSummary[]
}

export type CourseDetail = CourseSummary & {
  sections: SectionSummary[]
}

export type QuizChoice = { key: string; text: string }
export type QuizQuestion = {
  id: string
  order: number
  text: string
  explanation: string
  correctKey: string
  choices: QuizChoice[]
}
export type LessonQuiz = {
  course: {
    id: string
    slug: string
    isFree: boolean
    passingScore: number | null
    title: string
  }
  lesson: {
    id: string
    lessonKey: string
    isPreview: boolean
    title: string
    summary: string
  }
  questions: QuizQuestion[]
}

/** Pick the row matching `lang`, falling back to English, then any. */
function pick<T extends { language_code: string }>(rows: T[] | undefined, lang: Lang): T | undefined {
  if (!rows || rows.length === 0) return undefined
  return (
    rows.find((r) => r.language_code === lang) ||
    rows.find((r) => r.language_code === "en") ||
    rows[0]
  )
}

function groupBy<T, K extends string>(rows: T[], keyFn: (row: T) => K): Record<K, T[]> {
  const out = {} as Record<K, T[]>
  for (const row of rows) {
    const k = keyFn(row)
    ;(out[k] ||= []).push(row)
  }
  return out
}

/** All published courses with translated title/description and lesson counts. */
export async function getPublishedCourses(lang: Lang): Promise<CourseSummary[]> {
  const db = createAdminClient()

  const { data: courses, error } = await db
    .from("courses")
    .select(
      "id,slug,category,course_type,is_free,price_cents,estimated_minutes,passing_score,thumbnail_path,sort_order",
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[v0] getPublishedCourses error:", error.message)
    return []
  }
  if (!courses || courses.length === 0) return []

  const courseIds = courses.map((c) => c.id)

  const [{ data: translations }, { data: sections }] = await Promise.all([
    db
      .from("course_translations")
      .select("course_id,language_code,title,short_description")
      .in("course_id", courseIds),
    db.from("sections").select("id,course_id").in("course_id", courseIds),
  ])

  const sectionIds = (sections || []).map((s) => s.id)
  const { data: lessons } = sectionIds.length
    ? await db.from("lessons").select("id,section_id").in("section_id", sectionIds)
    : { data: [] as { id: string; section_id: string }[] }

  const sectionToCourse = new Map((sections || []).map((s) => [s.id, s.course_id]))
  const lessonCountByCourse = new Map<string, number>()
  for (const lesson of lessons || []) {
    const courseId = sectionToCourse.get(lesson.section_id)
    if (!courseId) continue
    lessonCountByCourse.set(courseId, (lessonCountByCourse.get(courseId) || 0) + 1)
  }

  const translationsByCourse = groupBy(translations || [], (t) => t.course_id as string)

  return courses.map((c) => {
    const t = pick(translationsByCourse[c.id], lang)
    return {
      id: c.id,
      slug: c.slug,
      category: c.category,
      courseType: c.course_type,
      isFree: !!c.is_free,
      priceCents: c.price_cents,
      estimatedMinutes: c.estimated_minutes,
      passingScore: c.passing_score,
      thumbnailPath: c.thumbnail_path,
      title: t?.title || c.slug,
      shortDescription: t?.short_description || "",
      lessonCount: lessonCountByCourse.get(c.id) || 0,
    }
  })
}

/** A single published course with its sections and lessons. */
export async function getCourseDetail(slug: string, lang: Lang): Promise<CourseDetail | null> {
  const db = createAdminClient()

  const { data: course, error } = await db
    .from("courses")
    .select(
      "id,slug,category,course_type,is_free,price_cents,estimated_minutes,passing_score,thumbnail_path",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error) console.error("[v0] getCourseDetail error:", error.message)
  if (!course) return null

  const [{ data: courseTranslations }, { data: sections }] = await Promise.all([
    db
      .from("course_translations")
      .select("course_id,language_code,title,short_description")
      .eq("course_id", course.id),
    db
      .from("sections")
      .select("id,section_key,sort_order")
      .eq("course_id", course.id)
      .order("sort_order", { ascending: true }),
  ])

  const sectionIds = (sections || []).map((s) => s.id)

  const [{ data: sectionTranslations }, { data: lessons }] = await Promise.all([
    sectionIds.length
      ? db
          .from("section_translations")
          .select("section_id,language_code,title")
          .in("section_id", sectionIds)
      : Promise.resolve({ data: [] as any[] }),
    sectionIds.length
      ? db
          .from("lessons")
          .select("id,section_id,lesson_key,lesson_type,is_preview,sort_order")
          .in("section_id", sectionIds)
          .order("sort_order", { ascending: true })
      : Promise.resolve({ data: [] as any[] }),
  ])

  const lessonIds = (lessons || []).map((l) => l.id)

  const [{ data: lessonTranslations }, { data: questions }] = await Promise.all([
    lessonIds.length
      ? db
          .from("lesson_translations")
          .select("lesson_id,language_code,title,summary")
          .in("lesson_id", lessonIds)
      : Promise.resolve({ data: [] as any[] }),
    lessonIds.length
      ? db.from("questions").select("lesson_id").in("lesson_id", lessonIds)
      : Promise.resolve({ data: [] as any[] }),
  ])

  const questionCountByLesson = new Map<string, number>()
  for (const q of questions || []) {
    questionCountByLesson.set(q.lesson_id, (questionCountByLesson.get(q.lesson_id) || 0) + 1)
  }

  const sectionTransBySection = groupBy(sectionTranslations || [], (t) => t.section_id as string)
  const lessonTransByLesson = groupBy(lessonTranslations || [], (t) => t.lesson_id as string)
  const lessonsBySection = groupBy(lessons || [], (l) => l.section_id as string)

  const courseT = pick(courseTranslations || [], lang)

  const sectionSummaries: SectionSummary[] = (sections || []).map((s) => {
    const st = pick(sectionTransBySection[s.id], lang)
    const sectionLessons: LessonSummary[] = (lessonsBySection[s.id] || []).map((l) => {
      const lt = pick(lessonTransByLesson[l.id], lang)
      return {
        id: l.id,
        lessonKey: l.lesson_key,
        lessonType: l.lesson_type,
        isPreview: !!l.is_preview,
        title: lt?.title || l.lesson_key,
        summary: lt?.summary || "",
        questionCount: questionCountByLesson.get(l.id) || 0,
      }
    })
    return {
      id: s.id,
      sectionKey: s.section_key,
      title: st?.title || s.section_key,
      lessons: sectionLessons,
    }
  })

  return {
    id: course.id,
    slug: course.slug,
    category: course.category,
    courseType: course.course_type,
    isFree: !!course.is_free,
    priceCents: course.price_cents,
    estimatedMinutes: course.estimated_minutes,
    passingScore: course.passing_score,
    thumbnailPath: course.thumbnail_path,
    title: courseT?.title || course.slug,
    shortDescription: courseT?.short_description || "",
    lessonCount: (lessons || []).length,
    sections: sectionSummaries,
  }
}

/** A single lesson's interactive quiz: questions, choices, and answers. */
export async function getLessonQuiz(
  slug: string,
  lessonKey: string,
  lang: Lang,
): Promise<LessonQuiz | null> {
  const db = createAdminClient()

  const { data: course } = await db
    .from("courses")
    .select("id,slug,is_free,passing_score")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  if (!course) return null

  const { data: sections } = await db.from("sections").select("id").eq("course_id", course.id)
  const sectionIds = (sections || []).map((s) => s.id)
  if (sectionIds.length === 0) return null

  const { data: lesson } = await db
    .from("lessons")
    .select("id,lesson_key,is_preview")
    .in("section_id", sectionIds)
    .eq("lesson_key", lessonKey)
    .maybeSingle()
  if (!lesson) return null

  const [{ data: courseTranslations }, { data: lessonTranslations }, { data: questions }] =
    await Promise.all([
      db
        .from("course_translations")
        .select("language_code,title")
        .eq("course_id", course.id),
      db
        .from("lesson_translations")
        .select("language_code,title,summary")
        .eq("lesson_id", lesson.id),
      db
        .from("questions")
        .select("id,correct_answer_key,sort_order")
        .eq("lesson_id", lesson.id)
        .order("sort_order", { ascending: true }),
    ])

  const questionIds = (questions || []).map((q) => q.id)

  const [{ data: questionTranslations }, { data: choices }] = await Promise.all([
    questionIds.length
      ? db
          .from("question_translations")
          .select("question_id,language_code,question_text,explanation")
          .in("question_id", questionIds)
      : Promise.resolve({ data: [] as any[] }),
    questionIds.length
      ? db
          .from("answer_choices")
          .select("id,question_id,answer_key,sort_order")
          .in("question_id", questionIds)
          .order("sort_order", { ascending: true })
      : Promise.resolve({ data: [] as any[] }),
  ])

  const choiceIds = (choices || []).map((c) => c.id)
  const { data: choiceTranslations } = choiceIds.length
    ? await db
        .from("choice_translations")
        .select("answer_choice_id,language_code,answer_text")
        .in("answer_choice_id", choiceIds)
    : { data: [] as any[] }

  const qTransByQuestion = groupBy(questionTranslations || [], (t) => t.question_id as string)
  const choicesByQuestion = groupBy(choices || [], (c) => c.question_id as string)
  const choiceTransByChoice = groupBy(choiceTranslations || [], (t) => t.answer_choice_id as string)

  const quizQuestions: QuizQuestion[] = (questions || []).map((q, index) => {
    const qt = pick(qTransByQuestion[q.id], lang)
    const quizChoices: QuizChoice[] = (choicesByQuestion[q.id] || []).map((c) => {
      const ct = pick(choiceTransByChoice[c.id], lang)
      return { key: c.answer_key, text: ct?.answer_text || c.answer_key }
    })
    return {
      id: q.id,
      order: index + 1,
      text: qt?.question_text || "",
      explanation: qt?.explanation || "",
      correctKey: q.correct_answer_key,
      choices: quizChoices,
    }
  })

  const courseT = pick(courseTranslations || [], lang)
  const lessonT = pick(lessonTranslations || [], lang)

  return {
    course: {
      id: course.id,
      slug: course.slug,
      isFree: !!course.is_free,
      passingScore: course.passing_score,
      title: courseT?.title || course.slug,
    },
    lesson: {
      id: lesson.id,
      lessonKey: lesson.lesson_key,
      isPreview: !!lesson.is_preview,
      title: lessonT?.title || lesson.lesson_key,
      summary: lessonT?.summary || "",
    },
    questions: quizQuestions,
  }
}
