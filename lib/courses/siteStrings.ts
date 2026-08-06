import type { Lang } from "@/lib/courses/types"

/**
 * UI chrome strings for the marketing/browse pages (home, catalog, course
 * detail) in English and Spanish. Course CONTENT (titles, descriptions,
 * questions) is translated in the database; these are the surrounding labels.
 * Safe to import from both server and client components.
 */
export interface SiteStrings {
  common: {
    interactiveBadge: string
    enEs: string
    bilingual: string
    questions: (n: number) => string
    practiceExams: (n: number) => string
    freePracticeQuestions: string
    browseEbooks: string
  }
  card: {
    owned: string
    continue: string
    viewCourse: string
    blurbFallback: string
  }
  home: {
    heroEyebrow: string
    heroTitleTop: string
    heroTitleBottom: string
    heroLeadPre: string
    heroLeadBold: string
    heroLeadPost: string
    ctaCourses: string
    statCourses: string
    statQuestions: string
    coursesEyebrow: string
    coursesTitle: string
    coursesLead: string
    coursesEmpty: string
    viewAllCourses: string
    howEyebrow: string
    howTitle: string
    howLead: string
    step1Title: string
    step1Text: string
    step2Title: string
    step2Text: string
    step3Title: string
    step3Text: string
    ebooksEyebrow: string
    ebooksTitle: string
    ebooksLeadPre: string
    ebooksLeadPost: string
    ebookSubtitle: string
    viewAllEbooks: string
    feat1Title: string
    feat1Text: string
    feat2Title: string
    feat2Text: string
    feat3Title: string
    feat3Text: string
    feat4Title: string
    feat4Text: string
  }
  catalog: {
    metaTitle: string
    heroEyebrow: string
    heroTitle: string
    heroLeadPre: string
    heroLeadBold: string
    heroLeadPost: string
    statCourses: string
    statQuestions: string
    perkQuestions: string
    perkBilingual: string
    perkOneTime: string
    chooseTitle: string
    chooseLead: string
    empty: string
    offlineTitle: string
    offlineLead: string
    offlineCta: string
  }
  detail: {
    breadcrumb: string
    minutes: (n: number) => string
    ownTitle: string
    ownLead: (q: number, e: number) => string
    continueLearning: string
    oneTime: string
    lifetime: string
    featAllQuestions: (n: number) => string
    featExplanations: string
    featBilingual: string
    featProgress: string
    unlockCta: (price: string) => string
    redirecting: string
    try3Free: string
    whatsInside: string
    insideMeta: (sections: number, lessons: number) => string
    setsCount: (n: number) => string
    preview: string
    lessonMinutes: (n: number) => string
    readyTitle: string
    readyLead: (price: string) => string
    readyTryFree: string
  }
}

const EN: SiteStrings = {
  common: {
    interactiveBadge: "Interactive",
    enEs: "EN / ES",
    bilingual: "Bilingual",
    questions: (n) => `${n} questions`,
    practiceExams: (n) => `${n} practice exams`,
    freePracticeQuestions: "3 free practice questions",
    browseEbooks: "Browse Ebooks",
  },
  card: {
    owned: "Owned",
    continue: "Continue",
    viewCourse: "View course",
    blurbFallback: "Interactive CDL practice with instant explanations.",
  },
  home: {
    heroEyebrow: "Interactive CDL Prep · English & Español",
    heroTitleTop: "Pass Your CDL Test",
    heroTitleBottom: "The First Time",
    heroLeadPre: "Interactive practice courses with real exam-style questions, instant explanations, and progress tracking. Try ",
    heroLeadBold: "3 free practice questions",
    heroLeadPost: " in any course — no account needed to start.",
    ctaCourses: "Interactive Courses",
    statCourses: "Courses",
    statQuestions: "Questions",
    coursesEyebrow: "Learn Interactively",
    coursesTitle: "Interactive CDL Courses",
    coursesLead: "Practice with exam-style questions and get instant explanations. Every course includes 3 free practice questions.",
    coursesEmpty: "Courses are being prepared. Check back shortly.",
    viewAllCourses: "View All Courses",
    howEyebrow: "Simple & Seamless",
    howTitle: "How It Works",
    howLead: "Start practicing in under a minute — try questions free, then unlock everything with a one-time purchase.",
    step1Title: "Try It Free",
    step1Text: "Take 3 free practice questions in any course — no account required.",
    step2Title: "Unlock the Course",
    step2Text: "One-time purchase unlocks every question, exam, and explanation.",
    step3Title: "Track Your Progress",
    step3Text: "Take scored practice exams and watch your readiness improve.",
    ebooksEyebrow: "Study Offline",
    ebooksTitle: "Prefer a Downloadable Ebook?",
    ebooksLeadPre: "Get the same trusted content as a PDF for just ",
    ebooksLeadPost: " — instant delivery, study anywhere.",
    ebookSubtitle: "CDL Prep Exam Booklet · PDF",
    viewAllEbooks: "View All Ebooks",
    feat1Title: "Exam-Style Questions",
    feat1Text: "Practice with realistic CDL test questions.",
    feat2Title: "Instant Explanations",
    feat2Text: "Understand every answer as you go.",
    feat3Title: "English & Spanish",
    feat3Text: "Study in the language you're most comfortable with.",
    feat4Title: "One-Time Purchase",
    feat4Text: "No subscriptions — unlock a course and keep it.",
  },
  catalog: {
    metaTitle: "Interactive CDL Courses — Practice Exams in English & Spanish",
    heroEyebrow: "Interactive Practice",
    heroTitle: "Pass your CDL exam with interactive practice courses",
    heroLeadPre: "Real exam-style questions with instant explanations, bilingual English & Spanish content, and progress tracking. Try ",
    heroLeadBold: "3 free practice questions",
    heroLeadPost: " in any course, then unlock everything for a single one-time price.",
    statCourses: "CDL courses",
    statQuestions: "Practice questions",
    perkQuestions: "Exam-style questions",
    perkBilingual: "English & Spanish",
    perkOneTime: "One-time purchase, yours forever",
    chooseTitle: "Choose your course",
    chooseLead: "Every course includes 3 free practice questions.",
    empty: "Courses are being prepared. Please check back shortly.",
    offlineTitle: "Prefer to study offline?",
    offlineLead: "Our bilingual CDL prep ebooks give you the same trusted content as a downloadable PDF.",
    offlineCta: "Browse CDL Ebooks",
  },
  detail: {
    breadcrumb: "Courses",
    minutes: (n) => `~${n} min`,
    ownTitle: "You own this course",
    ownLead: (q, e) => `Full access to all ${q} questions and ${e} practice exams.`,
    continueLearning: "Continue Learning",
    oneTime: "one-time",
    lifetime: "Lifetime access. No subscription.",
    featAllQuestions: (n) => `All ${n} exam-style questions`,
    featExplanations: "Instant answer explanations",
    featBilingual: "English & Spanish content",
    featProgress: "Progress tracking & scored exams",
    unlockCta: (price) => `Unlock Full Course — ${price}`,
    redirecting: "Redirecting...",
    try3Free: "Try 3 Questions Free",
    whatsInside: "What's inside",
    insideMeta: (sections, lessons) => `${sections} sections · ${lessons} practice sets`,
    setsCount: (n) => `${n} sets`,
    preview: "Preview",
    lessonMinutes: (n) => `${n} min`,
    readyTitle: "Ready to start?",
    readyLead: (price) => `Take the free preview or unlock the full course for ${price} — yours forever.`,
    readyTryFree: "Try 3 Free",
  },
}

const ES: SiteStrings = {
  common: {
    interactiveBadge: "Interactivo",
    enEs: "EN / ES",
    bilingual: "Bilingüe",
    questions: (n) => `${n} preguntas`,
    practiceExams: (n) => `${n} exámenes de práctica`,
    freePracticeQuestions: "3 preguntas de práctica gratis",
    browseEbooks: "Ver Ebooks",
  },
  card: {
    owned: "Adquirido",
    continue: "Continuar",
    viewCourse: "Ver curso",
    blurbFallback: "Práctica CDL interactiva con explicaciones instantáneas.",
  },
  home: {
    heroEyebrow: "Preparación CDL Interactiva · English & Español",
    heroTitleTop: "Aprueba tu examen CDL",
    heroTitleBottom: "A la primera",
    heroLeadPre: "Cursos de práctica interactivos con preguntas reales tipo examen, explicaciones instantáneas y seguimiento de tu progreso. Prueba ",
    heroLeadBold: "3 preguntas de práctica gratis",
    heroLeadPost: " en cualquier curso — sin necesidad de crear una cuenta.",
    ctaCourses: "Cursos Interactivos",
    statCourses: "Cursos",
    statQuestions: "Preguntas",
    coursesEyebrow: "Aprende Interactivamente",
    coursesTitle: "Cursos CDL Interactivos",
    coursesLead: "Practica con preguntas tipo examen y recibe explicaciones instantáneas. Cada curso incluye 3 preguntas de práctica gratis.",
    coursesEmpty: "Los cursos se están preparando. Vuelve pronto.",
    viewAllCourses: "Ver todos los cursos",
    howEyebrow: "Simple y Sencillo",
    howTitle: "Cómo Funciona",
    howLead: "Empieza a practicar en menos de un minuto — prueba preguntas gratis y luego desbloquea todo con una compra única.",
    step1Title: "Pruébalo Gratis",
    step1Text: "Responde 3 preguntas de práctica gratis en cualquier curso — sin cuenta.",
    step2Title: "Desbloquea el Curso",
    step2Text: "Una compra única desbloquea todas las preguntas, exámenes y explicaciones.",
    step3Title: "Sigue tu Progreso",
    step3Text: "Toma exámenes de práctica calificados y observa cómo mejora tu preparación.",
    ebooksEyebrow: "Estudia Sin Conexión",
    ebooksTitle: "¿Prefieres un Ebook Descargable?",
    ebooksLeadPre: "Obtén el mismo contenido confiable en PDF por solo ",
    ebooksLeadPost: " — entrega instantánea, estudia donde quieras.",
    ebookSubtitle: "Folleto de Examen CDL · PDF",
    viewAllEbooks: "Ver todos los ebooks",
    feat1Title: "Preguntas Tipo Examen",
    feat1Text: "Practica con preguntas realistas del examen CDL.",
    feat2Title: "Explicaciones Instantáneas",
    feat2Text: "Entiende cada respuesta sobre la marcha.",
    feat3Title: "Inglés y Español",
    feat3Text: "Estudia en el idioma con el que te sientas más cómodo.",
    feat4Title: "Compra Única",
    feat4Text: "Sin suscripciones — desbloquea un curso y quédatelo.",
  },
  catalog: {
    metaTitle: "Cursos CDL Interactivos — Exámenes de práctica en inglés y español",
    heroEyebrow: "Práctica Interactiva",
    heroTitle: "Aprueba tu examen CDL con cursos de práctica interactivos",
    heroLeadPre: "Preguntas reales tipo examen con explicaciones instantáneas, contenido bilingüe en inglés y español, y seguimiento de tu progreso. Prueba ",
    heroLeadBold: "3 preguntas de práctica gratis",
    heroLeadPost: " en cualquier curso y luego desbloquea todo por un único precio.",
    statCourses: "Cursos CDL",
    statQuestions: "Preguntas de práctica",
    perkQuestions: "Preguntas tipo examen",
    perkBilingual: "Inglés y español",
    perkOneTime: "Compra única, tuyo para siempre",
    chooseTitle: "Elige tu curso",
    chooseLead: "Cada curso incluye 3 preguntas de práctica gratis.",
    empty: "Los cursos se están preparando. Vuelve pronto.",
    offlineTitle: "¿Prefieres estudiar sin conexión?",
    offlineLead: "Nuestros ebooks bilingües de preparación CDL te dan el mismo contenido confiable en un PDF descargable.",
    offlineCta: "Ver Ebooks CDL",
  },
  detail: {
    breadcrumb: "Cursos",
    minutes: (n) => `~${n} min`,
    ownTitle: "Ya tienes este curso",
    ownLead: (q, e) => `Acceso completo a las ${q} preguntas y ${e} exámenes de práctica.`,
    continueLearning: "Continuar Aprendiendo",
    oneTime: "pago único",
    lifetime: "Acceso de por vida. Sin suscripción.",
    featAllQuestions: (n) => `Las ${n} preguntas tipo examen`,
    featExplanations: "Explicaciones instantáneas de respuestas",
    featBilingual: "Contenido en inglés y español",
    featProgress: "Seguimiento de progreso y exámenes calificados",
    unlockCta: (price) => `Desbloquear curso completo — ${price}`,
    redirecting: "Redirigiendo...",
    try3Free: "Prueba 3 preguntas gratis",
    whatsInside: "Qué incluye",
    insideMeta: (sections, lessons) => `${sections} secciones · ${lessons} sets de práctica`,
    setsCount: (n) => `${n} sets`,
    preview: "Vista previa",
    lessonMinutes: (n) => `${n} min`,
    readyTitle: "¿Listo para empezar?",
    readyLead: (price) => `Toma la vista previa gratis o desbloquea el curso completo por ${price} — tuyo para siempre.`,
    readyTryFree: "Prueba 3 gratis",
  },
}

export function getSiteStrings(lang: Lang): SiteStrings {
  return lang === "es" ? ES : EN
}

/** Appends ?lang=es to an internal path (English stays a clean URL). */
export function langHref(path: string, lang: Lang): string {
  return lang === "es" ? `${path}${path.includes("?") ? "&" : "?"}lang=es` : path
}
