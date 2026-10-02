'use client'

import * as React from 'react'
import { useRef } from 'react'
import { Button } from '@/components/Button'

export interface AdvertiseModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    startupName: string
    websiteUrl: string
    workEmail: string
    budget: number
  }) => void
}

export function AdvertiseModal({ isOpen, onOpenChange, onSubmit }: AdvertiseModalProps) {
  const [formData, setFormData] = React.useState({
    startupName: '',
    websiteUrl: '',
    workEmail: '',
    budget: 1000,
  })
  const [status, setStatus] = React.useState<'idle' | 'verifying' | 'sent'>('idle')
  const [showHoneypot, setShowHoneypot] = React.useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Honeypot - hidden field that should remain empty
  React.useEffect(() => {
    setShowHoneypot(formRef.current?.querySelector('input[name="bot"]') !== null)
  }, [])

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Honeypot check - if bot filled the hidden field, reject
    if (showHoneypot) {
      setStatus('sent') // Still show success to avoid revealing bot detection
      setTimeout(() => setStatus('idle'), 2000)
      return
    }
    
    setStatus('verifying')
    onSubmit(formData)
    setStatus('sent')
    setTimeout(() => {
      onOpenChange(false)
      setStatus('idle')
    }, 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative rounded-lg bg-white p-6 shadow-xl max-w-md w-full transform scale-95 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Startup name */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1">
              Startup name (max 60 chars)
            </label>
            <input
              type="text"
              value={formData.startupName}
              onChange={(e) => setFormData({ ...formData, startupName: e.target.value.trim() })}
              maxLength={60}
              className="w-full rounded-md px-3 py-2 bg-[var(--btn)] text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              required
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1">
              Website URL (must be https://)
            </label>
            <input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              placeholder="https://"
              pattern="^https://.+$"
              className="w-full rounded-md px-3 py-2 bg-[var(--btn)] text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              required
            />
          </div>

          {/* Work email */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1">
              Work email
            </label>
            <input
              type="email"
              value={formData.workEmail}
              onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
              className="w-full rounded-md px-3 py-2 bg-[var(--btn)] text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              required
            />
          </div>

          {/* Budget slider */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1">
              Budget ${formData.budget}-$5,000/month
            </label>
            <input
              type="range"
              min={1000}
              max={5000}
              step={100}
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              className="w-48 accent-[var(--accent)]"
            />
            <span className="text-sm">{formData.budget}/month</span>
          </div>

          {/* Honeypot - hidden from humans, shown to bots */}
          {showHoneypot && (
            <input
              type="text"
              name="bot"
              className="hidden"
              onFocus={() => setStatus('sent')}
            />
          )}

          {/* Status */}
          {status === 'verifying' && (
            <p className="text-caption text-[var(--muted)]">Verifying...</p>
          )}

          {/* Submit button */}
          <Button variant="primary" type="submit" disabled={status === 'verifying'}>
            {status === 'verifying' ? 'Verifying...' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  )
}