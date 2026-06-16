"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  function nextParam() {
    if (typeof window === "undefined") return "/courses"
    const params = new URLSearchParams(window.location.search)
    const next = params.get("next")
    return next ? `/${next.replace(/^\//, "")}` : "/courses"
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    window.location.href = nextParam()
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      // Capture the new signup as a Kit lead (fire-and-forget).
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "signup" }),
      }).catch(() => {})
      setMessage("Check your email to confirm your account, then log in.")
      setMode("login")
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#061A2E] flex flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="mb-8 flex flex-col items-center">
        <Image src="/logo.png" alt="MyCDLClass" width={110} height={110} className="h-auto w-auto" />
      </Link>

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex rounded-lg bg-[#F6F9FC] p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login")
              setError("")
              setMessage("")
            }}
            className={`flex-1 rounded-md py-2 text-sm font-bold transition-colors ${
              mode === "login" ? "bg-white text-[#0D2B45] shadow" : "text-gray-500"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup")
              setError("")
              setMessage("")
            }}
            className={`flex-1 rounded-md py-2 text-sm font-bold transition-colors ${
              mode === "signup" ? "bg-white text-[#0D2B45] shadow" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[#0D2B45]">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {mode === "login"
            ? "Log in to continue your CDL training."
            : "Start studying for your CDL test today."}
        </p>

        <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#0D2B45]">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 p-3 text-[#0D2B45] focus:border-[#1E4D8C] focus:outline-none focus:ring-1 focus:ring-[#1E4D8C]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-[#0D2B45]">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"}
              className="w-full rounded-lg border border-gray-300 p-3 text-[#0D2B45] focus:border-[#1E4D8C] focus:outline-none focus:ring-1 focus:ring-[#1E4D8C]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-[#16A34A]">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#16A34A] py-3 font-bold text-white transition-colors hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Please wait...
              </>
            ) : mode === "login" ? (
              "Log In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {mode === "login" ? "New to MyCDLClass? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login")
              setError("")
              setMessage("")
            }}
            className="font-bold text-[#1E4D8C] hover:underline"
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
      </div>

      <Link href="/" className="mt-6 text-sm text-white/70 hover:text-white">
        Back to home
      </Link>
    </main>
  )
}
