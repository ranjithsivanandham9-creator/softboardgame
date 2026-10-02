'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Display, Label, Body } from '@/components/Typography'
import { Avatar } from '@/components/Avatar'
import { Button as AppButton } from '@/components/Button'
import { SegmentedControl } from '@/components/SegmentedControl'

export default function HomePage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [showChip, setShowChip] = useState(true)
  const [streak, setStreak] = useState('12')

  useEffect(() => {
    const saved = localStorage.getItem('chip-dismissed')
    if (saved) setShowChip(false)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setStreak(prev => {
        const [num] = prev.match(/(\d+)/) || ['0']
        const n = parseInt(num)
        if (n >= 30) return prev
        return `🔥${n + 1}`
      })
    }, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  if (showChip) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up" role="status" aria-live="polite">
        <div className="glass px-6 py-3 rounded-[var(--r-lg)] flex items-center gap-4 max-w-[90vw]">
          <Body className="text-[var(--text)]">New here? Learn the ropes in 30 s.</Body>
          <AppButton variant="primary" size="sm" onClick={() => { setShowChip(false); localStorage.setItem('home-chip-dismissed', 'true'); }}>
            Show me
          </AppButton>
          <AppButton variant="ghost" size="sm" onClick={() => { setShowChip(false); localStorage.setItem('home-chip-dismissed', 'true'); }}>
            No thanks
          </AppButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="border-b border-[var(--line)] px-4 py-3 flex items-center justify-between sticky top-0 z-40 bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Display className="text-[28px]">PIP ROULETTE</Display>
        </div>
        <div className="flex items-center gap-2">
          <AppButton variant="ghost" size="icon" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </AppButton>
          <AppButton variant="ghost" size="icon" aria-label="Sound toggle">
            🔊
          </AppButton>
          <AppButton variant="ghost" size="icon" aria-label="Help">
            ?
          </AppButton>
        </div>
      </header>

      <main className="max-w-[880px] mx-auto px-4 py-12">
        <section className="text-center space-y-4" data-t="home">
          <Display>PIP ROULETTE</Display>
          <Label>THE CORPORATE LADDER RAT RACE</Label>
          <Body className="max-w-2xl mx-auto">
            A login-free multiplayer board game where you survive PIPs, buy repos, spin the velocity wheel, and race to the Corner Office before the layoff wave hits.
          </Body>
        </section>

        <section className="mt-12 flex flex-col sm:flex-row gap-3 justify-center" data-t="cta">
          <AppButton variant="primary" size="lg" magnetic>
            Create Sprint
          </AppButton>
          <AppButton variant="secondary" size="lg" data-t="join">
            Join Retro
          </AppButton>
          <AppButton variant="secondary" size="lg" data-t="daily">
            <span className="flex items-center gap-2">
              <span>🔥</span>
              <span>Daily Standup</span>
              <span className="text-caption">resets in {streak}:</span>
            </span>
          </AppButton>
        </section>

        <section className="mt-16 flex flex-wrap justify-center gap-4" aria-label="Avatars">
          {['dev', 'intern', 'vp', 'leet', 'pm', 'pe'].map((id) => (
            <div key={id} className="w-20 h-20 sm:w-24 sm:h-24">
              <Avatar id={id as any} size={80} />
            </div>
          ))}
        </section>

        <footer className="mt-16 border-t border-[var(--line)] pt-8 flex flex-col sm:flex-row justify-between gap-4 text-center sm:text-left">
          <nav className="flex flex-wrap justify-center gap-4">
            <a href="#rules" className="text-body hover:text-[var(--text)] transition-colors">Rules Board</a>
            <a href="#tutorials" className="text-body hover:text-[var(--text)] transition-colors">Replay Tutorials</a>
            <a href="#privacy" className="text-body hover:text-[var(--text)] transition-colors">Privacy</a>
          </nav>
          <p className="text-caption text-[var(--muted)]">No accounts. No tracking. Just vibes.</p>
        </footer>
      </main>

      <NewHereChip />
    </div>
  )
}

function NewHereChip() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const dismissed = localStorage.getItem('home-chip-dismissed')
    if (dismissed) setShow(false)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up" role="status" aria-live="polite">
      <div className="glass px-6 py-3 rounded-[var(--r-lg)] flex items-center gap-4 max-w-[90vw]">
        <Body className="text-[var(--text)]">New here? Learn the ropes in 30 s.</Body>
        <AppButton variant="primary" size="sm" onClick={() => { setShow(false); localStorage.setItem('home-chip-dismissed', 'true'); }}>
          Show me
        </AppButton>
        <AppButton variant="ghost" size="sm" onClick={() => { setShow(false); localStorage.setItem('home-chip-dismissed', 'true'); }}>
          No thanks
        </AppButton>
      </div>
    </div>
  )
}