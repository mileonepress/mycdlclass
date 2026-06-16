import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, score, totalQuestions } = await request.json();

    if (!courseId || score === undefined || !totalQuestions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 80;

    const { data, error } = await supabase
      .from("user_quiz_attempts")
      .insert({
        user_id: user.id,
        course_id: courseId,
        score,
        total_questions: totalQuestions,
        percentage,
        passed,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving quiz attempt:", error);
      return NextResponse.json({ error: "Failed to save quiz attempt" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
