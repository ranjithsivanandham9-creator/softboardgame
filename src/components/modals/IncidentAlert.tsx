'use client'

import * as React from 'react'
import { FocusModal } from '@/components/FocusModal'
import { useState, useEffect, useRef } from 'react'

export interface IncidentAlertProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  catalyst: string
  target: string
  fallout: string
  affectedPlayer?: string
}

export function IncidentAlert({ isOpen, onOpenChange, catalyst, target, fallout, affectedPlayer }: IncidentAlertProps) {
  const [incidentText, setIncidentText] = useState<string>('')
  const [typingIndex, setTypingIndex] = useState(0)
  const [showProgress, setShowProgress] = useState(false)
  const textRef = useRef<string>('')

  // Assemble incident text: "Incident Alert! [catalyst] [target], [fallout]"
  const fullText = `Incident Alert! ${catalyst} ${target}, ${fallout}`
  textRef.current = fullText

  // Typing animation: 22ms per character
  React.useEffect(() => {
    if (typingIndex < fullText.length) {
      setTypingIndex(prev => prev + 1)
      const timeout = setTimeout(arguments.callee, 22)
      return () => clearTimeout(timeout)
    }
  }, [typingIndex])

  // Complete typing when reaching end
  React.useEffect(() => {
    if (typingIndex >= fullText.length) {
      setShowProgress(true)
    }
  }, [typingIndex])

  // Tap to complete
  const handleComplete = () => {
    setTypingIndex(fullText.length)
  }

  // Avatar reaction
  useEffect(() => {
    // In a real app, this would update the avatar state
    console.log('Avatar reaction:', affectedPlayer ? 'shock' : 'happy')
  }, [affectedPlayer])

  return (
    <FocusModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Incident Alert"
      incidentText={showProgress ? fullText : ''}
      onAcknowledge={() => {
        setTypingIndex(fullText.length)
        onOpenChange(false)
      }}
      onBuy={() => onOpenChange(false)}
      onPass={() => onOpenChange(false)}
    >
      {/* Typing-animated body */}
      <div className="space-y-4">
        {/* Incident text - appears via typing animation */}
        <p className="text-dialog text-[var(--text)]">
          {showProgress ? (
            <span ref={textRef} />
          ) : (
            <span>{fullText.slice(0, typingIndex)}{'_'}</span>
          )}
        </p>

        {/* Tap to complete instruction */}
        <p className="text-caption text-[var(--muted)] cursor-pointer" onClick={handleComplete}>
          Tap to complete
        </p>

        {/* Avatar reaction */}
        {affectedPlayer && (
          <p className="text-caption text-[var(--muted)]">
            {affectedPlayer} looks {'shocked'}
          </p>
        )}
      </div>
    </FocusModal>
  )
}