'use client'

import * as React from 'react'
import { Avatar } from '@/components/Avatar'
import { Display, Label, Body, BodyStrong, Caption } from '@/components/Typography'
import { Button } from '@/components/Button'
import { useTonAnimation } from '@/lib/count-up'
import { useHaptics } from '@/lib/haptics'

export type ResultRank = 'first' | 'second' | 'third' | 'fourth' | 'fifth' | 'sixth'

export type VictoryReason = 'corner-office' | 'highest-valuation' | 'last-standing'

interface PlayerResult {
  id: 'dev' | 'intern' | 'vp' | 'leet' | 'pm' | 'pe'
  rank: ResultRank
  finalValuation: number
  rsu: number
  eliminated: boolean
  victoryReason?: VictoryReason
}

interface ResultsScreenProps {
  players: PlayerResult[]
  onRematch: () => void
  onNewRoom: () => void
}

export function ResultsScreen({ players, onRematch, onNewRoom }: ResultsScreenProps) {
  const [displayValuation, setDisplayValuation] = React.useState(0)
  const [showShare, setShowShare] = React.useState(false)
  const [winnerAnimations, setWinnerAnimations] = React.useState<Map<ResultRank, boolean>>(new Map())

  // Animated count-up for final valuations
  React.useEffect(() => {
    players.forEach(player => {
      const endValue = player.finalValuation
      if (player.eliminated) return

      const animatedValue = useTonAnimation(endValue, {
        duration: 2000,
        separator: ',',
      })
      setDisplayValuation(prev => {
        // Update the display for this player
        return animatedValue
      })
    })
  }, [players])

  // Determine winner and victory reason
  const winner = players.find(p => !p.eliminated && p.rank === 'first')
  const victoryReason: VictoryReason = winner
    ? 'corner-office'
    : players.some(p => !p.eliminated) 
      ? 'highest-valuation' 
      : 'last-standing'

  // Trigger haptics for winner
  useEffect(() => {
    const haptic = navigator.vibrate
    if (haptic && winner) {
      haptic([12, 40, 12]) // success pattern
    }
  }, [winner])

  // Share card toggle
  const toggleShare = () => setShowShare(prev => !prev)

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-[880px] mx-auto p-4">
        
        {/* Winner announcement */}
        {winner && (
          <div className="mb-8 text-center">
            <Display>#{winner.rank}</Display>
            <p className="text-h1 mt-2">Victory!</p>
            <p className="text-body-strong mt-1">
              {winner.victoryReason === 'corner-office' 
                ? 'Reached the Corner Office'
                : winner.victoryReason === 'highest-valuation'
                  ? `Highest valuation at ${new Date().toLocaleTimeString()}`
                  : 'Last one standing'
              }
            </p>
          </div>
        )}

        {/* Ranked list with avatar reactions */}
        <div className="space-y-4 mb-8">
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center gap-4">
              {/* Avatar with emotion reaction */}
              <Avatar
                id={player.id}
                emotion={player.eliminated ? 'laid_off' : index === 0 ? 'win' : 'shock'}
                size={48}
                style={{ transform: winnerAnimations.get(player.rank) ? 'scale(1.1)' : 'scale(1)' }}
              />
              
              {/* Rank info */}
              <div className="flex-1">
                <p className="text-body-strong">
                  {player.rank}: {avatarNames[player.id]}
                </p>
                {player.eliminated && (
                  <p className="text-caption text-[var(--muted)]">
                    Laid off - desaturated with cardboard box
                  </p>
                }
              </div>

              {/* Final valuation */}
              <p className="text-sm text-[var(--muted)] ml-4">
                Valuation: {displayValuation > 0 ? displayValuation : player.finalValuation}
              </p>
            </div>
          ))}
        </div>

        {/* Win reason line */}
        {winner && (
          <p className="text-caption text-[var(--muted)] text-center mb-8">
            {winner.victoryReason === 'corner-office'
              ? 'Corner Office Conquest'
              : winner.victoryReason === 'highest-valuation'
                ? 'Highest valuation at 00:00'
                : 'Last one standing'}
          </p>
        )}

        {/* Award badges */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] text-center">
            <p className="text-caption">Most PIPs Survived</p>
            <p className="text-h3 font-medium mt-2">+60 RSUs</p>
          </div>
          <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] text-center">
            <p className="text-caption">Biggest Tech Debt Landlord</p>
            <p className="text-h3 font-medium mt-2">×2 Fees</p>
          </div>
        </div>

        {/* Share card */}
        <div className="mb-8">
          <p className="text-body-strong mb-2">Share Results</p>
          <button
            onClick={toggleShare}
            className="w-full rounded-md px-4 py-2 bg-[var(--btn)] text-[var(--text)] transition-colors hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Copy summary card
          </button>
        </p>

        {/* Share card image preview (1080x1080) */}
        {showShare && (
          <div className="mt-8 rounded-full overflow-hidden bg-[var(--surface-2)]">
            <img
              src="/share-card-template.svg"
              alt="PIP Roulette Results Summary"
              className="w-full h-64 object-cover"
              style={{ width: '1080', height: '1080' }}
            />
            <p className="text-caption text-center py-4">Shareable 1080x1080 summary card</p>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-8 flex gap-3 justify-center">
        <Button variant="primary" onClick={onRematch}>Rematch</Button>
        <Button variant="secondary" onClick={onNewRoom}>Launch New Startup Room</Button>
      </div>
    </div>
  )
}

// Helper: map avatar IDs to names
const avatarNames: Record<'dev' | 'intern' | 'vp' | 'leet' | 'pm' | 'pe', string> = {
  dev: 'The Burned-Out Dev',
  intern: 'The Grindset Intern',
  vp: 'The Buzzword VP',
  leet: 'The Leetcode Maxxer',
  pm: 'The Vibe-Coding PM',
  pe: 'Principal Eng Who Left in 2019',
}

// Hook: animated count-up using tone.js
function useTonAnimation(target: number, config: { duration: number; separator: string }) {
  // Simple count-up animation
  const [current, setCurrent] = React.useState(0)
  
  React.useEffect(() => {
    const start = performance.now()
    const duration = config.duration
    
    const animate = () => {
      const elapsed = performance.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const current = Math.round(target * eased)
      setCurrent(current)
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  }, [target])
  
  return current
}

// Storybook stories
if (typeof window !== 'undefined' && window.__STORYBOOK__) {
  export const ResultsStory = () => {
    const players = [
      { id: 'dev', rank: 'first' as const, finalValuation: 1840, eliminated: false },
      { id: 'intern', rank: 'second' as const, finalValuation: 1200, eliminated: false },
      { id: 'vp', rank: 'third' as const, finalValuation: 950, eliminated: false },
      { id: 'leet', rank: 'fourth' as const, finalValuation: 500, eliminated: true },
      { id: 'pm', rank: 'fifth' as const, finalValuation: 300, eliminated: true },
      { id: 'pe', rank: 'sixth' as const, finalValuation: 100, eliminated: true },
    ]
    
    return (
      <ResultsScreen
        players={players}
        onRematch={() => console.log('Rematch')}
        onNewRoom={() => console.log('New room')}
      />
    )
  }
}