"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import type { QuizQuestion } from "@/lib/supabase/courseCatalog"

type Props = {
  slug: string
  lang: "en" | "es"
  courseId: string
  courseTitle: string
  lessonId: string
  lessonTitle: string
  passingScore: number
  isLoggedIn: boolean
  questions: QuizQuestion[]
}

export default function QuizClient({
  slug,
  lang,
  courseId,
  courseTitle,
  lessonId,
  lessonTitle,
  passingScore,
  isLoggedIn,
  questions,
}: Props) {
  const es = lang === "es"
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [finished, setFinished] = useState(false)

  const t = es
    ? {
        question: "Pregunta",
        of: "de",
        check: "Comprobar respuesta",
        next: "Siguiente",
        finish: "Finalizar examen",
        correct: "¡Correcto!",
        incorrect: "Incorrecto",
        explanation: "Explicación",
        results: "Resultados del examen",
        youScored: "Obtuviste",
        passed: "¡Aprobaste!",
        failed: "No aprobaste esta vez",
        retry: "Intentar de nuevo",
        backToCourse: "Volver al curso",
        answered: "respondidas",
      }
    : {
        question: "Question",
        of: "of",
        check: "Check answer",
        next: "Next",
        finish: "Finish exam",
        correct: "Correct!",
        incorrect: "Incorrect",
        explanation: "Explanation",
        results: "Exam results",
        youScored: "You scored",
        passed: "You passed!",
        failed: "You didn't pass this time",
        retry: "Try again",
        backToCourse: "Back to course",
        answered: "answered",
      }

  const q = questions[current]
  const total = questions.length

  const score = useMemo(
    () =>
      questions.reduce(
        (acc, question) => (answers[question.id] === question.correctKey ? acc + 1 : acc),
        0,
      ),
    [answers, questions],
  )
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0
  const didPass = percentage >= passingScore

  function handleCheck() {
    if (selected === null) return
    setRevealed(true)
    setAnswers((prev) => ({ ...prev, [q.id]: selected }))
  }

  function handleNext() {
    if (current + 1 < total) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      finish()
    }
  }

  function finish() {
    setFinished(true)
    if (isLoggedIn) {
      // Record the attempt and mark the lesson complete (fire-and-forget).
      fetch("/api/quiz-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, score, totalQuestions: total, passed: didPass }),
      }).catch(() => {})
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: true }),
      }).catch(() => {})
    }
  }

  function restart() {
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setAnswers({})
    setFinished(false)
  }

  if (finished) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
          <div className="text-5xl">{didPass ? "🎉" : "📘"}</div>
          <h1 className="mt-4 text-2xl font-bold text-[#0D2B45]">{t.results}</h1>
          <p className="mt-2 text-gray-600">{lessonTitle}</p>

          <div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full border-8 border-[#EAF2FC]">
            <span className="text-3xl font-extrabold text-[#1E4D8C]">{percentage}%</span>
          </div>

          <p className="mt-4 text-lg font-bold text-[#0D2B45]">
            {t.youScored} {score}/{total}
          </p>
          <p className={`mt-1 font-semibold ${didPass ? "text-green-600" : "text-amber-600"}`}>
            {didPass ? t.passed : t.failed}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={restart}
              className="rounded-lg bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
            >
              {t.retry}
            </button>
            <Link
              href={`/training-courses/${slug}${es ? "?lang=es" : ""}`}
              className="rounded-lg border border-gray-300 px-6 py-3 font-bold text-[#0D2B45] transition-colors hover:bg-gray-50"
            >
              {t.backToCourse}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const progressPct = Math.round(((current + (revealed ? 1 : 0)) / total) * 100)

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-gray-500">
        <Link href={`/training-courses/${slug}${es ? "?lang=es" : ""}`} className="hover:text-[#1E4D8C]">
          ← {courseTitle}
        </Link>
        <span>
          {t.question} {current + 1} {t.of} {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="h-full bg-[#16A34A] transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-bold leading-relaxed text-[#0D2B45]">{q.text}</h1>

        <div className="mt-5 space-y-3">
          {q.choices.map((choice) => {
            const isSelected = selected === choice.key
            const isCorrect = choice.key === q.correctKey
            let cls =
              "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors"
            if (revealed) {
              if (isCorrect) cls += " border-green-500 bg-green-50"
              else if (isSelected) cls += " border-red-400 bg-red-50"
              else cls += " border-gray-200"
            } else if (isSelected) {
              cls += " border-[#1E4D8C] bg-[#EAF2FC]"
            } else {
              cls += " border-gray-200 hover:border-[#1E4D8C]"
            }
            return (
              <button
                key={choice.key}
                type="button"
                disabled={revealed}
                onClick={() => setSelected(choice.key)}
                className={cls}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold text-[#1E4D8C]">
                  {choice.key}
                </span>
                <span className="text-sm text-[#0D2B45]">{choice.text}</span>
              </button>
            )
          })}
        </div>

        {revealed ? (
          <div className="mt-5 rounded-xl bg-[#F6F9FC] p-4">
            <p
              className={`font-bold ${
                selected === q.correctKey ? "text-green-600" : "text-red-500"
              }`}
            >
              {selected === q.correctKey ? t.correct : t.incorrect}
            </p>
            {q.explanation ? (
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                <span className="font-semibold text-[#0D2B45]">{t.explanation}: </span>
                {q.explanation}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 flex justify-end">
          {!revealed ? (
            <button
              type="button"
              onClick={handleCheck}
              disabled={selected === null}
              className="rounded-lg bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.check}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-[#16A34A] px-6 py-3 font-bold text-white transition-colors hover:bg-[#128a3e]"
            >
              {current + 1 < total ? t.next : t.finish}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
