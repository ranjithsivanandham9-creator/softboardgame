'use client'

import * as React from 'react'
import { FocusModal } from '@/components/FocusModal'

export interface DrawCardProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isGrowth: boolean
  onBuy?: () => void
  onPass?: () => void
}

export function DrawCard({ isOpen, onOpenChange, isGrowth, onBuy, onPass }: DrawCardProps) {
  const [typingIndex, setTypingIndex] = React.useState(0)
  const fullText = isGrowth
    ? 'Growth card: New opportunity on the horizon. Embrace the change and position yourself for success.'
    : 'Downsizing card: Role elimination announced. Review your RSU position and options.'

  React.useEffect(() => {
    if (typingIndex >= fullText.length) return
    const timeout = window.setTimeout(() => {
      setTypingIndex((prev) => Math.min(prev + 1, fullText.length))
    }, 28)
    return () => window.clearTimeout(timeout)
  }, [typingIndex, fullText.length])

  const handleComplete = () => setTypingIndex(fullText.length)

  return (
    <FocusModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={isGrowth ? 'Draw Card: Growth' : 'Draw Card: Downsizing'}
      onBuy={() => onBuy?.()}
      onPass={() => onPass?.()}
    >
      <div className="space-y-4">
        <p className="text-dialog text-[var(--text)]">{fullText.slice(0, typingIndex)}{typingIndex < fullText.length ? '_' : ''}</p>
        <p className="cursor-pointer text-caption text-[var(--muted)]" onClick={handleComplete}>
          Tap to complete
        </p>
      </div>
    </FocusModal>
  )
}
