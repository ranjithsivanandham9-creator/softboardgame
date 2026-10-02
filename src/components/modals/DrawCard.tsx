'use client'

import * as React from 'react'
import { FocusModal } from '@/components/FocusModal'
import { useState, useEffect, useRef } from 'react'

export interface DrawCardProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isGrowth: boolean
  onBuy?: () => void
  onPass?: () => void
}

export function DrawCard({ isOpen, onOpenChange, isGrowth, onBuy, onPass }: DrawCardProps) {
  const [typingIndex, setTypingIndex] = useState(0)
  const fullText = isGrowth
    ? 'Growth card: New opportunity on the horizon. Embrace the change and position yourself for success.'
    : 'Downsizing card: Role elimination announced. Review your RSU position and options.'

  textRef = React.createRef<string>()

  // Typing animation: 28ms per character for tutorial dialogue
  React.useEffect(() => {
    if (typingIndex < fullText.length) {
      setTypingIndex(prev => prev + 1)
      const timeout = setTimeout(arguments.callee, 28)
      return () => clearTimeout(timeout)
    }
  }, [typingIndex])

  // Complete on tap
  const handleComplete = () => {
    setTypingIndex(fullText.length)
  }

  const textRef = useRef<string>('')

  return (
    <FocusModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={isGrowth ? 'Draw Card: Growth' : 'Draw Card: Downsizing'}
      onBuy={() => onBuy?.()}
      onPass={() => onPass?.()}
    >
      <div className="space-y-4">
        <p className="text-dialog text-[var(--text)]">
          {showTyping ? (
            <span ref={textRef} />
          ) : (
            <span>{fullText.slice(0, typingIndex)}{'_'}</span>
          )}
        </p>
        <p className="text-caption text-[var(--muted)] cursor-pointer" onClick={handleComplete}>
          Tap to complete
        </p>
      </div>
    </FocusModal>
  )
}