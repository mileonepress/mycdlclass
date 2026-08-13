"use client"

import { useMemo, useState } from "react"

const letters = ["A", "B", "C", "D"]

function getOptions(question) {
  return letters
    .map((letter) => ({
      letter,
      text: question[`option_${letter.toLowerCase()}`],
    }))
    .filter((option) => Boolean(option.text))
}

export default function FreePracticeQuiz({ questions, lang, scoreLabel }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})

  const completed = questions.every((_, index) => checked[index])
  const score = useMemo(
    () =>
      questions.reduce(
        (total, question, index) =>
          total +
          (checked[index] && answers[index] === String(question.correct_answer).toUpperCase() ? 1 : 0),
        0,
      ),
    [answers, checked, questions],
  )

  return (
    <div className="flex flex-col gap-6">
      {questions.map((question, index) => {
        const isChecked = Boolean(checked[index])
        const correct = answers[index] === String(question.correct_answer).toUpperCase()

        return (
          <fieldset
            key={question.id || index}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6"
          >
            <legend className="px-1 text-base font-bold text-[#0D2B45] md:text-lg">
              <span className="text-[#1E4D8C]">{index + 1}.</span> {question.question}
            </legend>

            <div className="mt-4 flex flex-col gap-2">
              {getOptions(question).map((option) => {
                const selected = answers[index] === option.letter
                const isCorrectOption =
                  isChecked && option.letter === String(question.correct_answer).toUpperCase()
                const isWrongSelected = isChecked && selected && !correct

                return (
                  <label
                    key={option.letter}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                      isCorrectOption
                        ? "border-green-500 bg-green-50"
                        : isWrongSelected
                          ? "border-red-400 bg-red-50"
                          : selected
                            ? "border-[#1E4D8C] bg-[#EFF6FF]"
                            : "border-gray-200 hover:border-[#1E4D8C]/60 hover:bg-[#F6F9FC]"
                    } ${isChecked ? "cursor-default" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option.letter}
                      checked={selected}
                      disabled={isChecked}
                      onChange={() => setAnswers((current) => ({ ...current, [index]: option.letter }))}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        isCorrectOption
                          ? "bg-green-600 text-white"
                          : isWrongSelected
                            ? "bg-red-500 text-white"
                            : selected
                              ? "bg-[#1E4D8C] text-white"
                              : "bg-gray-100 text-[#0D2B45]"
                      }`}
                    >
                      {option.letter}
                    </span>
                    <span className="pt-0.5 text-sm text-[#0D2B45] md:text-base">{option.text}</span>
                  </label>
                )
              })}
            </div>

            {!isChecked ? (
              <button
                type="button"
                disabled={!answers[index]}
                onClick={() => setChecked((current) => ({ ...current, [index]: true }))}
                className="mt-4 rounded-lg bg-[#1E4D8C] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#173B66] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {lang === "es" ? "Revisar respuesta" : "Check answer"}
              </button>
            ) : (
              <div
                aria-live="polite"
                className={`mt-4 rounded-xl p-4 text-sm leading-relaxed ${
                  correct ? "bg-green-50 text-green-900" : "bg-amber-50 text-amber-900"
                }`}
              >
                <strong>
                  {correct
                    ? lang === "es"
                      ? "Correcto."
                      : "Correct."
                    : lang === "es"
                      ? `Respuesta correcta: ${String(question.correct_answer).toUpperCase()}.`
                      : `Correct answer: ${String(question.correct_answer).toUpperCase()}.`}
                </strong>{" "}
                {question.explanation}
              </div>
            )}
          </fieldset>
        )
      })}

      {completed && (
        <div
          aria-live="polite"
          className="rounded-2xl bg-[#061A2E] p-5 text-center text-lg font-bold text-white"
        >
          {scoreLabel}: {score}/{questions.length}
        </div>
      )}
    </div>
  )
}
