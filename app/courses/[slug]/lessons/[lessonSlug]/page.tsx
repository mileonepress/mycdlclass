import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourseBySlug, getLessons, getLesson, getUserProgress } from "@/lib/supabase/queries";
import { canAccessCourse, isPaidCourse } from "@/lib/access";
import LessonContent from "./LessonContent";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const course = await getCourseBySlug(slug);
  if (!course) redirect("/courses");

  // Gate lesson content: paid courses require a logged-in buyer.
  if (isPaidCourse(slug)) {
    if (!user) {
      redirect(`/login?next=${encodeURIComponent(`/courses/${slug}`)}`);
    }
    const allowed = await canAccessCourse(slug, user.id);
    if (!allowed) {
      redirect(`/courses/${slug}`);
    }
  }

  const lessons = await getLessons(course.id);
  const lesson = await getLesson(course.id, lessonSlug);
  if (!lesson) redirect(`/courses/${slug}`);

  const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  let isCompleted = false;
  if (user) {
    const progress = await getUserProgress(user.id, [lesson.id]);
    isCompleted = progress.some((p) => p.completed);
  }

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
          <Link href="/courses" className="rounded-lg bg-[#16A34A] px-4 py-2 font-bold">
            Browse Courses
          </Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-[#061A2E] px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-sm text-gray-400">
            <Link href="/courses" className="hover:text-white">Courses</Link>
            <span className="mx-2">/</span>
            <Link href={`/courses/${slug}`} className="hover:text-white">{course.title}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{lesson.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Lesson Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span className="text-sm text-[#1E4D8C] font-medium">
                Lesson {currentIndex + 1} of {lessons.length}
              </span>
              <h1 className="text-3xl font-extrabold text-[#0D2B45] mt-2">{lesson.title}</h1>
              {lesson.spanish_title && (
                <p className="text-lg text-[#16A34A] mt-1">{lesson.spanish_title}</p>
              )}
            </div>
            {isCompleted && (
              <div className="bg-[#16A34A] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Completed
              </div>
            )}
          </div>

          {/* Video (if exists) */}
          {lesson.video_url && (
            <div className="aspect-video bg-gray-900 rounded-xl mb-8 flex items-center justify-center">
              <iframe
                src={lesson.video_url}
                className="w-full h-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Lesson Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-[#F6F9FC] rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-[#0D2B45] mb-3">English</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{lesson.content}</p>
            </div>
            
            {lesson.spanish_content && (
              <div className="bg-[#E6F0FF] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#1E4D8C] mb-3">Español</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{lesson.spanish_content}</p>
              </div>
            )}
          </div>
        </div>

        {/* Mark Complete & Navigation */}
        <LessonContent
          lessonId={lesson.id}
          courseSlug={slug}
          isCompleted={isCompleted}
          isLoggedIn={!!user}
          prevLesson={prevLesson ? { slug: prevLesson.slug, title: prevLesson.title } : null}
          nextLesson={nextLesson ? { slug: nextLesson.slug, title: nextLesson.title } : null}
          totalLessons={lessons.length}
          currentIndex={currentIndex}
        />
      </div>
    </main>
  );
}
