'use client'

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Display, Label, Body, BodyStrong, Caption } from '@/components/Typography'
import { Button } from '@/components/Button'
import { SegmentedControl } from '@/components/SegmentedControl'
import { Avatar } from '@/components/Avatar'

export type AvatarId = 'dev' | 'intern' | 'vp' | 'leet' | 'pm' | 'pe'

interface SeatChip {
  type: 'you' | 'occupied' | 'open'
  name?: string
}

interface LobbyState {
  players: number
  duration: '5' | '10' | '15'
  avatar: AvatarId | null
  host: boolean
}

const placeholderNames = ['10x_Dev', 'CoffeeBadger', 'FixerOfProd', 'PromotedToCustomer']

export default function LobbyPage({ initialState }: { initialState: LobbyState }) {
  const [state, setState] = useState<LobbyState>(initialState)
  const [alias, setAlias] = useState('')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string | null>(null)
  const [matchFit, setMatchFit] = useState('')

  // Validate alias (2-24 chars, no profanity - client-side placeholder)
  const validateAlias = (name: string): boolean => {
    return name.length >= 2 && name.length <= 24
  }

  // Generate code input with auto-uppercase
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase()
    // Remove non-alphanumeric except maybe dashes, but we want 6-char code
    value = value.replace(/[^A-Z0-9]/g, '')
    // Ensure exactly 6 chars from allowed alphabet (no 0/O/1/I/L)
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let filtered = ''
    for (const char of value) {
      if (alphabet.includes(char)) filtered += char
    }
    // Pad or truncate to 6
    if (filtered.length < 6) {
      const padChar = alphabet[0]
      filtered = filtered + padChar.repeat(6 - filtered.length)
    } else if (filtered.length > 6) {
      filtered = filtered.substring(0, 6)
    }
    setCode(filtered)
    setCodeError(null)
  }

  // Match Fit logic
  useEffect(() => {
    const players = state.players
    const duration = state.duration
    const totalSeats = players // 1-6
    
    // Check if combo is tight
    let caption = ''
    if (totalSeats === 6 && duration === '5') {
      caption = 'Likely decided by the clock.'
    } else if (totalSeats >= 5 && duration === '5') {
      caption = 'Clock may run out before Corner Office.'
    }
    setMatchFit(caption)
  }, [state.players, state.duration])

  // Segmented control handlers
  const handlePlayersChange = (value: string) => {
    setState(prev => ({ ...prev, players: parseInt(value) }))
  }

  const handleDurationChange = (value: string) => {
    setState(prev => ({ ...prev, duration: value as '5' | '10' | '15' }))
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-[880px] mx-auto p-4">
        {/* Two-column card, stacked on mobile */}
        <div className="bg-[var(--surface)] rounded-[var(--r-lg)] p-6 md:p-8 border border-[var(--line)] shadow-elevated">
          
          {/* (a) Alias input */}
          <div className="mb-6">
            <Label>Alias</Label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              maxLength={24}
              minLength={2}
              placeholder={placeholderNames[0]}
              className="w-full rounded-[var(--r-md)] px-4 py-3 bg-[var(--btn)] text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors placeholder-[var(--muted)]"
              disabled={!state.host}
              aria-label="Enter your alias (2-24 characters)"
              data-t="alias"
            />
            <Caption className="mt-2 text-[var(--muted)] small">
              2-24 characters. Server-side profanity filter applied.
            </Caption>
          </div>

          {/* (b) Players segmented control (host only) */}
          {!state.host && <p className="text-caption text-[var(--muted)] mb-4 font-medium">Host only</p>}
          <SegmentedControl
            items={[
              { value: '1', label: '1', disabled: !state.host },
              { value: '2', label: '2', disabled: !state.host },
              { value: '3', label: '3', disabled: !state.host },
              { value: '4', label: '4', disabled: !state.host },
              { value: '5', label: '5', disabled: !state.host },
              { value: '6', label: '6', disabled: !state.host },
            ]}
            value={state.players.toString()}
            onValueChange={handlePlayersChange}
            layoutId="players-control"
            reducedMotion={false}
          />

          {/* (c) Sprint length segmented control (host only) */}
          {!state.host && <p className="text-caption text-[var(--muted)] mb-4 font-medium">Host only</p>}
          <SegmentedControl
            items={[
              { value: '5', label: '5 min "Standup Fire Drill"' },
              { value: '10', label: '10 min "Sprint Review"' },
              { value: '15', label: '15 min "Post-Mortem Sync"' },
            ]}
            value={state.duration}
            onValueChange={handleDurationChange}
            layoutId="duration-control"
            reducedMotion={false}
          />

          {/* (d) Match Fit caption */}
          {matchFit && (
            <div className="mt-4 p-3 rounded-[var(--r-md)] bg-[var(--warn)] text-[var(--warn)] text-center text-sm">
              {matchFit}
            </div>
          )}

          {/* (e) Always-visible mono rules note */}
          <div className="mt-6 p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] text-[var(--muted)] text-sm">
            <BodyStrong as="span">First to the Corner Office wins instantly.</BodyStrong> If the clock hits zero, highest valuation wins.
          </div>

          {/* (f) Character select */}
          <div className="mt-6">
            <Label>Character</Label>
            <div className="grid grid-cols-6 gap-2 grid-rows-2 gap-4">
              {['dev', 'intern', 'vp', 'leet', 'pm', 'pe'].map((id) => (
                <Avatar
                  key={id}
                  id={id as any}
                  size={32}
                  style={{ cursor: 'pointer' }}
                  onPointerEnter={(e) => {
                    // Lift effect on hover
                    const avatar = e.currentTarget as SVGSVGElement
                    avatar.style.transform = 'translateY(-4px)'
                  }}
                  onPointerLeave={(e) => {
                    const avatar = e.currentTarget as SVGSVGElement
                    avatar.style.transform = 'translateY(0)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* (g) Seat chips */}
          <div className="mt-6">
            <Label>Seats</Label>
            <div className="grid grid-cols-7 gap-2 mt-2">
              {/* You seat - always first */}
              <span className={`px-3 py-1 rounded-[var(--r-md)] ${state.avatar === 'dev' ? 'bg-[var(--ok)] text-[var(--bg)]' : 'bg-[var(--surface-2)] text-[var(--muted)]'}`} aria-label="You">
                ●
              </span>
              {/* Other occupied seats */}
              <span key="1" className="px-3 py-1 rounded-[var(--r-md)] bg-[var(--surface-2)] text-[var(--muted)]" aria-label="CoffeeBadger">● CoffeeBadger</span>
              <span key="2" className="px-3 py-1 rounded-[var(--r-md)] bg-[var(--surface-2)] text-[var(--muted)]" aria-label="FixerOfProd">● FixerOfProd</span>
              <span key="3" className="px-3 py-1 rounded-[var(--r-md)] bg-[var(--surface-2)] text-[var(--muted)]" aria-label="PromotedToCustomer">● PromotedToCustomer</span>
              {/* Open seats */}
              <span key="4" className="px-3 py-1 rounded-[var(--r-md)] bg-[var(--surface-2)] opacity-50" aria-label="open">○</span>
              <span key="5" className="px-3 py-1 rounded-[var(--r-md)] bg-[var(--surface-2)] opacity-50" aria-label="open">○</span>
              <span key="6" className="px-3 py-1 rounded-[var(--r-md)] bg-[var(--surface-2)] opacity-50" aria-label="open">○</span>
            </div>
          </div>

          {/* (h) Buttons */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="lg"
              data-t="invite"
              onClick={() => {}}
              className="flex-1"
            >
              Copy Invite Link
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={!state.host}
              className="flex-1"
              title={!state.host ? 'Host only' : 'Starting in 3-2-1...'}
            >
              {state.host ? 'Start Sprint' : 'Waiting for host'}
            </Button>
          </div>
        </div>

        {/* Live board preview line */}
        <div className="mt-8 p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] text-[var(--muted)] flex items-center justify-between">
          <span>7x7 (49 squares) · Series-B Feature Factory</span>
          <span className="text-caption" data-t="preview">Room code: K7QX2M</span>
        </div>
      </div>
    </div>
  )
}