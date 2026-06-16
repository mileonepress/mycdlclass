import { createClient } from './server'

// Types
export type Course = {
  id: string
  slug: string
  title: string
  spanish_title: string
  description: string
  icon: string | null
  is_free: boolean
  sort_order: number
  is_published: boolean
}

export type Lesson = {
  id: string
  course_id: string
  slug: string
  title: string
  spanish_title: string | null
  content: string | null
  spanish_content: string | null
  video_url: string | null
  sort_order: number
}

export type Question = {
  id: string
  course_id: string
  question_text: string
  spanish_question_text: string | null
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  spanish_option_a: string | null
  spanish_option_b: string | null
  spanish_option_c: string | null
  spanish_option_d: string | null
  correct_answer: 'A' | 'B' | 'C' | 'D'
  explanation: string | null
  spanish_explanation: string | null
  sort_order: number
}

export type UserProgress = {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at: string | null
}

export type QuizAttempt = {
  id: string
  user_id: string
  course_id: string
  score: number
  total_questions: number
  percentage: number
  passed: boolean
  completed_at: string
}

// Get all published courses
export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('sort_order')
  
  if (error) throw error
  return data || []
}

// Get single course by slug
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  
  if (error) return null
  return data
}

// Get lessons for a course
export async function getLessons(courseId: string): Promise<Lesson[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .eq('is_published', true)
    .order('sort_order')
  
  if (error) throw error
  return data || []
}

// Get single lesson
export async function getLesson(courseId: string, lessonSlug: string): Promise<Lesson | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .eq('slug', lessonSlug)
    .eq('is_published', true)
    .single()
  
  if (error) return null
  return data
}

// Get questions for a course
export async function getQuestions(courseId: string): Promise<Question[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('course_id', courseId)
    .eq('is_published', true)
    .order('sort_order')
  
  if (error) throw error
  return data || []
}

// Get user progress for a course
export async function getUserProgress(userId: string, lessonIds: string[]): Promise<UserProgress[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds)
  
  if (error) throw error
  return data || []
}

// Mark lesson as complete
export async function markLessonComplete(userId: string, lessonId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,lesson_id'
    })
  
  if (error) throw error
}

// Save quiz attempt
export async function saveQuizAttempt(
  userId: string,
  courseId: string,
  score: number,
  totalQuestions: number
): Promise<QuizAttempt> {
  const percentage = Math.round((score / totalQuestions) * 100)
  const passed = percentage >= 80

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_quiz_attempts')
    .insert({
      user_id: userId,
      course_id: courseId,
      score,
      total_questions: totalQuestions,
      percentage,
      passed,
      completed_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get user's best quiz score for a course
export async function getBestQuizScore(userId: string, courseId: string): Promise<QuizAttempt | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .order('percentage', { ascending: false })
    .limit(1)
    .single()
  
  if (error) return null
  return data
}
