'use client'

import * as React from 'react'
import { useDisclosure, useFocusEffect } from '@react-aria/dialog'
import { useKeyboard } from '@react-aria keyboard'
import { useToast } from '@/components/ui/use-toast'

export interface FocusModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title: string
  // Incident-specific props
  incidentText?: string
  onAcknowledge?: () => void
  onBuy?: () => void
  onPass?: () => void
}

export function FocusModal({ isOpen, onOpenChange, children, title, incidentText, onAcknowledge, onBuy, onPass }: FocusModalProps) {
  const [isFocused, setFocused] = React.useState(false)
  const [showProgressBar, setShowProgressBar] = React.useState(false)
  const [passTimer, setPassTimer] = React.useState<number | null>(null)
  const [ackTimer, setAckTimer] = React.useState<number | null>(null)

  // Reduced motion check
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Progress bar timers
  React.useEffect(() => {
    if (showProgressBar && ackTimer === null) {
      setAckTimer(window.setTimeout(() => {
        onAcknowledge?.()
        setShowProgressBar(false)
        setAckTimer(null)
      }, 6000))
    }
    return () => {
      if (ackTimer) clearTimeout(ackTimer)
      if (passTimer) clearTimeout(passTimer)
    }
  }, [showProgressBar, onAcknowledge])

  // Pass timer
  React.useEffect(() => {
    if (passTimer === null && !showProgressBar) {
      setPassTimer(window.setTimeout(() => {
        onPass?.()
        setFocused(false)
      }, 10000))
    }
    return () => {
      if (passTimer) clearTimeout(passTimer)
    }
  }, [])

  // Focus management
  useFocusEffect(
    useFocusEffect() {
      setFocused(true)
    }
  )

  // Keyboard handling
  const { keydownOnWindow } = useKeyboard({
    onEscapeKeyDown: () => {
      if (onPass) onPass()
      if (onAcknowledge) onAcknowledge()
    },
  })

  // Close handler
  const handleClose = () => {
    setFocused(false)
    onOpenChange(false)
  }

  // Acknowledge progress
  const acknowledgeProgress = showProgressBar ? '6s progress bar active' : ''

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 items-center justify-center"
      onClick={handleClose}
    >
      {/* Modal overlay that blurs background */}
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity ${reducedMotion ? 'backdrop-blur-none' : 'backdrop-blur-sm'}`}
      />

      {/* Modal content - zooms from center */}
      <div
        className={`relative transform transition-all duration-500 ease-out ${
          reducedMotion ? 'scale-95' : 'scale-96'
        } bg-white rounded-lg shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar for Incident */}
        {incidentText && (
          <div className="h-6 bg-[var(--warn)] text-[var(--bg)] text-sm font-medium flex items-center px-4">
            {incidentText}
          </div>
        )}

        {/* Modal header */}
        <h2 id="modal-title" className="text-h2 px-4 py-3 text-[var(--text)]">
          {title}
        </h2>

        {/* Modal body */}
        <div className="p-6">
          {children}
        </div>

        {/* Action buttons */}
        <div className="p-6 border-t pt-6 flex gap-3">
          {/* Acknowledge button - fills as progress bar */}
          <button
            onClick={onAcknowledge}
            className={`flex-1 rounded-md px-4 py-2 text-[var(--text)] transition-colors ${
              showProgressBar ? 'bg-[var(--surface-2)]' : 'bg-[var(--ok)] hover:bg-[var(--accent)]'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]`}
            disabled={showProgressBar}
            aria-live="polite"
          >
            {showProgressBar ? (
              <div className="w-full h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                <div
                  className="h-full bg-[var(--ok)] transition-width"
                  style={{ width: showProgressBar ? '66.67%' : '0%' }}
                />
              </div>
            ) : (
              'Acknowledge'
            )}
          </button>

          {/* Buy button */}
          <button
            onClick={onBuy}
            className={`flex-1 rounded-md px-4 py-2 text-[var(--text)] transition-colors bg-[var(--btn)] hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]`}
          >
            Buy
          </button>

          {/* Pass button */}
          <button
            onClick={onPass}
            className={`flex-1 rounded-md px-4 py-2 text-[var(--text)] transition-colors bg-[var(--surface-2)] hover:bg-opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]`}
          >
            Pass
          </button>
        </div>
      </div>
    </div>
  )
}