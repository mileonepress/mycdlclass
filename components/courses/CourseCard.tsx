import Link from "next/link"
import {
  BookOpen,
  Gauge,
  Truck,
  Flame,
  ClipboardCheck,
  Users,
  Bus,
  Droplets,
  Layers,
  GraduationCap,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react"
import { getCoursePresentation, formatPrice } from "@/lib/courses/presentation"
import type { CourseSummary } from "@/lib/courses/types"

const ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Gauge,
  Truck,
  Flame,
  ClipboardCheck,
  Users,
  Bus,
  Droplets,
  Layers,
  GraduationCap,
}

export default function CourseCard({ course, owned = false }: { course: CourseSummary; owned?: boolean }) {
  const pres = getCoursePresentation(course.slug)
  const Icon = ICONS[pres.icon] ?? GraduationCap

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#F1F5F9] bg-white shadow-[0_12px_38px_rgba(6,21,36,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(6,26,46,0.14)]"
    >
      <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${pres.gradient}`}>
        <Icon className="h-14 w-14 text-white/90" strokeWidth={1.5} aria-hidden="true" />
        {owned ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-[#14a86b]">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Owned
          </span>
        ) : (
          <span className="absolute right-3 top-3 rounded-full bg-[#FEB510] px-3 py-1 text-xs font-extrabold text-[#0D2B45]">
            {formatPrice(course.priceCents)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-extrabold text-[#0D2B45]">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-[#717680]">{course.shortDescription ?? pres.blurb}</p>

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
