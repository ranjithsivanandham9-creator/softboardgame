'use client'

import * as React from 'react'
import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { cn } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'

export type AvatarId = 'dev' | 'intern' | 'vp' | 'leet' | 'pm' | 'pe'

const avatarNames: Record<AvatarId, string> = {
  dev: 'The Burned-Out Dev',
  intern: 'The Grindset Intern',
  vp: 'The Buzzword VP',
  leet: 'The Leetcode Maxxer',
  pm: 'The Vibe-Coding PM',
  pe: 'Principal Eng Who Left in 2019',
}

const avatarTags: Record<AvatarId, string> = {
  dev: 'Sleeps through standup',
  intern: 'Wakes up at 4am and tells everyone',
  vp: 'Let\'s circle back',
  leet: 'Reverses trees for fun',
  pm: 'Ships prompts, not code',
  pe: 'Still gets pinged on vacation',
}

const avatarColors: Record<AvatarId, string> = {
  dev: '#3B2F5E',
  intern: '#12483B',
  vp: '#42324F',
  leet: '#4A2530',
  pm: '#3E3A1E',
  pe: '#173B4D',
}

// Simulated claimed state - in real app this comes from socket
const claimedState: Record<AvatarId, { claimed: boolean;claimer?: string }> = {
  dev: { claimed: false },
  intern: { claimed: false },
  vp: { claimed: false },
  leet: { claimed: false },
  pm: { claimed: false },
  pe: { claimed: false },
}

export function CharacterSelect({ onSelect }: { onSelect: (id: AvatarId) => void }) {
  const [selectedId, setSelectedId] = useState<AvatarId | null>(null)
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 })
  const [isGrabbing, setIsGrabbing] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<(HTMLDivElement | null)[]>([])
  
  const avatars: AvatarId[] = ['dev', 'intern', 'vp', 'leet', 'pm', 'pe']

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        const currentIndex = avatars.indexOf(selectedId ?? avatars[0])
        const newIndex = (currentIndex - 1 + avatars.length) % avatars.length
        setSelectedId(avatars[newIndex])
      } else if (e.key === 'ArrowRight') {
        const currentIndex = avatars.indexOf(selectedId ?? avatars[0])
        const newIndex = (currentIndex + 1) % avatars.length
        setSelectedId(avatars[newIndex])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId])

  // Pointer tracking for face rig
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      setPointerPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  // Confetti effect on selection
  const triggerConfetti = (id: AvatarId) => {
    // Create confetti squares
    const colors = ['#3B2F5E', '#F1C9A5', '#D9A47A', '#C68B63', '#F3D2B5', '#E2AE86']
    const color = colors[avatars.indexOf(id)]
    
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const square = document.createElement('div')
        square.style.position = 'fixed'
        square.style.width = '8px'
        square.style.height = '8px'
        square.style.background = color
        square.style.opacity = '0.8'
        square.style.left = `${pointerPos.x}px`
        square.style.top = `${pointerPos.y}px`
        square.style.animation = 'confetti 600ms ease-out forwards'
        square.style.pointerEvents = 'none'
        document.body.appendChild(square)
        
        setTimeout(() => square.remove(), 600)
      }, i * 50)
    }
  }

  // Handle thumbnail click/selection
  const handleThumbnailClick = (id: AvatarId) => {
    // Check if already claimed
    if (claimedState[id].claimed) {
      // Tiny shake on tap for claimed avatars
      const avatarEl = document.querySelector(`#avatar-${id}`) as HTMLElement | null
      if (avatarEl) {
        avatarEl.style.transform = 'translateX(-4px) scale(0.95)'
        setTimeout(() => {
          avatarEl.style.transform = ''
        }, 100)
      }
      return
    }

    // Select avatar (first-write-wins)
    setSelectedId(id)
    triggerConfetti(id)
    onSelect(id)
  }

  // Avatar selection behavior
  const avatarOnPointerMove = (id: AvatarId, e: React.PointerEvent) => {
    const avatarEl = document.querySelector(`#avatar-${id}`) as HTMLElement | null
    if (!avatarEl) return

    // Lift thumbnail
    avatarEl.style.transform = 'translateY(-4px) scale(1.05)'

    // Face looks at cursor
    const rect = avatarEl.getBoundingClientRect()
    const cursorX = e.clientX - rect.left - rect.width / 2
    const cursorY = e.clientY - rect.top - rect.height / 2

    // Max 3px x, 2px y movement
    const moveX = Math.max(-3, Math.min(3, cursorX / 50))
    const moveY = Math.max(-2, Math.min(2, cursorY / 50))

    avatarEl.style.transform = `translateY(-4px) scale(1.05) translate(${moveX}px, ${moveY}px)`
  }

  const avatarOnPointerLeave = (id: AvatarId) => {
    const avatarEl = document.querySelector(`#avatar-${id}`) as HTMLElement | null
    if (!avatarEl) return
    avatarEl.style.transform = ''
  }

  // Check if avatar is claimed
  const isClaimed = (id: AvatarId) => claimedState[id].claimed
  const freeAvatars = avatars.filter(id => !isClaimed(id))
  const previewId = freeAvatars[0] || avatars[0]
  const previewName = avatarNames[previewId]
  const previewTag = avatarTags[previewId]

  // All six must fit in one row on 360px screen - they will, they're 96x96 scaled down

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-[880px] mx-auto p-4">
        
        {/* Large preview centered */}
        <div className="text-center mb-8">
          {selectedId && claimedState[selectedId].claimed ? (
            <div className="relative">
              <div
                style={{ transform: isClaimed(selectedId) ? 'scale(0.4) grayscale(40%)' : 'scale(1)' }}
                aria-grabbed={isClaimed(selectedId)}
              >
                <Avatar id={selectedId} emotion="idle" size={280} />
              </div>
              {isClaimed(selectedId) && (
                <div className="absolute top-2 right-2 bg-[var(--bad)] text-[var(--bg)] text-xs rounded-[var(--r-sm)] px-2 py-1">
                  Locked
                </div>
              )}
              {!isClaimed(selectedId) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Reset selection if clicking on selected
                    setSelectedId(null)
                  }}
                  aria-label="Deselect"
                >
                  ✕
                </Button>
              )}
            </div>
          ) : (
            <div>
              {/* Avatar preview - centered */}
              <div className="relative mx-auto mb-6">
                <Avatar
                  id={previewId}
                  emotion="idle"
                  size={280}
                  speaking={false}
                />
                <h3 className="text-h3 mt-3 text-inter-800 tracking-[-0.02em] text-[var(--text)]">
                  {previewName}
                </h3>
                <span className="text-body-strong text-[var(--muted)]">
                  {previewTag}
                </span>
              </div>
            </div>
          )}

          {/* Row of six thumbnails */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-start">
            {avatars.map((id, index) => {
              const isSelected = selectedId === id
              const isClaimedLocal = isClaimed(id)
              const name = avatarNames[id]
              const tag = avatarTags[id]
              
              return (
                <div
                  key={id}
                  className={cn(
                    'w-16 h-20 rounded-[var(--r-md)] overflow-flex avatar-thumbnail',
                    isSelected && '--ok neon rim',
                    isClaimedLocal && 'grayscale(40%) opacity-40 not-focusable',
                    'group'
                  )}
                  style={{ flexShrink: '0' }}
                  aria-describedby={`avatar-desc-${id}`}
                  role="button"
                  tabIndex={isClaimedLocal ? -1 : 0}
                  onPointerEnter={(e) => avatarOnPointerMove(id, e)}
                  onPointerLeave={() => avatarOnPointerLeave(id)}
                  onPointerDown={() => handleThumbnailClick(id)}
                >
                  <div style={{ transform: isSelected ? 'scale(1.1)' : 'scale(1)' }}>
                    <Avatar id={id} emotion="idle" size={64} speaking={false} />
                  </div>
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-caption text-[var(--muted)] text-xs">
                    {name}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selection confirmation */}
          {selectedId && !isClaimed(selectedId) && (
            <div className="mt-6 p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] text-center">
              <p className="text-h3 text-inter-800 tracking-[-0.02em] text-[var(--text)]">
                Selected: {avatarNames[selectedId]}
              </p>
              <p className="text-body-strong mt-2 text-[var(--muted)]">
                {avatarTags[selectedId]}
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  // Confirm selection
                  triggerConfetti(selectedId)
                  setSelectedId(null)
                }}
                disabled
              >
                Ready
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// Storybook stories
export const CharacterSelectStory = () => {
  const [selected, setSelected] = React.useState<AvatarId | null>(null)
  return <CharacterSelect onSelect={setSelected} />
}

export const WithSelections = () => {
  const [selected, setSelected] = React.useState<AvatarId | null>(null)
  const claimedMock = {
    dev: { claimed: true, claimer: 'CoffeeBadger' },
    intern: { claimed: false },
    vp: { claimed: false },
    leet: { claimed: false },
    pm: { claimed: false },
    pe: { claimed: false },
  }

  ;(claimedState as any).dev = claimedMock.dev
  ;(claimedState as any).intern = claimedMock.intern
  ;(claimedState as any).vp = claimedMock.vp
  ;(claimedState as any).leet = claimedMock.leet
  ;(claimedState as any).pm = claimedMock.pm
  ;(claimedState as any).pe = claimedMock.pe

  return <CharacterSelect onSelect={setSelected} />
}
