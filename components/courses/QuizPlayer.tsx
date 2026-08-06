"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Lock, BookMarked } from "lucide-react"
import type { QuizQuestion } from "@/lib/courses/types"

type Mode = "preview" | "full"

export default function QuizPlayer({
  questions,
  mode,
  courseSlug,
  courseId,
  courseTitle,
  priceLabel,
  passingScore = 80,
}: {
  questions: QuizQuestion[]
  mode: Mode
  courseSlug: string
  courseId?: string
  courseTitle: string
  priceLabel?: string
  passingScore?: number
}) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saved, setSaved] = useState(false)

  const total = questions.length
  const current = questions[index]
  const progress = Math.round(((finished ? total : index) / total) * 100)

  const isLast = index === total - 1

  function choose(answerKey: string) {
    if (locked) return
    setSelected(answerKey)
    setLocked(true)
    if (answerKey === current.correctAnswerKey) {
      setCorrectCount((c) => c + 1)
    }
  }

  async function next() {
    if (isLast) {
      setFinished(true)
      if (mode === "full" && courseId && !saved) {
        setSaved(true)
        const percentage = Math.round((correctCount / total) * 100)
        // Fire-and-forget scored attempt; UI does not block on it.
        fetch("/api/courses/attempt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId,
            score: correctCount,
            totalQuestions: total,
            percentage,
            passed: percentage >= passingScore,
          }),
        }).catch(() => {})
      }
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setLocked(false)
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setLocked(false)
    setCorrectCount(0)
    setFinished(false)
    setSaved(false)
  }

  const percentage = useMemo(
    () => (total ? Math.round((correctCount / total) * 100) : 0),
    [correctCount, total],
  )

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-[#F1F5F9] bg-white p-8 text-center text-[#717680]">
        No questions are available yet.
      </div>
    )
  }

  // ---------- Results screen ----------
  if (finished) {
    const passed = percentage >= passingScore
    return (
      <div className="rounded-3xl border border-[#F1F5F9] bg-white p-8 shadow-[0_12px_38px_rgba(6,21,36,0.06)]">
        <div className="text-center">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
              passed ? "bg-[#E7F7EF] text-[#14a86b]" : "bg-[#FEF3E7] text-[#f6a21a]"
            }`}
          >
            <Trophy className="h-10 w-10" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-3xl font-extrabold text-[#0D2B45]">
            {mode === "preview" ? "Preview complete!" : passed ? "You passed!" : "Keep practicing"}
          </h2>
          <p className="mt-2 text-[#717680]">
            You answered <span className="font-extrabold text-[#0D2B45]">{correctCount}</span> of{" "}
            <span className="font-extrabold text-[#0D2B45]">{total}</span> correctly.
          </p>

          <div className="mx-auto mt-6 max-w-xs">
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-[#717680]">Score</span>
              <span className={passed ? "text-[#14a86b]" : "text-[#f6a21a]"}>{percentage}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#EFF6FF]">
              <div
                className={`h-full rounded-full ${passed ? "bg-[#14a86b]" : "bg-[#f6a21a]"}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {mode === "preview" ? (
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#0B2B5E] to-[#1477DA] p-6 text-center text-white">
            <Lock className="mx-auto h-8 w-8" aria-hidden="true" />
            <h3 className="mt-3 text-xl font-extrabold">That was just the start</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
              Unlock the full {courseTitle} course to access every question, scored practice exams, and progress
              tracking.
            </p>
            <Link
              href={`/courses/${courseSlug}`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-extrabold text-[#0B2B5E] transition-transform hover:-translate-y-0.5"
            >
              Unlock Full Course{priceLabel ? ` — ${priceLabel}` : ""} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#1E4D8C] px-6 py-3 font-bold text-[#1E4D8C] transition-colors hover:bg-[#EFF6FF]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retake
            </button>
            <Link
              href={`/courses/${courseSlug}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66]"
            >
              Back to course
            </Link>
          </div>
        )}
      </div>
    )
  }

  // ---------- Question screen ----------
  return (
    <div className="rounded-3xl border border-[#F1F5F9] bg-white p-6 shadow-[0_12px_38px_rgba(6,21,36,0.06)] md:p-8">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm font-bold text-[#717680]">
        <span>
          Question {index + 1} of {total}
        </span>
        <span>{correctCount} correct</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EFF6FF]">
        <div className="h-full rounded-full bg-gradient-to-r from-[#3A83E4] to-[#1477DA] transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* Question */}
      <h2 className="mt-6 text-balance text-xl font-extrabold text-[#0D2B45] md:text-2xl">{current.text}</h2>

      <div className="mt-6 space-y-3">
        {current.choices.map((choice) => {
          const isSelected = selected === choice.answerKey
          const isCorrect = choice.answerKey === current.correctAnswerKey
          let style = "border-[#E5EAF1] bg-white hover:border-[#1E4D8C] hover:bg-[#F8FAFC]"
          if (locked) {
            if (isCorrect) style = "border-[#14a86b] bg-[#E7F7EF]"
            else if (isSelected) style = "border-[#dc3545] bg-[#FDEBED]"
            else style = "border-[#E5EAF1] bg-white opacity-70"
          }
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => choose(choice.answerKey)}
              disabled={locked}
              className={`flex w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3.5 text-left font-medium text-[#0D2B45] transition-all ${style} ${
                locked ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-sm font-extrabold text-[#1E4D8C]">
                  {choice.answerKey}
                </span>
                {choice.text}
              </span>
              {locked && isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-[#14a86b]" aria-hidden="true" />}
              {locked && isSelected && !isCorrect && (
                <XCircle className="h-5 w-5 shrink-0 text-[#dc3545]" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {locked && current.explanation && (
        <div className="mt-5 rounded-2xl border-l-4 border-[#1E4D8C] bg-[#F8FAFC] p-4">
          <p className="flex items-center gap-2 text-sm font-extrabold text-[#1E4D8C]">
            <BookMarked className="h-4 w-4" aria-hidden="true" /> Explanation
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#0D2B45]">{current.explanation}</p>
          {current.studyReference && (
            <p className="mt-2 text-xs font-semibold text-[#717680]">Reference: {current.studyReference}</p>
          )}
        </div>
      )}

      {/* Next */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={next}
          disabled={!locked}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E4D8C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#173B66] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLast ? "See results" : "Next question"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
