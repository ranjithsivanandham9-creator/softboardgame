'use client'

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

export type SpotlightFeature = {
  id: string
  element: string // CSS selector
  padding?: number
  requireAction?: boolean
}

export type SpotlightOverlayProps = {
  features: SpotlightFeature[]
  currentStep: number
  onNext: () => void
  onSkip: () => void
  onClose: () => void
  reducedMotion?: boolean
}

export function SpotlightOverlay({ features, currentStep, onNext, onSkip, onClose, reducedMotion = false }: SpotlightOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [computedStyles, setComputedStyles] = useState<{ left: string; top: string; width: string; height: string; borderRadius: string }>({ left: '0', top: '0', width: '100%', height: '100%', borderRadius: '0' })
  const [accentPulse, setAccentPulse] = useState(false)

  // Compute hole position and size based on current feature
  useEffect(() => {
    if (currentStep < 0 || currentStep >= features.length) return

    const feature = features[currentStep]
    const element = document.querySelector(feature.element)
    if (!element) return

    const rect = element.getBoundingClientRect()
    const padding = feature.padding ?? 8
    // Get element's natural border radius
    const style = window.getComputedStyle(element)
    const borderRadius = style.borderRadius

    setComputedStyles({
      left: `${rect.left - padding}px`,
      top: `${rect.top - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      borderRadius: borderRadius,
    })

    // Start accent ring pulse on first step
    if (currentStep === 0) {
      setAccentPulse(true)
    }
  }, [currentStep, features])

  // Recompute on window resize and scroll
  useEffect(() => {
    const handleResize = () => {
      // Recompute position if needed
    }
    const handleScroll = () => {
      // Recompute position if needed
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Accent ring animation
  useEffect(() => {
    if (!accentPulse) return
    const style = document.createElement('style')
    style.id = 'accent-ring-style'
    style.textContent = `
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
      .accent-ring {
        position: absolute;
        inset: -4px;
        border-radius: inherit;
        border: 2px solid var(--accent);
        opacity: 0.5;
        animation: pulse-glow 1.6s ease-in-out infinite;
      }
    `
    document.head.appendChild(style)
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [accentPulse])

  // Pointer event handling: block outside hole unless requireAction
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const feature = features[currentStep]
      if (!feature || feature.requireAction) return

      const element = document.querySelector(feature.element)
      if (element) {
        const rect = element.getBoundingClientRect()
        const isInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
        if (!isInside) {
          e.stopPropagation()
        }
      }
    }

    overlayRef.current?.addEventListener('pointerdown', handlePointerDown)
    return () => {
      overlayRef.current?.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [currentStep, features])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 pointer-events-none"
      onClick={onClose}
    >
      {/* Dim background */}
      <div className="absolute inset-0 bg-black/72 pointer-events-auto" onClick={onClose} />

      {/* Hole using SVG mask */}
      <div className="absolute inset-0 pointer-events-auto" style={{
        // SVG mask for the cut-out rounded rectangle
        // The mask creates a hole effect
        WebkitMask: `inset(${8}px ${8}px ${8}px ${8}px)`,
        mask: `inset(${8}px ${8}px ${8}px ${8}px)`,
        borderRadius: 'var(--r-lg)',
      }} />

      {/* Feature-specific hole positioning via data attributes */}
      {currentStep >= 0 && currentStep < features.length && (
        <div
          className="absolute inset-0 select-none"
          style={{
            // Position the cut-out based on computed styles
            ['--hole-left' as any]: computedStyles.left,
            ['--hole-top' as any]: computedStyles.top,
            ['--hole-width' as any]: computedStyles.width,
            ['--hole-height' as any]: computedStyles.height,
            ['--border-radius' as any]: computedStyles.borderRadius,
            // Animated glide effect would be driven by CSS/JS
          }}
        />
      )}

      {/* Accent ring when active */}
      {accentPulse && (
        <div className="absolute inset-0 select-none">
          <div className="accent-ring absolute inset-0" />
        </div>
      )}
    </div>
  )
}

// Storybook stories
export function SpotlightOverlayStory() {
  return (
    <SpotlightOverlay
      features={[
        { id: 'feature-1', element: '[data-t=create]' },
        { id: 'feature-2', element: '[data-t=join]' },
      ]}
      currentStep={0}
      onNext={() => console.log('Next step')}
      onSkip={() => console.log('Skipped')}
      onClose={() => console.log('Closed')}
    />
  )
}
