'use client'

import * as React from 'react'

export interface FocusModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title: string
  incidentText?: string
  onAcknowledge?: () => void
  onBuy?: () => void
  onPass?: () => void
}

export function FocusModal({
  isOpen,
  onOpenChange,
  children,
  title,
  incidentText,
  onAcknowledge,
  onBuy,
  onPass,
}: FocusModalProps) {
  const [reducedMotion, setReducedMotion] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  React.useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onPass?.()
        onAcknowledge?.()
        onOpenChange(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onAcknowledge, onOpenChange, onPass])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity ${reducedMotion ? 'backdrop-blur-none' : 'backdrop-blur-sm'}`}
      />

      <div
        className={`relative z-10 w-full max-w-lg transform rounded-lg bg-white shadow-xl transition-all duration-500 ease-out ${reducedMotion ? 'scale-95' : 'scale-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {incidentText && (
          <div className="h-6 bg-[var(--warn)] px-4 text-sm font-medium text-[var(--bg)] flex items-center">
            {incidentText}
          </div>
        )}

        <h2 id="modal-title" className="px-4 py-3 text-h2 text-[var(--text)]">
          {title}
        </h2>

        <div className="p-6">{children}</div>

        <div className="flex gap-3 border-t p-6">
          <button
            onClick={onAcknowledge}
            className="flex-1 rounded-md bg-[var(--ok)] px-4 py-2 text-[var(--bg)] transition-colors hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            type="button"
          >
            Acknowledge
          </button>

          <button
            onClick={onBuy}
            className="flex-1 rounded-md bg-[var(--btn)] px-4 py-2 text-[var(--text)] transition-colors hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            type="button"
          >
            Buy
          </button>

          <button
            onClick={onPass}
            className="flex-1 rounded-md bg-[var(--surface-2)] px-4 py-2 text-[var(--text)] transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            type="button"
          >
            Pass
          </button>
        </div>
      </div>
    </div>
  )
}
