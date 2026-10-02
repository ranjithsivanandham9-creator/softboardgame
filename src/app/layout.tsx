import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import './styles/globals.css'
import './styles/fonts.css'
import { FontPreload } from '@/components/FontPreload'

const inter = Inter({
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
  variable: '--font-heading',
  fallback: ['SF Pro Display', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
  fallback: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
})

export const metadata: Metadata = {
  title: 'PIP Roulette',
  description: 'A login-free multiplayer board game that satirizes tech-corporate life',
  themeColor: '#09090B',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#09090B" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </head>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <FontPreload />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}