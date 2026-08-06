import type { Lang } from "@/lib/courses/types"

/**
 * UI chrome strings for the quiz experience (preview + learn), in English and
 * Spanish. The question CONTENT itself is translated in the database; these are
 * the surrounding labels/buttons so the whole experience switches language.
 * Safe to import from both server components and client components.
 */
export interface QuizStrings {
  freePreview: string
  noAccountNeeded: string
  previewHeading: (title: string) => string
  previewIntro: (count: number, price: string) => string
  backTo: (title: string) => string
  passInfo: (count: number, score: number) => string
  purchaseComplete: string
  // player chrome
  questionOf: (n: number, total: number) => string
  correctCount: (n: number) => string
  explanation: string
  reference: string
  next: string
  seeResults: string
  noQuestions: string
  // results
  previewComplete: string
  youPassed: string
  keepPracticing: string
  answeredSummary: (correct: number, total: number) => string
  score: string
  justTheStart: string
  unlockBlurb: (title: string) => string
  unlockCta: string
  retake: string
  backToCourse: string
}

const EN: QuizStrings = {
  freePreview: "Free Preview",
  noAccountNeeded: "No account needed",
  previewHeading: (t) => `${t}: 3 free practice questions`,
  previewIntro: (count, price) =>
    `Answer each question to see instant feedback and an explanation. Ready for more? Unlock all ${count} questions for ${price}.`,
  backTo: (t) => `Back to ${t}`,
  passInfo: (count, score) => `${count} questions · Pass at ${score}% · Instant explanations`,
  purchaseComplete: "Purchase complete — you now have full access to this course.",
  questionOf: (n, total) => `Question ${n} of ${total}`,
  correctCount: (n) => `${n} correct`,
  explanation: "Explanation",
  reference: "Reference:",
  next: "Next question",
  seeResults: "See results",
  noQuestions: "No questions are available yet.",
  previewComplete: "Preview complete!",
  youPassed: "You passed!",
  keepPracticing: "Keep practicing",
  answeredSummary: (correct, total) => `You answered ${correct} of ${total} correctly.`,
  score: "Score",
  justTheStart: "That was just the start",
  unlockBlurb: (t) =>
    `Unlock the full ${t} course to access every question, scored practice exams, and progress tracking.`,
  unlockCta: "Unlock Full Course",
  retake: "Retake",
  backToCourse: "Back to course",
}

const ES: QuizStrings = {
  freePreview: "Vista previa gratis",
  noAccountNeeded: "No requiere cuenta",
  previewHeading: (t) => `${t}: 3 preguntas de práctica gratis`,
  previewIntro: (count, price) =>
    `Responde cada pregunta para ver retroalimentación instantánea y una explicación. ¿Quieres más? Desbloquea las ${count} preguntas por ${price}.`,
  backTo: (t) => `Volver a ${t}`,
  passInfo: (count, score) => `${count} preguntas · Aprueba con ${score}% · Explicaciones instantáneas`,
  purchaseComplete: "Compra completada: ahora tienes acceso completo a este curso.",
  questionOf: (n, total) => `Pregunta ${n} de ${total}`,
  correctCount: (n) => `${n} correctas`,
  explanation: "Explicación",
  reference: "Referencia:",
  next: "Siguiente pregunta",
  seeResults: "Ver resultados",
  noQuestions: "Aún no hay preguntas disponibles.",
  previewComplete: "¡Vista previa completa!",
  youPassed: "¡Aprobaste!",
  keepPracticing: "Sigue practicando",
  answeredSummary: (correct, total) => `Respondiste ${correct} de ${total} correctamente.`,
  score: "Puntuación",
  justTheStart: "Esto es solo el comienzo",
  unlockBlurb: (t) =>
    `Desbloquea el curso completo de ${t} para acceder a todas las preguntas, exámenes de práctica calificados y seguimiento de tu progreso.`,
  unlockCta: "Desbloquear curso completo",
  retake: "Repetir",
  backToCourse: "Volver al curso",
}

export function getQuizStrings(lang: Lang): QuizStrings {
  return lang === "es" ? ES : EN
}

/** Validates/normalizes a raw searchParam into a supported language. */
export function normalizeLang(raw: string | undefined): Lang {
  return raw === "es" ? "es" : "en"
}
