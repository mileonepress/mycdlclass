'use client'

import { useState } from 'react'

export default function LogoutButton({ variant = 'default' }: { variant?: 'default' | 'nav' }) {
  const [loading, setLoading] = useState(false)

  async function logout() {
    setLoading(true)
    try {
      await fetch('/api/logout', { method: 'POST' })
      window.location.href = '/'
    } catch (error) {
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (variant === 'nav') {
    return (
      <button
        onClick={logout}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        )}
        {loading ? 'Signing out...' : 'Sign Out'}
      </button>
    )
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="rounded-xl border-2 border-[#E5E7EB] px-6 py-3 font-bold text-[#0D2B45] hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Logging out...
        </>
      ) : (
        'Log Out'
      )}
    </button>
  )
}
