'use client'

import * as React from 'react'
import { Avatar } from '@/components/Avatar'
import { useState, useEffect, useRef } from 'react'

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
  const [showSkip, setShowSkip] = React.useState(true)
  const [dontShowAgain, setDontShowAgain] = React.useState(false)
  const textRef = useRef<string>('')

  // Feature steps data
  const steps = feature?.steps ?? []

  // Typing animation: 28ms per character for tutorial dialogue
  useEffect(() => {
    if (typingIndex < steps[currentStep]?.text.length && currentStep < steps.length) {
      setTypingIndex(prev => prev + 1)
      const timeout = setTimeout(arguments.callee, 28)
      return () => clearTimeout(timeout)
    }
  }, [typingIndex, currentStep])

    // Next enabled after typing ends
  useEffect(() => {
    if (typingIndex >= steps[currentStep]?.text.length) {
      setShowNext(true)
    }
  }, [typingIndex])

  // Handle complete (tap or space)
  const handleComplete = () => {
    setTypingIndex(steps[currentStep]?.text.length ?? 0)
    setShowNext(false)
  }

  // KeyDown handler for Enter/Space/Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleComplete()
      }
      if (e.key === 'Escape') {
        onSkip()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Avatar in corner
  const avatarElement = avatar ? (
    <Avatar
      id={avatar.id}
      speaking={avatar.speaking !== false}
      size={32}
      className="absolute top-2 left-2"
    />
  ) : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      onClick={onClose}
    >
      {/* Dim background */}
      <div className="absolute inset-0 bg-black/72 pointer-events-auto" onClick={onClose} />

      {/* Dialog box */}
      <div
        className={`relative bg-[var(--surface)] rounded-lg border border-[var(--accent)] shadow-xl max-w-md w-full transform scale-95 transition-all duration-300 ${reducedMotion ? 'scale-98' : ''}` }
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-[var(--line)]">
          <h2 id="tutorial-title" className="text-h3 font-medium text-[var(--text)]">
            {feature?.title ?? 'Tutorial'}
          </h2>
          <button
            onClick={onSkip}
            className="absolute right-2 text-[var(--muted)] hover:text-[var(--text)]"
            aria-label="Skip tutorial"
          >
            Skip
          </button>
        </div>

        {/* Step counter */}
        <div className="px-5 pt-3">
          <p className="text-caption uppercase tracking-wider text-[var(--muted)]">
            {currentStep + 1} / {steps.length}
          </p>
        </div>

        {/* Title */}
        <h3 id="tutorial-title" className="text-h3 font-medium text-[var(--text)] mt-2 text-center">
          {feature?.title ?? 'Tutorial'}
        </h3>

        {/* Typing-animated body */}
        <div className="px-5 py-4 flex-1 overflow-hidden">
          <p className="text-dialog text-[var(--text)]">
            {showNext || typingIndex < (steps[currentStep]?.text.length ?? 0) ? (
              // Show typed text or full text
              typingIndex < (steps[currentStep]?.text.length ?? 0)
                ? steps[currentStep]?.text?.slice(0, typingIndex) ?? ''
                : steps[currentStep]?.text ?? ''
            ) : (
              <span>{steps[currentStep]?.text ?? ''}{'_'}</span>
            )}
          </p>
        </div>

        {/* Avatar in corner */}
        {avatarElement}

        {/* Buttons */}
        <div className="px-5 py-4 border-t border-[var(--line)] flex justify-end gap-2">
          <button
            onClick={onSkip}
            disabled={!showNext}
            className="flex-1 rounded-md px-3 py-2 text-sm text-[var(--muted)] bg-transparent hover:bg-[var(--surface-2)] transition-colors skip ghost"
            aria-label="Skip tutorial"
          >
            Skip
          </button>
          {showNext && (
            <button
              onClick={onNext}
              disabled={typingIndex < (steps[currentStep]?.text.length ?? 0)}
              className="flex-1 rounded-md px-3 py-2 text-sm font-medium bg-[var(--ok)] text-[var(--bg)] transition-colors"
              aria-label="Next step"
            >
              Next
            </button>
          )}
        </div>

        {/* Don't show again checkbox */}
        {feature && (
          <div className="px-5 pt-2 text-xs text-[var(--muted)]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={e => setDontShowAgain(e.target.checked)}
                className="rounded border"
              />
              Don't show tutorials again
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

// Storybook stories
if (typeof window !== 'undefined' && window.__STORYBOOK__) {
  export function TutorialDialogStory() {
    const [feature, setFeature] = React.useState({
      id: 'lobby_setup',
      title: 'Lobby Setup',
      steps: [
        {
          element: '[data-t=players]',
          text: 'Choose how many seats. 1 to 6 players.',
        },
        {
          element: '[data-t=duration]',
          text: '5, 10 or 15 minutes. The clock is real: a wave of layoffs starts at 70%.',
        },
      ],
    })

    return (
      <div>
        <TutorialDialog
          feature={feature}
          isOpen={true}
          onClose={() => console.log('Closed')}
          onNext={() => console.log('Next')}
          onSkip={() => console.log('Skipped')}
          onComplete={() => console.log('Complete')}
          avatar={{ id: 'dev', speaking: true }}
        />
      </div>
    )
  }
}