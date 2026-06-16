"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  lessonId: string;
  courseSlug: string;
  isCompleted: boolean;
  isLoggedIn: boolean;
  prevLesson: { slug: string; title: string } | null;
  nextLesson: { slug: string; title: string } | null;
  totalLessons: number;
  currentIndex: number;
};

export default function LessonContent({
  lessonId,
  courseSlug,
  isCompleted,
  isLoggedIn,
  prevLesson,
  nextLesson,
  totalLessons,
  currentIndex,
}: Props) {
  const router = useRouter();
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);

  async function handleMarkComplete() {
    if (!isLoggedIn || completed) return;
    setLoading(true);

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });

      if (response.ok) {
        setCompleted(true);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to mark complete:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Mark Complete Button */}
      {isLoggedIn && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <button
            onClick={handleMarkComplete}
            disabled={completed || loading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${
              completed
                ? "bg-[#16A34A] text-white cursor-default"
                : loading
                ? "bg-gray-200 text-gray-500 cursor-wait"
                : "bg-[#1E4D8C] text-white hover:bg-[#163d6e]"
            }`}
          >
            {completed ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Lesson Completed
              </>
            ) : loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              "Mark as Complete"
            )}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          {prevLesson ? (
            <Link
              href={`/courses/${courseSlug}/lessons/${prevLesson.slug}`}
              className="flex items-center gap-2 text-[#1E4D8C] hover:underline"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href={`/courses/${courseSlug}`}
            className="text-sm text-gray-600 hover:text-[#1E4D8C]"
          >
            Back to Course
          </Link>

          {nextLesson ? (
            <Link
              href={`/courses/${courseSlug}/lessons/${nextLesson.slug}`}
              className="flex items-center gap-2 text-[#1E4D8C] hover:underline"
            >
              <span className="hidden sm:inline">Next</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : currentIndex === totalLessons - 1 ? (
            <Link
              href={`/courses/${courseSlug}/quiz`}
              className="flex items-center gap-2 bg-[#16A34A] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#15803d] transition"
            >
              Take Quiz
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
