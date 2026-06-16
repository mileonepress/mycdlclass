import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/lib/adminAuth"
import { createAdminClient } from "@/lib/supabase/admin"
import AdminNav from "@/components/AdminNav"
import { CreateCourseForm, EditCourseRow } from "@/components/admin/CourseForms"

export const dynamic = "force-dynamic"

type Course = {
  id: string
  slug: string
  title: string
  spanish_title: string | null
  description: string | null
  icon: string | null
  is_free: boolean
  is_published: boolean
  sort_order: number
}

export default async function AdminCoursesPage() {
  await createClient()
  const admin = await getAdminUser()
  if (!admin) redirect("/courses")

  const db = createAdminClient()
  const { data: courses } = await db
    .from("courses")
    .select("id, slug, title, spanish_title, description, icon, is_free, is_published, sort_order")
    .order("sort_order", { ascending: true })

  // Count lessons + questions per course so admins can see what's interactive.
  const { data: lessonRows } = await db.from("lessons").select("course_id")
  const { data: questionRows } = await db.from("questions").select("course_id")

  const lessonCounts = new Map<string, number>()
  for (const r of lessonRows || []) {
    lessonCounts.set(r.course_id, (lessonCounts.get(r.course_id) || 0) + 1)
  }
  const questionCounts = new Map<string, number>()
  for (const r of questionRows || []) {
    questionCounts.set(r.course_id, (questionCounts.get(r.course_id) || 0) + 1)
  }

  return (
    <>
      <AdminNav email={admin.email} />
      <main className="min-h-screen bg-[#F1F5F9] px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#16A34A]">Admin Portal</p>
              <h1 className="mt-1 text-3xl font-bold text-[#0D2B45]">Courses</h1>
              <p className="mt-1 text-gray-600">
                View and edit all interactive courses. Each course includes lessons and an
                interactive practice test.
              </p>
            </div>
            <CreateCourseForm />
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {(courses as Course[] | null)?.map((course) => (
              <div key={course.id}>
                <EditCourseRow course={course} />
                <div className="mt-1 flex gap-4 px-4 text-xs text-gray-500">
                  <span>{lessonCounts.get(course.id) || 0} lessons</span>
                  <span>{questionCounts.get(course.id) || 0} quiz questions</span>
                  <Link href={`/courses/${course.slug}/quiz`} className="font-semibold text-[#1E4D8C] hover:underline">
                    Open interactive test
                  </Link>
                </div>
              </div>
            ))}
            {(!courses || courses.length === 0) && (
              <p className="rounded-xl bg-white p-6 text-gray-500 shadow-sm">No courses yet.</p>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
