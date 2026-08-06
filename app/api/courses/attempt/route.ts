import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

/**
 * Records a scored practice-exam attempt. Requires a signed-in user who owns
 * the course. Score fields are recomputed/clamped server-side; the client
 * cannot record an attempt for a course it has not purchased.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const courseId = String(body.courseId ?? "")
    const totalQuestions = Number(body.totalQuestions)
    const score = Number(body.score)

    if (!courseId || !Number.isFinite(totalQuestions) || totalQuestions <= 0) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "auth_required" }, { status: 401 })
    }

    const admin = createAdminClient()

    // Must own the course to record an attempt.
    const { data: ent } = await admin
      .from("course_entitlements")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle()
    if (!ent) {
      return NextResponse.json({ error: "not_entitled" }, { status: 403 })
    }

    // Clamp values server-side.
    const safeScore = Math.max(0, Math.min(Math.round(score), Math.round(totalQuestions)))
    const percentage = Math.round((safeScore / totalQuestions) * 100)

    const { data: course } = await admin
      .from("courses")
      .select("passing_score")
      .eq("id", courseId)
      .single()
    const passingScore = course?.passing_score ?? 80
    const passed = percentage >= passingScore

    const { error } = await admin.from("course_quiz_attempts").insert({
      user_id: user.id,
      course_id: courseId,
      score: safeScore,
      total_questions: Math.round(totalQuestions),
      percentage,
      passed,
    })
    if (error) {
      console.error("[v0] record attempt error:", error.message)
      return NextResponse.json({ error: "save_failed" }, { status: 500 })
    }

    return NextResponse.json({ ok: true, percentage, passed })
  } catch (err) {
    console.error("[v0] attempt route error:", err)
    return NextResponse.json({ error: "unexpected" }, { status: 500 })
  }
}
