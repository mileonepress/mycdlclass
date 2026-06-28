import Link from "next/link"
import LogoutButton from "@/components/LogoutButton"

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/purchases", label: "Purchases" },
  { href: "/admin/access", label: "Grant Access" },
]

export default function AdminNav({ email }: { email?: string | null }) {
  return (
    <nav className="sticky top-0 z-50 bg-[#061A2E] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-extrabold tracking-wide">
          MYCDL CLASS · Admin
        </Link>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-white/80 hover:text-white">
              {link.label}
            </Link>
          ))}
          <Link href="/" className="text-white/80 hover:text-white">
            View Site
          </Link>
          <LogoutButton variant="nav" />
        </div>
      </div>
      {email ? (
        <div className="border-t border-white/10 bg-[#08233d] px-6 py-1.5 text-center text-xs text-white/60">
          Signed in as {email}
        </div>
      ) : null}
    </nav>
  )
}
