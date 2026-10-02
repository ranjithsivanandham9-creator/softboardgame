'use client'

import * as React from 'react'
import { AdCreative, AD_POOL } from '@/lib/ads'

const ROTATE_MS = 15000
const PER_PAGE = 3

export type AdDirection = 'left' | 'right' | 'stack'

export interface AdWallProps {
  direction: AdDirection
  offset: number // page offset so the two rails never show the same page
}

export function AdWall({ direction, offset }: AdWallProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [ads, setAds] = React.useState<AdCreative[]>(AD_POOL)

  // Rotate ads
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PER_PAGE)
    }, ROTATE_MS)
    return () => clearInterval(interval)
  }, [])

  const currentAds = ads.slice(currentIndex, currentIndex + PER_PAGE)

  return (
    <div className="space-y-2">
      {currentAds.map((ad) => (
        <div
          key={ad.id}
          className="glass px-4 py-3 rounded-[var(--r-md)] transition-colors hover:bg-[var(--surface-2)]"
        >
          <h3 className="text-sm font-medium text-[var(--text)]">{ad.title}</h3>
          <p className="text-caption text-[var(--muted)]">{ad.tagline}</p>
          <Button variant="secondary" size="sm" className="mt-2 w-full">
            {ad.cta}
          </Button>
        </div>
      ))}
      {direction === 'stack' && (
        <div
          key="place-ad"
          className="glass px-4 py-3 rounded-[var(--r-md)] border dashed border-[var(--line)]"
        >
          <p className="text-caption text-[var(--muted)]">
            <strong>Place ad</strong> · Your startup here. Seen by every player in the war room.
          </p>
        </div>
      )}
    </div>
  )
}