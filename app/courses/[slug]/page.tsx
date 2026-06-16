import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourseBySlug, getLessons, getQuestions, getUserProgress, getBestQuizScore } from "@/lib/supabase/queries";
import { getCourseProduct } from "@/lib/courseProducts";
import { canAccessCourse, isPaidCourse } from "@/lib/access";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang: langParam } = await searchParams;
  const lang = langParam === "es" ? "es" : "en";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const course = await getCourseBySlug(slug);
  
  if (!course) {
    redirect("/courses");
  }

  // Lessons are gated for paid courses; the quiz/practice test stays open.
  const paid = isPaidCourse(slug);
  const canAccess = await canAccessCourse(slug, user?.id ?? null);
  const product = getCourseProduct(slug);
  const lessons = await getLessons(course.id);
  const questions = await getQuestions(course.id);
  
  let progress: { lessonId: string; completed: boolean }[] = [];
  let bestScore = null;
  
  if (user) {
    const lessonIds = lessons.map(l => l.id);
    if (lessonIds.length > 0) {
      const userProgress = await getUserProgress(user.id, lessonIds);
      progress = userProgress.map(p => ({ lessonId: p.lesson_id, completed: p.completed }));
    }
    bestScore = await getBestQuizScore(user.id, course.id);
  }

  const completedCount = progress.filter(p => p.completed).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#F6F9FC]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#061A2E] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="MyCDLClass" width={58} height={58} />
            <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
          </Link>
          <div className="hidden gap-6 text-sm md:flex">
            <Link href="/courses">Courses</Link>
            <Link href="/free-practice-test">Free Test</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/courses/${slug}${lang === "es" ? "" : "?lang=es"}`}
              className="rounded-lg border border-white/30 px-3 py-2 text-sm font-bold"
            >
              {lang === "es" ? "English" : "Español"}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#061A2E] px-6 py-16 text-white">
        <div className="max-w-4xl mx-auto">
          <Link href="/courses" className="text-[#16A34A] text-sm hover:underline mb-4 inline-block">
            {lang === "es" ? "← Volver a Todos los Cursos" : "← Back to All Courses"}
          </Link>
          <h1 className="text-4xl font-extrabold">
            {lang === "es" ? course.spanish_title : course.title}
          </h1>
          <p className="text-xl text-[#16A34A] mt-2">
            {lang === "es" ? course.title : course.spanish_title}
          </p>
          <p className="mt-4 text-lg text-gray-300">{course.description}</p>
          
          <div className="flex flex-wrap gap-4 mt-6">
            {product && (
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-[#16A34A]">
                ${product.price} {lang === "es" ? "· Pago único" : "· One-time"}
              </span>
            )}
            <span className="px-4 py-2 rounded-full text-sm font-bold bg-white/10">
              {lessons.length} {lang === "es" ? "Lecciones" : "Lessons"}
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-bold bg-white/10">
              {questions.length} {lang === "es" ? "Preguntas de Práctica" : "Practice Questions"}
            </span>
          </div>
        </div>
      </section>

      {/* Purchase Card */}
      {product && paid && !canAccess && (
        <section className="bg-white border-b border-gray-200 px-6 py-8">
          <div className="max-w-4xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-2xl font-extrabold text-[#0D2B45]">
                {lang === "es"
                  ? `Compra el curso de ${course.spanish_title}`
                  : `Get the ${course.title} Course`}
              </p>
              <p className="mt-1 text-gray-600">
                {lang === "es"
                  ? "Acceso completo a lecciones, exámenes de práctica y explicaciones."
                  : "Full access to lessons, practice tests, and explanations."}
              </p>
              <p className="mt-2 text-3xl font-extrabold text-[#16A34A]">${product.price}</p>
            </div>
            <div className="w-full max-w-sm">
              <StripeCheckoutButton slug={slug} lang={lang} price={product.price} />
            </div>
          </div>
        </section>
      )}

      {/* Owned banner */}
      {paid && canAccess && (
        <section className="bg-[#16A34A] px-6 py-4 text-white">
          <div className="mx-auto flex max-w-4xl items-center gap-3">
            <svg className="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-bold">
              {lang === "es"
                ? "Tienes acceso completo a este curso."
                : "You have full access to this course."}
            </p>
          </div>
        </section>
      )}

      <div className="max-w-4xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Card */}
          {user && canAccess && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#0D2B45] mb-4">Your Progress</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="font-bold text-[#0D2B45]">{progressPercent}%</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {completedCount} of {lessons.length} lessons completed
              </p>
            </div>
          )}

          {/* Lessons List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0D2B45] mb-6">Course Lessons</h2>
            {lessons.length === 0 ? (
              <p className="text-gray-500">Lessons coming soon...</p>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, index) => {
                  const isCompleted = progress.find(p => p.lessonId === lesson.id)?.completed;
                  const rowClasses = `flex items-center gap-4 p-4 rounded-xl border transition ${
                    canAccess
                      ? 'border-gray-200 hover:border-[#1E4D8C] hover:bg-[#F6F9FC]'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                  }`;
                  const inner = (
                    <>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        isCompleted ? 'bg-[#16A34A]' : canAccess ? 'bg-[#1E4D8C]' : 'bg-gray-400'
                      }`}>
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#0D2B45]">{lesson.title}</h3>
                        {lesson.spanish_title && (
                          <p className="text-sm text-[#16A34A]">{lesson.spanish_title}</p>
                        )}
                      </div>
                      {!canAccess && (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </>
                  );
                  return canAccess ? (
                    <Link
                      key={lesson.id}
                      href={`/courses/${slug}/lessons/${lesson.slug}`}
                      className={rowClasses}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div key={lesson.id} className={rowClasses} aria-disabled="true">
                      {inner}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Practice Test Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#0D2B45] mb-2">Practice Test</h3>
            <p className="text-sm text-gray-600 mb-4">
              {questions.length} questions to help you prepare for the real exam.
            </p>
            {bestScore && (
              <div className="mb-4 p-3 bg-[#E6F0FF] rounded-lg">
                <p className="text-sm text-[#1E4D8C]">
                  Best Score: <span className="font-bold">{bestScore.percentage}%</span>
                  {bestScore.passed && <span className="ml-2 text-[#16A34A]">Passed!</span>}
                </p>
              </div>
            )}
            <Link
              href={`/courses/${slug}/quiz`}
              className="block text-center py-3 rounded-lg font-bold transition bg-[#1E4D8C] text-white hover:bg-[#163d6e]"
            >
              Start Practice Test
            </Link>
          </div>

          {/* Course Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#0D2B45] mb-4">What You&apos;ll Learn</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Real CDL exam questions
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Detailed explanations
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Bilingual content (EN/ES)
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Track your progress
              </li>
            </ul>
          </div>

          {/* Need Help */}
          {!user && (
            <div className="bg-[#E6F0FF] rounded-2xl p-6">
              <h3 className="font-bold text-[#0D2B45] mb-2">Create an Account</h3>
              <p className="text-sm text-gray-600 mb-4">Sign up to track your progress and save your scores.</p>
              <Link
                href="/login"
                className="block text-center bg-[#1E4D8C] text-white py-3 rounded-lg font-bold hover:bg-[#163d6e] transition"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
