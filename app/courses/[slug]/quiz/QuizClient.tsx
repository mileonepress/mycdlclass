"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Question = {
  id: string;
  question_text: string;
  spanish_question_text: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  spanish_option_a: string | null;
  spanish_option_b: string | null;
  spanish_option_c: string | null;
  spanish_option_d: string | null;
  correct_answer: "A" | "B" | "C" | "D";
  explanation: string | null;
  spanish_explanation: string | null;
};

type Course = {
  id: string;
  slug: string;
  title: string;
  spanish_title: string;
};

type Props = {
  course: Course;
  questions: Question[];
  isLoggedIn: boolean;
  initialLanguage?: "en" | "es";
};

export default function QuizClient({ course, questions, isLoggedIn, initialLanguage = "en" }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [language, setLanguage] = useState<"en" | "es">(initialLanguage);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentQuestion.id];
  const isCorrect = selectedAnswer === currentQuestion.correct_answer;

  function handleAnswer(answer: string) {
    if (showExplanation) return;
    setAnswers({ ...answers, [currentQuestion.id]: answer });
    setShowExplanation(true);
  }

  async function handleNext() {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz complete
      setQuizComplete(true);
      if (isLoggedIn) {
        setSaving(true);
        try {
          const score = Object.entries(answers).filter(
            ([id, ans]) => questions.find((q) => q.id === id)?.correct_answer === ans
          ).length + (isCorrect ? 1 : 0);
          
          await fetch("/api/quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courseId: course.id,
              score,
              totalQuestions: questions.length,
            }),
          });
        } catch (error) {
          console.error("Failed to save quiz:", error);
        } finally {
          setSaving(false);
        }
      }
    }
  }

  const score = Object.entries(answers).filter(
    ([id, ans]) => questions.find((q) => q.id === id)?.correct_answer === ans
  ).length;
  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 80;

  if (quizComplete) {
    return (
      <main className="min-h-screen bg-[#F6F9FC]">
        <nav className="sticky top-0 z-50 bg-[#061A2E] text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="MyCDLClass" width={58} height={58} />
              <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
            </Link>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-5xl font-bold text-white mb-8 ${
            passed ? "bg-[#16A34A]" : "bg-[#DC2626]"
          }`}>
            {percentage}%
          </div>
          
          <h1 className="text-3xl font-bold text-[#0D2B45]">
            {passed ? "Congratulations! You Passed!" : "Keep Practicing!"}
          </h1>
          
          <p className="mt-4 text-lg text-gray-600">
            You scored {score} out of {questions.length} questions correctly.
          </p>
          
          {passed ? (
            <p className="mt-2 text-[#16A34A] font-medium">
              You&apos;re ready for the real CDL exam!
            </p>
          ) : (
            <p className="mt-2 text-[#DC2626] font-medium">
              You need 80% or higher to pass. Review the material and try again.
            </p>
          )}

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/courses/${course.slug}`}
              className="bg-[#1E4D8C] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#163d6e] transition"
            >
              Back to Course
            </Link>
            <button
              onClick={() => {
                setAnswers({});
                setCurrentIndex(0);
                setQuizComplete(false);
                setShowExplanation(false);
              }}
              className="bg-[#16A34A] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#15803d] transition"
            >
              Try Again
            </button>
          </div>

          {saving && (
            <p className="mt-6 text-sm text-gray-500">Saving your score...</p>
          )}
        </div>
      </main>
    );
  }

  const questionText = language === "es" && currentQuestion.spanish_question_text
    ? currentQuestion.spanish_question_text
    : currentQuestion.question_text;

  const options = [
    { letter: "A", text: language === "es" && currentQuestion.spanish_option_a ? currentQuestion.spanish_option_a : currentQuestion.option_a },
    { letter: "B", text: language === "es" && currentQuestion.spanish_option_b ? currentQuestion.spanish_option_b : currentQuestion.option_b },
    { letter: "C", text: language === "es" && currentQuestion.spanish_option_c ? currentQuestion.spanish_option_c : currentQuestion.option_c },
    { letter: "D", text: language === "es" && currentQuestion.spanish_option_d ? currentQuestion.spanish_option_d : currentQuestion.option_d },
  ];

  const explanation = language === "es" && currentQuestion.spanish_explanation
    ? currentQuestion.spanish_explanation
    : currentQuestion.explanation;

  return (
    <main className="min-h-screen bg-[#F6F9FC]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#061A2E] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="MyCDLClass" width={58} height={58} />
            <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              className="text-sm bg-white/10 px-3 py-1 rounded-full"
            >
              {language === "en" ? "Español" : "English"}
            </button>
          </div>
        </div>
      </nav>

      {/* Progress */}
      <div className="bg-[#061A2E] px-6 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>{course.title}</span>
            <span>Question {currentIndex + 1} of {questions.length}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#16A34A] transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Question */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-[#0D2B45] mb-6">{questionText}</h2>

          <div className="space-y-3">
            {options.map((option) => {
              const isSelected = selectedAnswer === option.letter;
              const isCorrectAnswer = currentQuestion.correct_answer === option.letter;
              
              let bgClass = "bg-white border-gray-200 hover:border-[#1E4D8C]";
              if (showExplanation) {
                if (isCorrectAnswer) {
                  bgClass = "bg-[#DCFCE7] border-[#16A34A]";
                } else if (isSelected && !isCorrectAnswer) {
                  bgClass = "bg-[#FEE2E2] border-[#DC2626]";
                } else {
                  bgClass = "bg-gray-50 border-gray-200";
                }
              } else if (isSelected) {
                bgClass = "bg-[#E6F0FF] border-[#1E4D8C]";
              }

              return (
                <button
                  key={option.letter}
                  onClick={() => handleAnswer(option.letter)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border-2 transition ${bgClass} ${
                    showExplanation ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      showExplanation && isCorrectAnswer
                        ? "bg-[#16A34A] text-white"
                        : showExplanation && isSelected && !isCorrectAnswer
                        ? "bg-[#DC2626] text-white"
                        : "bg-[#E6F0FF] text-[#1E4D8C]"
                    }`}>
                      {option.letter}
                    </span>
                    <span className="flex-1 text-[#0D2B45]">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && explanation && (
          <div className={`rounded-2xl p-6 mb-6 ${isCorrect ? "bg-[#DCFCE7]" : "bg-[#FEF3C7]"}`}>
            <h3 className={`font-bold mb-2 ${isCorrect ? "text-[#16A34A]" : "text-[#92400E]"}`}>
              {isCorrect ? "Correct!" : "Incorrect"}
            </h3>
            <p className="text-gray-700">{explanation}</p>
          </div>
        )}

        {/* Next Button */}
        {showExplanation && (
          <button
            onClick={handleNext}
            className="w-full bg-[#1E4D8C] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#163d6e] transition flex items-center justify-center gap-2"
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </main>
  );
}
