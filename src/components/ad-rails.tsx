'use client'

import * as React from 'react'
import { AdCreative, AD_POOL } from '@/lib/ads'

const ROTATE_MS = 15000
const PER_PAGE = 3

export type AdDirection = 'left' | 'right'

export interface AdRailsProps {
  direction: AdDirection
  offset: number
}

export function AdRails({ direction, offset }: AdRailsProps) {
  // Only render on >= 1100px
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1100

  if (!isDesktop) return null

  const [currentIndex, setCurrentIndex] = React.useState(0)

  // Rotate ads
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PER_PAGE)
    }, ROTATE_MS)
    return () => clearInterval(interval)
  }, [])

  const currentAds = AD_POOL.slice(offset, offset + PER_PAGE)

  return direction === 'left' ? (
    <div
      className="fixed left-0 top-16 z-10 w-64 h-full bg-[var(--surface)]/80 backdrop-blur-md p-4 space-y-2 shadow-lg"
      style={{ maxWidth: '220px' }}
    >
      {currentAds.map((ad) => (
        <div key={ad.id} className="glass px-3 py-2 rounded-md transition-colors hover:bg-[var(--surface-2)]">
          <h3 className="text-xs font-medium text-[var(--text)]">{ad.title}</h3>
          <p className="text-xxxs text-[var(--muted)]">{ad.tagline}</p>
          <Button variant="secondary" size="sm">{ad.cta}</Button>
        </div>
      ))}
      <div key="place-ad" className="glass px-3 py-2 rounded-md border dashed border-[var(--line)]">
        <p className="text-xxxs text-[var(--muted)]">
          <strong>Place ad</strong>
        </p>
      </div>
    </div>
  ) : direction === 'right' && (
    <div
      className="fixed right-0 top-16 z-10 w-64 h-full bg-[var(--surface)]/80 backdrop-blur-md p-4 space-y-2 shadow-lg"
      style={{ maxWidth: '220px' }}
    >
      {currentAds.map((ad) => (
        <div key={ad.id} className="glass px-3 py-2 rounded-md transition-colors hover:bg-[var(--surface-2)]">
          <h3 className="text-xs font-medium text-[var(--text)]">{ad.title}</h3>
          <p className="text-xxxs text-[var(--muted)]">{ad.tagline}</p>
          <Button variant="secondary" size="sm">{ad.cta}</Button>
        </div>
      ))}
      <div key="place-ad" className="glass px-3 py-2 rounded-md border dashed border-[var(--line)]">
        <p className="text-xxxs text-[var(--muted)]">
          <strong>Place ad</strong>
        </p>
      </div>
    </div>
  )
}