'use client'

import * as React from 'react'
import { Avatar } from '@/components/Avatar'
import { Display, Body, BodyStrong, Caption } from '@/components/Typography'
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

function ResultsPlayerRow({
  player,
  index,
  winner,
}: {
  player: PlayerResult
  index: number
  winner?: PlayerResult
}) {
  const animatedValuation = useTonAnimation(player.finalValuation, {
    duration: 2000,
    separator: ',',
  })

  return (
    <div key={player.id} className="flex items-center gap-4 rounded-[var(--r-md)] bg-[var(--surface)] p-3">
      <Avatar
        id={player.id}
        emotion={player.eliminated ? 'laid_off' : index === 0 ? 'win' : 'shock'}
        size={48}
        style={{ transform: winner?.id === player.id ? 'scale(1.1)' : 'scale(1)' }}
      />

      <div className="flex-1">
        <BodyStrong className="block">
          {player.rank}: {avatarNames[player.id]}
        </BodyStrong>
        {player.eliminated && (
          <Caption className="text-[var(--muted)]">
            Laid off - desaturated with cardboard box
          </Caption>
        )}
      </div>

      <Body className="ml-4 text-[var(--muted)]">
        Valuation: {animatedValuation > 0 ? animatedValuation : player.finalValuation}
      </Body>
    </div>
  )
}

export function ResultsScreen({ players, onRematch, onNewRoom }: ResultsScreenProps) {
  const { triggerVibrate } = useHaptics()
  const [showShare, setShowShare] = React.useState(false)
  const winner = players.find(p => !p.eliminated && p.rank === 'first')

  React.useEffect(() => {
    if (winner) {
      triggerVibrate('success')
    }
  }, [winner, triggerVibrate])

  const toggleShare = () => setShowShare(prev => !prev)

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-[880px] mx-auto p-4">
        {winner && (
          <div className="mb-8 text-center">
            <Display>#{winner.rank}</Display>
            <Body className="text-h1 mt-2">Victory!</Body>
            <BodyStrong className="mt-1 block">
              {winner.victoryReason === 'corner-office'
                ? 'Reached the Corner Office'
                : winner.victoryReason === 'highest-valuation'
                  ? `Highest valuation at ${new Date().toLocaleTimeString()}`
                  : 'Last one standing'}
            </BodyStrong>
          </div>
        )}

        <div className="space-y-4 mb-8">
          {players.map((player, index) => (
            <ResultsPlayerRow
              key={player.id}
              player={player}
              index={index}
              winner={winner}
            />
          ))}
        </div>

        {winner && (
          <Caption className="mb-8 block text-center text-[var(--muted)]">
            {winner.victoryReason === 'corner-office'
              ? 'Corner Office Conquest'
              : winner.victoryReason === 'highest-valuation'
                ? 'Highest valuation at 00:00'
                : 'Last one standing'}
          </Caption>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] text-center">
            <Caption>Most PIPs Survived</Caption>
            <Body className="text-h3 mt-2 font-medium">+60 RSUs</Body>
          </div>
          <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] text-center">
            <Caption>Biggest Tech Debt Landlord</Caption>
            <Body className="text-h3 mt-2 font-medium">×2 Fees</Body>
          </div>
        </div>

        <div className="mb-8">
          <BodyStrong className="mb-2 block">Share Results</BodyStrong>
          <button
            type="button"
            onClick={toggleShare}
            className="w-full rounded-md px-4 py-2 bg-[var(--btn)] text-[var(--text)] transition-colors hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Copy summary card
          </button>
        </div>

        {showShare && (
          <div className="mt-8 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <img
              src="/share-card-template.svg"
              alt="PIP Roulette Results Summary"
              className="w-full h-64 object-cover"
              style={{ width: '1080px', height: '1080px' }}
            />
            <Caption className="block py-4 text-center">Shareable 1080x1080 summary card</Caption>
          </div>
        )}

        <div className="mt-8 flex gap-3 justify-center">
          <Button variant="primary" onClick={onRematch}>Rematch</Button>
          <Button variant="secondary" onClick={onNewRoom}>Launch New Startup Room</Button>
        </div>
      </div>
    </div>
  )
}

const avatarNames: Record<'dev' | 'intern' | 'vp' | 'leet' | 'pm' | 'pe', string> = {
  dev: 'The Burned-Out Dev',
  intern: 'The Grindset Intern',
  vp: 'The Buzzword VP',
  leet: 'The Leetcode Maxxer',
  pm: 'The Vibe-Coding PM',
  pe: 'Principal Eng Who Left in 2019',
}

export const ResultsStory = () => {
  const players = [
    { id: 'dev', rank: 'first' as const, finalValuation: 1840, rsu: 60, eliminated: false },
    { id: 'intern', rank: 'second' as const, finalValuation: 1200, rsu: 40, eliminated: false },
    { id: 'vp', rank: 'third' as const, finalValuation: 950, rsu: 30, eliminated: false },
    { id: 'leet', rank: 'fourth' as const, finalValuation: 500, rsu: 20, eliminated: true },
    { id: 'pm', rank: 'fifth' as const, finalValuation: 300, rsu: 10, eliminated: true },
    { id: 'pe', rank: 'sixth' as const, finalValuation: 100, rsu: 5, eliminated: true },
  ] satisfies PlayerResult[]

  return (
    <ResultsScreen
      players={players}
      onRematch={() => console.log('Rematch')}
      onNewRoom={() => console.log('New room')}
    />
  )
}
