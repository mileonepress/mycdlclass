"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // The email link routes through /auth/callback, which exchanges the code for
  // a session and redirects here. Confirm we have a recovery session.
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setHasSession(!!user)
      setChecking(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setMessage("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage("Your password has been updated. Redirecting you...")
    setTimeout(() => {
      window.location.href = "/admin"
    }, 1500)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#061A2E] px-6 py-12">
      <Link href="/" className="mb-8 flex flex-col items-center">
        <Image src="/logo.png" alt="MyCDLClass" width={110} height={110} className="h-auto w-auto" />
      </Link>

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-[#0D2B45]">Create a new password</h1>

        {checking ? (
          <p className="mt-4 text-sm text-gray-600">Verifying your reset link...</p>
        ) : !hasSession ? (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block rounded-lg bg-[#16A34A] px-5 py-3 font-bold text-white transition-colors hover:bg-[#15803d]"
            >
              Back to log in
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-1 text-sm text-gray-600">
              Enter a new password for your account below.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-[#0D2B45]">
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  className="w-full rounded-lg border border-gray-300 p-3 text-[#0D2B45] focus:border-[#1E4D8C] focus:outline-none focus:ring-1 focus:ring-[#1E4D8C]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-[#0D2B45]">
                  Confirm new password
                </label>
                <input
                  id="confirm"
                  type="password"
                  placeholder="Re-enter your password"
                  className="w-full rounded-lg border border-gray-300 p-3 text-[#0D2B45] focus:border-[#1E4D8C] focus:outline-none focus:ring-1 focus:ring-[#1E4D8C]"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
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
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>

      <Link href="/" className="mt-6 text-sm text-white/70 hover:text-white">
        Back to home
      </Link>
    </main>
  )
}
