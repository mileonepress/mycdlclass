export type Lang = "en" | "es"

export const PREVIEW_QUESTION_COUNT = 3

export interface CourseSummary {
  id: string
  slug: string
  category: string | null
  courseType: string | null
  thumbnailPath: string | null
  isFree: boolean
  priceCents: number
  estimatedMinutes: number | null
  passingScore: number
  sortOrder: number
  title: string
  shortDescription: string | null
  questionCount: number
  examCount: number
}

export interface CourseDetail extends CourseSummary {
  seoTitle: string | null
  seoDescription: string | null
  sections: SectionDetail[]
  practiceTests: PracticeTestSummary[]
}

export interface SectionDetail {
  id: string
  sectionKey: string | null
  sortOrder: number
  title: string
  description: string | null
  lessons: LessonSummary[]
}

export interface LessonSummary {
  id: string
  lessonKey: string | null
  lessonType: string | null
  sortOrder: number
  estimatedMinutes: number | null
  isPreview: boolean
  title: string
  summary: string | null
}

export interface PracticeTestSummary {
  id: string
  testKey: string | null
  testType: string | null
  questionCount: number | null
  passingScore: number
  timeLimitMinutes: number | null
}

export interface QuizChoice {
  id: string
  answerKey: string
  sortOrder: number
  text: string
}

export interface QuizQuestion {
  id: string
  questionKey: string | null
  questionType: string | null
  difficulty: string | null
  sortOrder: number
  text: string
  explanation: string | null
  studyReference: string | null
  correctAnswerKey: string
  choices: QuizChoice[]
}
