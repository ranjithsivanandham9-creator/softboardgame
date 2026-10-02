export const motionTokens = {
  durations: {
    fast: 120,
    base: 200,
    slow: 400,
  },
  easing: {
    ease: [0.16, 1, 0.3, 1] as const,
    spring: { stiffness: 260, damping: 22 },
  },
  cssVars: {
    '--t-fast': '120ms',
    '--t-base': '200ms',
    '--t-slow': '400ms',
    '--ease': 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const

export type MotionDuration = keyof typeof motionTokens.durations
export type MotionEasing = keyof typeof motionTokens.easing

export function getMotionStyle(reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      transitionDuration: '0.01ms',
      animationDuration: '0.01ms',
    }
  }
  return {}
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  return mediaQuery.matches
}

export const reducedMotionStyles = `
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`

export function injectReducedMotionStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById('reduced-motion-styles')) return

  const style = document.createElement('style')
  style.id = 'reduced-motion-styles'
  style.textContent = reducedMotionStyles
  document.head.appendChild(style)
}