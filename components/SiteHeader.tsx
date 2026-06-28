"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/ebooks", label: "Ebooks" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#061A2E] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="MyCDLClass" width={48} height={48} />
          <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-[#16A34A]">
              {link.label}
            </Link>
          ))}
          <Link
            href="/ebooks"
            className="rounded-lg bg-[#16A34A] px-4 py-2 font-bold transition-colors hover:bg-[#15803d]"
          >
            Browse Ebooks
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex items-center justify-center rounded-lg p-2 text-white transition-colors hover:bg-white/10 md:hidden"
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-white/10 bg-[#061A2E] md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/ebooks"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-[#16A34A] px-3 py-3 text-center font-bold transition-colors hover:bg-[#15803d]"
            >
              Browse Ebooks
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
