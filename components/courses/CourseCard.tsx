import Image from "next/image"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { getCourseCover, formatPrice } from "@/lib/courses/presentation"
import type { CourseSummary } from "@/lib/courses/types"

export default function CourseCard({ course, owned = false }: { course: CourseSummary; owned?: boolean }) {
  const cover = getCourseCover(course.slug)

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#F1F5F9] bg-white shadow-[0_12px_38px_rgba(6,21,36,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(6,26,46,0.14)]"
    >
      <div className="relative aspect-[3/4] w-full bg-[#0D2B45]">
        <Image
          src={cover || "/placeholder.svg"}
          alt={`${course.title} interactive CDL course cover`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain"
        />
        {owned ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-[#14a86b] shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Owned
          </span>
        ) : (
          <span className="absolute right-3 top-3 rounded-full bg-[#FEB510] px-3 py-1 text-xs font-extrabold text-[#0D2B45] shadow-sm">
            {formatPrice(course.priceCents)}
          </span>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[#1477DA] px-3 py-1 text-xs font-bold text-white shadow-sm">
          Interactive
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-extrabold text-[#0D2B45]">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-[#717680]">
          {course.shortDescription ?? "Interactive CDL practice with instant explanations."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#1E4D8C]">
          <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1">{course.questionCount} questions</span>
          <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1">{course.examCount} practice exams</span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#F1F5F9] pt-4">
          <span className="text-sm font-bold text-[#14a86b]">3 free practice questions</span>
          <span className="text-sm font-extrabold text-[#1E4D8C] group-hover:underline">
            {owned ? "Continue" : "View course"} &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
