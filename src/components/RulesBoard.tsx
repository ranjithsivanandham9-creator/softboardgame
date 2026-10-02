'use client'

import * as React from 'react'
import { Display, h2 } from '@/components/Typography'
import { Body } from '@/components/Typography'
import { Avatar } from '@/components/Avatar'

export type RulesTab = 'goal' | 'turns' | 'economy' | 'squares' | 'layoff' | 'winning'

export interface RulesBoardProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function RulesBoard({ isOpen, onOpenChange }: RulesBoardProps) {
  const [selectedTab, setSelectedTab] = React.useState<RulesTab>('goal')
  const [searchQuery, setSearchQuery] = React.useState('')

  // Seven numbers the game cares about
  const gameNumbers = {
    startRSUs: 1000,
    vestPerRound: 60,
    repoPriceRange: '100-300',
    feePercent: 25,
    upgradePercent: 50,
    wheelSegments: '1/2/3/5/8',
    waveAt: '70% time'
  }

  // Tab handlers
  const handleTabChange = (tab: RulesTab) => setSelectedTab(tab)

  return (
    <div className="fixed inset-0 z-50 items-center justify-center bg-black/80 backdrop-blur-md">
      <div
        className="relative bg-[var(--surface)] rounded-2xl max-w-lg m-4 w-full transform scale-95 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--line)]">
          <h2 className="text-h2 font-medium text-[var(--text)]">Rules</h2>
          <button
            onClick={onOpenChange}
            className="absolute right-2 text-[var(--muted)] hover:text-[var(--text)]"
            aria-label="Close rules board"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-2 border-b border-[var(--line)]">
          <button
            onClick={() => handleTabChange('goal')}
            className={selectedTab === 'goal' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}
          >
            Goal
          </button>
          <button
            onClick={() => handleTabChange('turns')}
            className={selectedTab === 'turns' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}
          >
            Turns and Wheel
          </button>
          <button
            onClick={() => handleTabChange('economy')}
            className={selectedTab === 'economy' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}
          >
            Economy
          </button>
          <button
            onClick={() => handleTabChange('squares')}
            className={selectedTab === 'squares' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}
          >
            Squares
          </button>
          <button
            onClick={() => handleTabChange('layoff')}
            className={selectedTab === 'layoff' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}
          >
            Layoff Wave
          </button>
          <button
            onClick={() => handleTabChange('winning')}
            className={selectedTab === 'winning' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}
          >
            Winning
          </button>
        </div>

        {/* Search input */}
        <div className="px-6 py-2">
          <input
            type="text"
            placeholder="Search rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md px-3 py-2 bg-[var(--btn)] text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          />
        </div>

        {/* Tab content */}
        <div className="p-6">
          {selectedTab === 'goal' && (
            <div>
              <h3 className="text-semibold text-[var(--text)] mb-2">Objective</h3>
              <p className="text-[var(--muted)]">
                First player to reach the Corner Office wins instantly. If the clock reaches
                zero, the player with the highest Final Valuation wins.
              </p>
              <p className="text-caption text-[var(--muted)] mt-2">
                <strong>Seven numbers the game cares about:</strong> Start 1,000 RSUs; +60 vest
                per round; repo price 100-300; fee 25%; upgrade 50%; wheel 1/2/3/5/8; wave at
                70% time.
              </p>
            </div>
          )}

          {selectedTab === 'turns' && (
            <div>
              <h3 className="text-semibold text-[var(--text)] mb-2">Turns and Wheel</h3>
              <p className="text-[var(--muted)]">
                Turn timer: 10s (5 min), 12s (10 min), 15s (15 min). Auto-spin and auto-pass
                on timeout. 3 consecutive timeouts → Autopilot. Velocity Wheel determines movement.
              </p>
              <p className="text-caption text-[var(--muted)] mt-2">
                Segments: 1pt (Quick Hotfix, 35%), 2pts (Minor Refactor, 28%), 3pts
                (Core Feature Push, 20%), 5pts (Full AI Integration, 12%), 8pts (Legacy Rewrite,
                5%).
              </p>
            </div>
          )}

          {selectedTab === 'economy' && (
            <div>
              <h3 className="text-semibold text-[var(--text)] mb-2">Economy</h3>
              <p className="text-[var(--muted)]">
                Starting RSUs: 1,000. Quarterly Vest: +60 RSUs each active player at end of every
                full round. Repository price: 100 (outer ring) → 150 → 200 → 250 → 300 (inner).
                Tech Debt fee: 25% of price, paid to owner. Upgrade: owner lands on own repo,
                pays 50% of price, fee doubles. Bankruptcy: RSUs below 0 → Laid Off, repos return
                to bank.
              </p>
              <p className="text-caption text-[var(--muted)] mt-2">
                Final Valuation: RSUs + Σ(repo price × 1 or 1.5 for upgraded).
              </p>
            </div>
          )}

          {selectedTab === 'squares' && (
            <div>
              <h3 className="text-semibold text-[var(--text)] mb-2">Board Squares</h3>
              <p className="text-[var(--muted)]">
                The board is a spiral grid ending at the Corner Office in the center. Square
                distribution: Start, Repository (~42%), Draw Card (~14%), Incident (~10%), Promotion
                (~10%), PIP Trap (~10%), Open Floor Plan (~14%).
              </p>
              <p className="text-caption text-[var(--muted)] mt-2">
                Each tile type has a unique silhouette and pattern for grayscale distinguishability.
              </p>
            </div>
          )}

          {selectedTab === 'layoff' && (
            <div>
              <h3 className="text-semibold text-[var(--text)] mb-2">Layoff Wave</h3>
              <p className="text-[var(--muted)]">
                Starts at 70% of match time (e.g., 3:30 in a 5:00 match). Outer ring flashes red
                with 15 s warning. Remaining collapsible rings collapse at evenly spaced times
                between 70% and 95%. The center ring never collapses.
              </p>
              <p className="text-caption text-[var(--muted)] mt-2">
                Tokens on collapsing ring get one Severance Spin before elimination. Eliminated
                players become Ghost Recruiters with one Hiring Freeze per round.
              </p>
            </div>
          )}

          {selectedTab === 'winning' && (
            <div>
              <h3 className="text-semibold text-[var(--text)] mb-2">Winning</h3>
              <p className="text-[var(--muted)]">
                Victory conditions: Corner Office Conquest (first to reach/pass center wins instantly),
                Market Liquidation (all others laid off/bankrupt), or Clock Expiry by Final Valuation
                with tie-breaks (further along path, then fewer timeouts).
              </p>
              <p className="text-caption text-[var(--muted)] mt-2">
                <strong>Seven numbers:</strong> Start 1,000 RSUs; +60 vest per round; repo price
                100-300; fee 25%; upgrade 50%; wheel 1/2/3/5/8; wave at 70% time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}