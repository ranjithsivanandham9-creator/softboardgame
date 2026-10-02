'use client'

import * as React from 'react'
import { Avatar } from '@/components/Avatar'
import { Display, Stat, Body } from '@/components/Typography'
import { Button } from '@/components/Button'
import { VelocityWheel } from '@/components/VelocityWheel'
import { useReducedMotion } from '@/lib/motion'

export interface TileType {
  id: 'start' | 'repository' | 'promotion' | 'pip-trap' | 'incident' | 'draw-card' | 'open-floor' | 'corner-office' | 'laid-off'
  owner?: 'dev' | 'intern' | 'vp' | 'leet' | 'pm' | 'pe' | 'bank'
  level?: number
}

export interface Player {
  id: 'dev' | 'intern' | 'vp' | 'leet' | 'pm' | 'pe'
  rsu: number
  position: number // square index
  status: 'active' | 'laid_off' | 'eliminated'
}

export interface BoardState {
  gridSize: number // 5, 7, or 9
  pathLength: number
  currentTurn: number // 10, 12, or 15
  turnTimer: number // seconds remaining
  layoffWave: number // percentage (70-95)
  waveSchedule: number[] // timestamps when rings collapse
  tokens: Player[]
  grid: TileType[]
  diceResult?: '1' | '2' | '3' | '5' | '8'
}

export default function SprintBoard({ state }: { state: BoardState }) {
  const reducedMotion = useReducedMotion()

  // Render a single tile
  const renderTile = (index: number, tile: TileType) => {
    const isCenter = index === state.pathLength - 1 // Corner Office is last
    
    // Small avatar disc for owner
    let ownerDisplay = null
    if (tile.owner && !reducedMotion) {
      const color = {
        dev: '#3B2F5E', intern: '#12483B', vp: '#42324F',
        leet: '#4A2530', pm: '#3E3A1E', pe: '#173B4D'
      }[tile.owner]
      ownerDisplay = <Avatar id={tile.owner} size={24} />
    }

    return (
      <div
        key={index}
        className="relative flex items-center justify-center select-none"
        style={{
          width: `${100 / state.gridSize}%`,
          height: `${100 / state.gridSize}%`,
        }}
        data-t="square"
        aria-label={`Square ${index}`}
      >
        <span className="text-xs text-[var(--muted)] opacity-60">•</span>
        {ownerDisplay}
        {/* Tile type indicator - small */}
        {isCenter && (
          <span className="text-[var(--ok)] font-medium">CO</span>
        )}
      </div>
    )
  }

  // Render roster
  const renderRoster = () => (
    <div className="flex items-center gap-2 overflow-x-auto">
      {state.tokens.map((player) => (
        <div
          key={player.id}
          className="flex-1 rounded-md px-3 py-2 bg-[var(--surface-2)] text-[var(--muted)] text-sm"
          aria-label={`RSU: ${player.rsu}`}
        >
          {player.id.charAt(0).toUpperCase()}
        </div>
      ))}
    </div>
  )

  // Render dock
  const renderDock = () => (
    <div className="p-4 bg-[var(--surface-2)] rounded-[var(--r-md)] mt-4">
      <div className="text-caption text-[var(--muted)] mb-2">Velocity Wheel</div>
      <VelocityWheel
        result={state.diceResult}
        isLocalTurn={true}
        onSpin={() => console.log('Spin')}
        disabled={false}
      />
      <div className="text-caption text-[var(--muted)] mb-2">Last 5 Events</div>
      <p className="text-[var(--muted)] text-xs">Event 1: Player moved</p>
      <p className="text-[var(--muted)] text-xs">Event 2: Repository bought</p>
      <p className="text-[var(--muted)] text-xs">Event 3: Layoff wave</p>
      <p className="text-[var(--muted)] text-xs">Event 4: PIP trap triggered</p>
      <p className="text-[var(--muted)] text-xs">Event 5: Corner Office reached</p>
      <div className="mt-2">
        <Button variant="poke" size="sm">Poke</Button>
        <Button variant="help" size="sm">Help</Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-[720px] mx-auto p-4">
        
        {/* Header */}
        <header className="border-b border-[var(--line)] pb-4 mb-4">
          <div className="flex items-center justify-between">
            {/* Timer as stat */}
            <Stat className="text-2xl">{state.turnTimer}s</Stat>
            
            {/* Turn indicator */}
            <div className="flex items-center gap-2">
              <Avatar id={state.tokens[0]?.id as any} size={32} />
              <span className="font-medium">Turn: {state.tokens[0]?.id?.charAt(0).toUpperCase() || '?'}</span>
              <span className="text-[var(--muted)] text-sm">Ring: {state.currentTurn}s</span>
            </div>
            
            {/* Layoff Wave countdown */}
            <div>
              {state.layoffWave > 70 && (
                <div className="text-[var(--warn)] font-medium">
                  Layoff Wave: {state.layoffWave}% - Outer ring collapsing!
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Board */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(32px,1fr))] gap-2" style={{ width: 'clamp(300px, 92vw, 720px)' }}>
          {state.grid.map((tile, index) => renderTile(index, tile))}
        </div>

        {/* Roster strip */}
        {renderRoster()}

        {/* Dock */}
        {renderDock()}

      </div>
    </div>
  )
}