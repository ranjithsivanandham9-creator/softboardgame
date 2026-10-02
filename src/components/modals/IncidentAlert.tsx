'use client'

import * as React from 'react'
import { FocusModal } from '@/components/FocusModal'

export interface IncidentAlertProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  catalyst: string
  target: string
  fallout: string
  affectedPlayer?: string
}

export function IncidentAlert({
  isOpen,
  onOpenChange,
  catalyst,
  target,
  fallout,
  affectedPlayer,
}: IncidentAlertProps) {
  const [typingIndex, setTypingIndex] = React.useState(0)
  const fullText = `Incident Alert! ${catalyst} ${target}, ${fallout}`

  React.useEffect(() => {
    if (typingIndex >= fullText.length) return
    const timeout = window.setTimeout(() => {
      setTypingIndex((prev) => Math.min(prev + 1, fullText.length))
    }, 22)
    return () => window.clearTimeout(timeout)
  }, [typingIndex, fullText.length])

  const handleComplete = () => setTypingIndex(fullText.length)

  return (
    <FocusModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Incident Alert"
      incidentText={typingIndex >= fullText.length ? fullText : ''}
      onAcknowledge={() => {
        setTypingIndex(fullText.length)
        onOpenChange(false)
      }}
      onBuy={() => onOpenChange(false)}
      onPass={() => onOpenChange(false)}
    >
      <div className="space-y-4">
        <p className="text-dialog text-[var(--text)]">
          {fullText.slice(0, typingIndex)}{typingIndex < fullText.length ? '_' : ''}
        </p>

        <p className="cursor-pointer text-caption text-[var(--muted)]" onClick={handleComplete}>
          Tap to complete
        </p>

        {affectedPlayer && (
          <p className="text-caption text-[var(--muted)]">
            {affectedPlayer} looks {'shocked'}
          </p>
        )}
      </div>
    </FocusModal>
  )
}
