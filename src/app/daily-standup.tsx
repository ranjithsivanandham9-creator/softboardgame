'use client'

import * as React from 'react'
import { Display, Stat, Body } from '@/components/Typography'
import { useState, useEffect } from 'react'

export interface DailyModifier {
  name: string
  effect: 'none' | 'no_1pt' | 'ai_3x' | 'layoff_from_turn_8'
}

export interface DailyState {
  date: string // UTC date string
  turn: number // 1-12
  modifier: DailyModifier
  managerBot: boolean
  score: number
  percentile: number
  streak: number
  ptoTokens: number // 0, 1, or 2
  milestone: '3d' | '7d' | '30d' | '100d' | null
}

export function DailyStandup() {
  const [state, setState] = useState<DailyState>({
    date: new Date().toISOString().split('T')[0],
    turn: 1,
    modifier: { name: 'RTO Monday', effect: 'no_1pt' },
    managerBot: true,
    score: 0,
    percentile: 0,
    streak: parseInt(localStorage.getItem('daily_streak') || '0'),
    ptoTokens: parseInt(localStorage.getItem('daily_pto_tokens') || '0'),
    milestone: null
  })

  // Global modifier rotation (14 at launch)
  const modifiers: DailyModifier[] = [
    { name: 'RTO Monday', effect: 'no_1pt' },
    { name: 'Hype Cycle Thursday', effect: 'ai_3x' },
    { name: 'Reorg Friday', effect: 'layoff_from_turn_8' },
    { name: 'AI Hype Monday', effect: 'ai_3x' },
    { name: 'Standard Tuesday', effect: 'none' },
    { name: 'Wednesday Mid', effect: 'none' },
    { name: 'Tech Debt Thursday', effect: 'layoff_from_turn_8' },
    { name: 'Standup Sync', effect: 'none' },
    { name: 'PIP Pressure', effect: 'none' },
    { name: 'Agile Week', effect: 'none' },
    { name: 'Quarter End', effect: 'none' },
    { name: 'Holiday', effect: 'none' },
    { name: 'Reorg Monday', effect: 'layoff_from_turn_8' }
  ]

  // Determine today's modifier based on UTC day
  useEffect(() => {
    const today = new Date()
    const utcDay = today.getUTCDay() // 0=Sunday, 1=Monday, ..., 6=Saturday
    // Rotate through modifiers - simple cycling
    const modifierIndex = utcDay % modifiers.length
    setState(prev => ({ ...prev, modifier: modifiers[modifierIndex] }))
  }, [])

  // Turn progression - 12 turns
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const newTurn = prev.turn < 12 ? prev.turn + 1 : 1
        return { ...prev, turn: newTurn }
      })
    }, 1000 * 60) // 1 minute per turn for demo

    return () => clearInterval(interval)
  }, [])

  // PTO token logic
  useEffect(() => {
    // Earn 1 PTO token per 7-day streak, max 2
    const streak = state.streak
    if (streak % 7 === 0 && streak > 0) {
      const newPTO = Math.min(state.ptoTokens + 1, 2)
      setState(prev => ({ ...prev, ptoTokens: newPTO }))
      // Save to localStorage
      localStorage.setItem('daily_pto_tokens', String(newPTO))
    }
  }, [state.streak])

  // Milestone check
  useEffect(() => {
    const streak = state.streak
    let milestone: '3d' | '7d' | '30d' | '100d' | null = null
    
    if (streak >= 100) milestone = '100d'
    else if (streak >= 30) milestone = '30d'
    else if (streak >= 7) milestone = '7d'
    else if (streak >= 3) milestone = '3d'
    
    if (state.milestone !== milestone) {
      localStorage.setItem('daily_milestone', String(milestone || ''))
    }
    setState(prev => ({ ...prev, milestone }))
  }, [state.streak])

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-4">
      <div className="max-w-[880px] mx-auto">
        <header className="border-b border-[var(--line)] pb-4 mb-6">
          <Display>Daily Standup</Display>
          <p className="text-caption text-[var(--muted)]">
            {state.modifier.name} • Turn {state.turn}/12
          </p>
        </header>

        <main className="space-y-4">
          {/* Modifier info */}
          <div className="glass p-4 rounded-[var(--r-md)]">
            <p className="text-body-strong">Today's Twist</p>
            <p className="text-[var(--muted)] mt-1">
              {state.modifier.name}{' '}
              {state.modifier.effect === 'no_1pt' && '(no 1-pt rolls)'}{' '}
              {state.modifier.effect === 'ai_3x' && '(AI spins 3x more likely)'}{' '}
              {state.modifier.effect === 'layoff_from_turn_8' && '(Layoff Wave from turn 8)'}
            </p>
          </div>

          {/* Turn and score */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-caption">Turn</p>
              <p className="text-h3 font-medium">{state.turn}</p>
            </div>
            <div>
              <p className="text-caption">Score</p>
              <p className="text-h3 font-medium">{state.score}</p>
            </div>
          </div>

          {/* Progress bar for turns */}
          <div>
            <p className="text-caption">Progress</p>
            <div className="bg-[var(--surface-2)] rounded-[var(--r-md)] h-2 w-full">
              <div
                className="bg-[var(--accent)] rounded-[var(--r-md)] h-2 transition-width"
                style={{ width: `${(state.turn / 12) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[var(--muted)] mt-1">
              {state.turn}/12 turns
            </div>
          </div>

          {/* PTO and milestone */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="glass p-2 rounded-[var(--r-sm)] text-center">
              <p className="text-caption">PTO Tokens</p>
              <p className="text-h3 font-medium">{state.ptoTokens}/2</p>
            </div>
            <div className="glass p-2 rounded-[var(--r-sm)] text-center">
              <p className="text-caption">Streak</p>
              <p className="text-h3 font-medium">{state.streak}d</p>
            </div>
            <div className="glass p-2 rounded-[var(--r-sm)] text-center">
              <p className="text-caption">Milestone</p>
              <p className="text-h3 font-medium">
                {state.milestone ? state.milestone.replace('d', '+') : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}