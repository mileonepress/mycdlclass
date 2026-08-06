/**
 * Client-safe presentation metadata for courses (no server-only imports).
 * Maps each course slug to a lucide icon name and an accent gradient so the
 * catalog reads as a cohesive, branded set without per-course photography.
 */
export interface CoursePresentation {
  icon: string
  gradient: string
  blurb: string
}

const DEFAULT: CoursePresentation = {
  icon: "GraduationCap",
  gradient: "from-[#1E4D8C] to-[#3A83E4]",
  blurb: "Interactive CDL practice",
}

const MAP: Record<string, CoursePresentation> = {
  "general-knowledge": {
    icon: "BookOpen",
    gradient: "from-[#0B2B5E] to-[#1477DA]",
    blurb: "The core written exam every CDL applicant must pass.",
  },
  "air-brakes": {
    icon: "Gauge",
    gradient: "from-[#1E4D8C] to-[#3A83E4]",
    blurb: "Master the air brake system check and endorsement.",
  },
  "combination-vehicles": {
    icon: "Truck",
    gradient: "from-[#08284a] to-[#1E4D8C]",
    blurb: "Couple, uncouple, and inspect combination rigs with confidence.",
  },
  hazmat: {
    icon: "Flame",
    gradient: "from-[#8a2b0b] to-[#d9531e]",
    blurb: "Placarding, loading, and safety rules for hazardous loads.",
  },
  "pre-trip-inspection": {
    icon: "ClipboardCheck",
    gradient: "from-[#0B2B5E] to-[#3A83E4]",
    blurb: "Walk through every point examiners expect you to name.",
  },
  passenger: {
    icon: "Users",
    gradient: "from-[#134e2b] to-[#14a86b]",
    blurb: "Carry passengers safely and pass the endorsement exam.",
  },
  "school-bus": {
    icon: "Bus",
    gradient: "from-[#8a6a0b] to-[#f6a21a]",
    blurb: "Student safety, loading zones, and school bus rules.",
  },
  tanker: {
    icon: "Droplets",
    gradient: "from-[#0b4a5e] to-[#1477DA]",
    blurb: "Handle liquid surge and tank vehicle requirements.",
  },
  "doubles-triples": {
    icon: "Layers",
    gradient: "from-[#08284a] to-[#3A83E4]",
    blurb: "Assemble and inspect double and triple trailer combinations.",
  },
}

export function getCoursePresentation(slug: string): CoursePresentation {
  return MAP[slug] ?? DEFAULT
}

export function formatPrice(cents: number): string {
  const dollars = cents / 100
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`
}
