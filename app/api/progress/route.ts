import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Mark a lesson complete (or incomplete) for the current user.
 * Body: { lessonId: string, completed?: boolean }
 */
export async function POST(request: Request) {
  try {
    const { lessonId, completed = true } = await request.json()
    if (!lessonId) {
      return NextResponse.json({ error: "missing_lesson" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "auth_required" }, { status: 401 })
    }

    const { error } = await supabase.from("course_lesson_progress").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: !!completed,
        completed_at: completed ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,lesson_id" },
    )

    if (error) {
      console.error("[v0] progress upsert error:", error.message)
      return NextResponse.json({ error: "save_failed" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[v0] progress route error:", err)
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
}
