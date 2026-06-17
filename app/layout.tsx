import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'My CDL Class | Free CDL Practice Tests & Prep Ebooks',
  description: 'Free bilingual CDL interactive practice tests and downloadable prep ebooks. Study on PC, Mac, Android, and Apple devices.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#061A2E',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <body>
        {children}
      </body>
    </html>
  )
}
