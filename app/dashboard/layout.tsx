import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, BookOpen, Library, UploadCloud, ShieldCheck } from "lucide-react"
import { requireDashboardAdmin } from "@/lib/dashboard/authz"

export const dynamic = "force-dynamic"

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard/ebooks", label: "eBook Catalog", icon: Library },
  { href: "/dashboard/import", label: "Import Center", icon: UploadCloud },
]

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const admin = await requireDashboardAdmin()

  return (
    <div className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <div className="mx-auto flex max-w-[1400px] flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="border-b border-slate-200 bg-[#061A2E] text-white md:min-h-screen md:w-64 md:border-b-0 md:border-r md:border-[#0D2B45]">
          <div className="flex items-center gap-2 px-5 py-5">
            <Image src="/logo.png" alt="MyCDLClass" width={36} height={36} className="h-9 w-9 rounded" />
            <div>
              <p className="text-sm font-bold leading-tight">Content Dashboard</p>
              <p className="text-[11px] leading-tight text-white/60">Secured admin</p>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-0">
            {NAV.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-auto hidden px-5 py-4 md:block">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-white/70">
              <ShieldCheck className="h-4 w-4 text-[#14a86b]" aria-hidden />
              <span className="truncate" title={admin.email}>
                {admin.email}
              </span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  )
}
