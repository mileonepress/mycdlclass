"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const IGNORED_PREFIXES = ["/admin", "/login"]

function getSessionId(): string {
  try {
    const key = "mcc_sid"
    let id = sessionStorage.getItem(key)
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36)
      sessionStorage.setItem(key, id)
    }
    return id
  } catch {
    return "anon"
  }
}

/**
 * Fires a lightweight beacon to /api/track-view on each client-side
 * navigation. Skips admin/login routes. Rendered once in the root layout.
 */
export default function ViewTracker() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    if (IGNORED_PREFIXES.some((p) => pathname.startsWith(p))) return
    // Avoid double-counting the same path (e.g. from re-renders).
    if (lastPath.current === pathname) return
    lastPath.current = pathname

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || null,
      sessionId: getSessionId(),
    })

    // Prefer sendBeacon so the request survives navigation.
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track-view", new Blob([payload], { type: "application/json" }))
        return
      }
    } catch {
      // fall through to fetch
    }

    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}
