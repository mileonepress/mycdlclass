"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

// Maps the ?error= codes emitted by /auth/confirm to friendly, branded copy.
const ERROR_MESSAGES: Record<string, string> = {
  invalid_or_expired_link:
    "That confirmation link is invalid or has expired. Please request a new one below.",
  missing_confirmation_token:
    "That confirmation link was incomplete. Please use the most recent link from your email, or request a new one.",
  auth: "We couldn't confirm your link. Please try again or request a new one.",
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  // When someone arrives from an expired/invalid signup confirmation link we
  // offer a one-click "resend confirmation email" action.
  const [showResend, setShowResend] = useState(false)

  // Open the correct tab and surface any branded error message when the user
  // arrives from a confirmation/recovery link (e.g. /login?mode=forgot&error=...).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlMode = params.get("mode")
    if (urlMode === "signup" || urlMode === "forgot" || urlMode === "login") {
      setMode(urlMode)
    }
    const errCode = params.get("error")
    if (errCode) {
      setError(ERROR_MESSAGES[errCode] ?? ERROR_MESSAGES.auth)
      // Recovery-link failures reopen the "forgot password" flow (mode=forgot),
      // so any error surfaced on the login tab is an expired/invalid signup
      // confirmation — offer to resend it.
      if (urlMode !== "forgot") setShowResend(true)
    }
  }, [])

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(
          data?.error === "invalid_email"
            ? "Please enter a valid email address."
            : "Something went wrong sending your reset link. Please try again in a moment.",
        )
      } else {
        // Always generic — the endpoint never reveals whether the account exists.
        setMessage(
          "If an account exists for that email, we've sent a password reset link. Please check your inbox (and spam folder).",
        )
      }
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.")
    }

    setLoading(false)
  }

  async function handleResend() {
    if (!email) {
      setError("Enter your email address above and we'll send a fresh confirmation link.")
      return
    }
    setLoading(true)
    setError("")
    setMessage("")

    const nextPath = explicitNext() ?? "/account"
    try {
      const res = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, next: nextPath }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(
          data?.error === "invalid_email"
            ? "Please enter a valid email address."
            : "We couldn't resend your confirmation link. Please try again in a moment.",
        )
      } else {
        setShowResend(false)
        setMessage(
          "If an account exists for that email, we've sent a fresh confirmation link. Please check your inbox (and spam folder).",
        )
      }
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.")
    }
    setLoading(false)
  }

  function explicitNext() {
    if (typeof window === "undefined") return null
    const params = new URLSearchParams(window.location.search)
    const next = params.get("next")
    return next ? `/${next.replace(/^\//, "")}` : null
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

    // Honor an explicit ?next=; otherwise send admins to the admin portal
    // and everyone else to their courses.
    const target = explicitNext()
    if (target) {
      window.location.href = target
      return
    }

    try {
      const me = await fetch("/api/me").then((r) => r.json())
      window.location.href = me?.isAdmin ? "/admin" : "/account"
    } catch {
      window.location.href = "/account"
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    // Preserve an explicit ?next= (e.g. a shopper who clicked "Log in to buy"
    // on a course) so that after confirming their email they land right back
    // where they intended, instead of a generic page. Default to /account.
    const nextPath = explicitNext() ?? "/account"

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, next: nextPath }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(
          data?.error === "invalid_email"
            ? "Please enter a valid email address."
            : data?.error === "weak_password"
              ? "Your password must be at least 8 characters."
              : "We couldn't create your account right now. Please try again in a moment.",
        )
        setLoading(false)
        return
      }

      if (data?.alreadyRegistered) {
        setError("An account with this email already exists. Try logging in, or reset your password.")
        setMode("login")
        setLoading(false)
        return
      }

      // Capture the new signup as a Kit lead (fire-and-forget).
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "signup" }),
      }).catch(() => {})

      setMessage(
        "Almost there! We've sent a confirmation link to your email. Click it to activate your account and you'll be taken straight to your courses.",
      )
      setMode("login")
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.")
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#061A2E] flex flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="mb-8 flex flex-col items-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-3 shadow-lg">
          <Image
            src="/logo.png"
            alt="MyCDLClass"
            width={64}
            height={64}
            className="h-14 w-14 object-contain"
            priority
          />
        </span>
      </Link>

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex rounded-lg bg-[#F6F9FC] p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login")
              setError("")
              setMessage("")
              setShowResend(false)
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
              setShowResend(false)
            }}
            className={`flex-1 rounded-md py-2 text-sm font-bold transition-colors ${
              mode === "signup" ? "bg-white text-[#0D2B45] shadow" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[#0D2B45]">
          {mode === "login"
            ? "Welcome back"
            : mode === "signup"
              ? "Create your account"
              : "Reset your password"}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {mode === "login"
            ? "Log in to access your interactive CDL courses and track your progress."
            : mode === "signup"
              ? "Create an account to start your interactive CDL training courses."
              : "Enter your email and we'll send you a link to create a new password."}
        </p>

        <form
          onSubmit={
            mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleForgot
          }
          className="mt-6 space-y-4"
        >
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#0D2B45]">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 p-3 text-[#0D2B45] focus:border-[#1E4D8C] focus:outline-none focus:ring-1 focus:ring-[#1E4D8C]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-[#0D2B45]">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot")
                      setError("")
                      setMessage("")
                    }}
                    className="text-xs font-semibold text-[#1E4D8C] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder={mode === "signup" ? "At least 8 characters" : "Enter your password"}
                  className="w-full rounded-lg border border-gray-300 p-3 pr-12 text-[#0D2B45] focus:border-[#1E4D8C] focus:outline-none focus:ring-1 focus:ring-[#1E4D8C]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={mode === "signup" ? 8 : undefined}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 transition-colors hover:text-[#1E4D8C]"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {mode === "signup" && (
                <p className="mt-1 text-xs text-gray-500">Use at least 8 characters.</p>
              )}
            </div>
          )}

          {mode === "signup" && (
            <p className="text-xs text-gray-500">
              We&apos;ll email you a secure link to confirm your account.
            </p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-[#1E4D8C]">{message}</p>}

          {mode === "login" && showResend && (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="w-full rounded-lg border border-[#1E4D8C] py-3 font-bold text-[#1E4D8C] transition-colors hover:bg-[#1E4D8C]/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Resend confirmation email
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1E4D8C] py-3 font-bold text-white transition-colors hover:bg-[#173B66] disabled:cursor-not-allowed disabled:opacity-60"
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
            ) : mode === "signup" ? (
              "Create Account"
            ) : (
              "Send reset link"
            )}
          </button>

          {mode === "signup" && (
            <p className="text-center text-xs text-gray-500">
              By creating an account, you agree to our{" "}
              <Link href="/privacy" className="font-semibold text-[#1E4D8C] hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </form>

        {mode === "forgot" ? (
          <p className="mt-6 text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("login")
                setError("")
                setMessage("")
              }}
              className="font-bold text-[#1E4D8C] hover:underline"
            >
              Back to log in
            </button>
          </p>
        ) : (
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
        )}
      </div>

      <Link href="/" className="mt-6 text-sm text-white/70 hover:text-white">
        Back to home
      </Link>
    </main>
  )
}
