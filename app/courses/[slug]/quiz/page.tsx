import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourseBySlug, getQuestions } from "@/lib/supabase/queries";
import QuizClient from "./QuizClient";
import { buildMetadata, COURSE_KEYWORDS } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return buildMetadata({
      title: "CDL Practice Test",
      description: "Take a free CDL practice test online with instant scoring.",
      path: `/courses/${slug}/quiz`,
    });
  }

  return buildMetadata({
    title: `${course.title} Practice Test (Free, English & Español)`,
    description: `Free ${course.title} CDL practice test with real exam-style questions, instant scoring, and answer explanations in English and Spanish. Get ready for your CDL permit test.`,
    path: `/courses/${slug}/quiz`,
    keywords: COURSE_KEYWORDS[slug] ?? [],
  });
}

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const initialLanguage = lang === "es" ? "es" : "en";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const course = await getCourseBySlug(slug);
  if (!course) redirect("/courses");

  const questions = await getQuestions(course.id);

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-[#F6F9FC]">
        <nav className="sticky top-0 z-50 bg-[#061A2E] text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="MyCDLClass" width={58} height={58} />
              <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
            </Link>
          </div>
        </nav>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-[#0D2B45]">No Questions Yet</h1>
          <p className="mt-4 text-gray-600">Practice questions for this course are coming soon.</p>
          <Link href={`/courses/${slug}`} className="mt-8 inline-block bg-[#1E4D8C] text-white px-6 py-3 rounded-lg font-bold">
            Back to Course
          </Link>
        </div>
      </main>
    );
  }

  // Prepare questions for client (don't send correct answers initially)
  const clientQuestions = questions.map((q) => ({
    id: q.id,
    question_text: q.question_text,
    spanish_question_text: q.spanish_question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    spanish_option_a: q.spanish_option_a,
    spanish_option_b: q.spanish_option_b,
    spanish_option_c: q.spanish_option_c,
    spanish_option_d: q.spanish_option_d,
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    spanish_explanation: q.spanish_explanation,
  }));

  return (
    <QuizClient
      course={course}
      questions={clientQuestions}
      isLoggedIn={!!user}
      initialLanguage={initialLanguage}
    />
  );
}
