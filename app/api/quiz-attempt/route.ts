import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Save a completed quiz attempt for the current user.
 * Body: { courseId, score, totalQuestions, passed }
 */
export async function POST(request: Request) {
  try {
    const { courseId, score, totalQuestions, passed } = await request.json()

    if (!courseId || typeof score !== "number" || typeof totalQuestions !== "number") {
      return NextResponse.json({ error: "bad_request" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "auth_required" }, { status: 401 })
    }

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

    const { error } = await supabase.from("course_quiz_attempts").insert({
      user_id: user.id,
      course_id: courseId,
      score,
      total_questions: totalQuestions,
      percentage,
      passed: !!passed,
      completed_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] quiz-attempt insert error:", error.message)
      return NextResponse.json({ error: "save_failed" }, { status: 500 })
    }

    return NextResponse.json({ ok: true, percentage })
  } catch (err) {
    console.error("[v0] quiz-attempt route error:", err)
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
}
