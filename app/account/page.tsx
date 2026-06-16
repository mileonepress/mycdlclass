import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="min-h-screen bg-[#F6F9FC]">
        <nav className="sticky top-0 z-50 bg-[#061A2E] text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="MyCDLClass" width={58} height={58} />
              <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
            </Link>
            <Link href="/login" className="rounded-lg bg-[#16A34A] px-4 py-2 font-bold">
              Login
            </Link>
          </div>
        </nav>

        <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-extrabold text-[#0D2B45]">Please Log In</h1>
          <p className="mt-4 text-gray-600">You need to be logged in to view your account.</p>
          <Link href="/login" className="mt-8 rounded-xl bg-[#16A34A] px-8 py-4 font-bold text-white">
            Go to Login
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F6F9FC]">
      <nav className="sticky top-0 z-50 bg-[#061A2E] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="MyCDLClass" width={58} height={58} />
            <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
          </Link>

          <div className="hidden gap-6 text-sm md:flex">
            <Link href="/courses">Courses</Link>
            <Link href="/free-practice-test">Free Test</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/courses" className="hidden rounded-lg bg-[#16A34A] px-4 py-2 font-bold sm:inline-block">
              My Courses
            </Link>
            <LogoutButton variant="nav" />
          </div>
        </div>
      </nav>

      <section className="bg-[#061A2E] text-white py-16 px-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-wider text-[#16A34A] font-bold">Account Settings</p>
          <h1 className="mt-2 text-4xl font-extrabold">Your Account</h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {/* Account Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-[#0D2B45]">Account Details</h2>
          <p className="mt-1 text-gray-500">{user.email}</p>

          <div className="mt-6 rounded-xl bg-[#E6F0FF] p-6">
            <p className="font-bold text-[#1E4D8C]">Per-Course Purchases</p>
            <p className="mt-1 text-sm text-gray-600">
              Courses are purchased individually with a one-time secure card payment. Browse the catalog to add more courses.
            </p>
            <Link
              href="/courses"
              className="mt-4 inline-block rounded-lg bg-[#16A34A] px-6 py-3 font-bold text-white"
            >
              Browse Courses
            </Link>
          </div>
        </div>

        {/* Actions Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-[#0D2B45]">Account Actions</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            <LogoutButton />
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-[#0D2B45]">Quick Links</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/courses"
              className="flex items-center gap-4 rounded-xl border-2 border-[#E5E7EB] p-4 hover:border-[#16A34A] transition-colors"
            >
              <div className="rounded-lg bg-[#16A34A] p-3 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#0D2B45]">My Courses</p>
                <p className="text-sm text-gray-500">Continue learning</p>
              </div>
            </Link>

            <Link
              href="/free-practice-test"
              className="flex items-center gap-4 rounded-xl border-2 border-[#E5E7EB] p-4 hover:border-[#16A34A] transition-colors"
            >
              <div className="rounded-lg bg-[#1E4D8C] p-3 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#0D2B45]">Practice Tests</p>
                <p className="text-sm text-gray-500">Take a free test</p>
              </div>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-4 rounded-xl border-2 border-[#E5E7EB] p-4 hover:border-[#16A34A] transition-colors"
            >
              <div className="rounded-lg bg-[#0D2B45] p-3 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#0D2B45]">Dashboard</p>
                <p className="text-sm text-gray-500">View your progress</p>
              </div>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-4 rounded-xl border-2 border-[#E5E7EB] p-4 hover:border-[#16A34A] transition-colors"
            >
              <div className="rounded-lg bg-[#16A34A] p-3 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#0D2B45]">Home</p>
                <p className="text-sm text-gray-500">Back to homepage</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#061A2E] py-12 text-center text-white">
        <p className="text-lg">
          Need help?{" "}
          <a href="mailto:support@mycdlclass.com" className="underline">
            support@mycdlclass.com
          </a>
        </p>
      </section>
    </main>
  )
}
