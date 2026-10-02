'use client'

import { useEffect } from 'react'

export function FontPreload() {
  useEffect(() => {
    const preloadFonts = () => {
      const fonts = [
        { href: '/fonts/Inter-800.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
        { href: '/fonts/GeistMono-400.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      ]

      fonts.forEach(({ href, as, type, crossOrigin }) => {
        if (!document.querySelector(`link[href="${href}"]`)) {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.href = href
          link.as = as
          link.type = type
          link.crossOrigin = crossOrigin
          document.head.appendChild(link)
        }
      })
    }

    if (document.readyState === 'complete') {
      preloadFonts()
    } else {
      window.addEventListener('load', preloadFonts)
      return () => window.removeEventListener('load', preloadFonts)
    }
  }, [])

  return null
}