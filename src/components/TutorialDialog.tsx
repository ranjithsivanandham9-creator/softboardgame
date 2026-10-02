'use client'

import * as React from 'react'
import { Avatar } from '@/components/Avatar'

export type TutorialFeature = {
  id: string
  title: string
  steps: {
    element: string
    text: string
    requireAction?: boolean
  }[]
  trigger: string
}

export type TutorialDialogProps = {
  feature: TutorialFeature | null
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onSkip: () => void
  onComplete: () => void
  reducedMotion?: boolean
  avatar?: { id: string; speaking?: boolean }
}

export function TutorialDialog({
  feature,
  isOpen,
  onClose,
  onNext,
  onSkip,
  onComplete,
  reducedMotion = false,
  avatar,
}: TutorialDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [typingIndex, setTypingIndex] = React.useState(0)
  const [showNext, setShowNext] = React.useState(false)
  const [dontShowAgain, setDontShowAgain] = React.useState(false)

  const steps = feature?.steps ?? []
  const currentText = steps[currentStep]?.text ?? ''

  React.useEffect(() => {
    if (!isOpen || typingIndex >= currentText.length) return
    const timeout = window.setTimeout(() => {
      setTypingIndex((prev) => Math.min(prev + 1, currentText.length))
    }, 28)
    return () => window.clearTimeout(timeout)
  }, [isOpen, typingIndex, currentText.length])

  React.useEffect(() => {
    if (!isOpen) return
    if (typingIndex >= currentText.length) {
      setShowNext(true)
    } else {
      setShowNext(false)
    }
  }, [isOpen, typingIndex, currentText.length])

  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setTypingIndex(currentText.length)
      }
      if (event.key === 'Escape') {
        onSkip()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentText.length, onSkip])

  const handleComplete = () => setTypingIndex(currentText.length)
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setTypingIndex(0)
      setShowNext(false)
      onNext()
      return
    }
    onComplete()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="pointer-events-auto absolute inset-0 bg-black/72" onClick={onClose} />

      <div
        className={`relative max-w-md w-full rounded-lg border border-[var(--accent)] bg-[var(--surface)] shadow-xl transition-all duration-300 ${reducedMotion ? 'scale-98' : 'scale-95'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
      >
        <div className="border-b border-[var(--line)] px-5 py-3">
          <h2 id="tutorial-title" className="text-h3 font-medium text-[var(--text)]">
            {feature?.title ?? 'Tutorial'}
          </h2>
          <button
            onClick={onSkip}
            className="absolute right-2 top-2 text-[var(--muted)] hover:text-[var(--text)]"
            aria-label="Skip tutorial"
            type="button"
          >
            Skip
          </button>
        </div>

        <div className="px-5 pt-3">
          <p className="text-caption uppercase tracking-wider text-[var(--muted)]">
            {currentStep + 1} / {steps.length || 1}
          </p>
        </div>

        <h3 className="mt-2 text-center text-h3 font-medium text-[var(--text)]">
          {feature?.title ?? 'Tutorial'}
        </h3>

        <div className="flex-1 overflow-hidden px-5 py-4">
          <p className="text-dialog text-[var(--text)]">
            {currentText.slice(0, typingIndex)}{typingIndex < currentText.length ? '_' : ''}
          </p>
        </div>

        {avatar && (
          <div className="absolute left-2 top-2">
            <Avatar id={avatar.id as any} speaking={avatar.speaking !== false} size={32} />
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-[var(--line)] px-5 py-4">
          <button
            onClick={onSkip}
            className="flex-1 rounded-md bg-transparent px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)]"
            aria-label="Skip tutorial"
            type="button"
          >
            Skip
          </button>

          {showNext && (
            <button
              onClick={handleNext}
              className="flex-1 rounded-md bg-[var(--ok)] px-3 py-2 text-sm font-medium text-[var(--bg)] transition-colors"
              aria-label="Next step"
              type="button"
            >
              Next
            </button>
          )}
        </div>

        {feature && (
          <div className="px-5 pb-4 text-xs text-[var(--muted)]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(event) => setDontShowAgain(event.target.checked)}
                className="rounded border"
              />
              Don&apos;t show tutorials again
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

export function TutorialDialogStory() {
  const [feature] = React.useState({
    id: 'lobby_setup',
    title: 'Lobby Setup',
    trigger: 'lobby',
    steps: [
      { element: '[data-t=players]', text: 'Choose how many seats. 1 to 6 players.' },
      {
        element: '[data-t=duration]',
        text: '5, 10 or 15 minutes. The clock is real: a wave of layoffs starts at 70%.',
      },
    ],
  })

  return (
    <TutorialDialog
      feature={feature}
      isOpen={true}
      onClose={() => undefined}
      onNext={() => undefined}
      onSkip={() => undefined}
      onComplete={() => undefined}
    />
  )
}
