export function useHaptics() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const vibrate = (pattern: number[]) => {
    if (prefersReducedMotion || !navigator.vibrate) return
    ;(navigator as any).vibrate(pattern)
  }

  const triggerVibrate = (type: 'tap' | 'success' | 'error' | 'wheel-stop') => {
    if (prefersReducedMotion) return
    switch (type) {
      case 'tap':
        vibrate(10)
        break
      case 'success':
        vibrate([12, 40, 12])
        break
      case 'error':
        vibrate([40, 30, 40])
        break
      case 'wheel-stop':
        vibrate(25)
        break
    }
  }

  return { triggerVibrate, prefersReducedMotion }
}