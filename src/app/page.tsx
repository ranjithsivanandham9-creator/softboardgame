'use client'

import { useEffect, useState } from 'react'
import { Display, Label, Body, ButtonText } from '@/components/Typography'
import { Button, SegmentedControl } from '@/components/Button'

export default function HomePage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = saved || (prefersDark ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <Display>PIP ROULETTE</Display>
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
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Sound toggle">
            🔊
          </Button>
          <Button variant="ghost" size="icon" aria-label="Help">
            ?
          </Button>
        </div>
      </header>

      <main id="main" className="max-w-[880px] mx-auto px-4 py-12">
        <section className="text-center space-y-4" data-t="home">
          <Display>PIP ROULETTE</Display>
          <Label>THE CORPORATE LADDER RAT RACE</Label>
          <Body className="max-w-2xl mx-auto">
            A login-free multiplayer board game where you survive PIPs, buy repos, spin the velocity wheel, and race to the Corner Office before the layoff wave hits.
          </Body>
        </section>

        <section className="mt-12 flex flex-col sm:flex-row gap-3 justify-center" data-t="cta">
          <Button variant="primary" size="lg" magnetic>
            Create Sprint
          </Button>
          <Button variant="secondary" size="lg" data-t="join">
            Join Retro
          </Button>
          <Button variant="secondary" size="lg" data-t="daily">
            <span className="flex items-center gap-2">
              <span>🔥</span>
              <span>Daily Standup</span>
              <span className="text-caption">resets in 12:00:00</span>
            </span>
          </Button>
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
        <Button variant="primary" size="sm" onClick={() => { setShow(false); localStorage.setItem('home-chip-dismissed', 'true'); }}>
          Show me
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { setShow(false); localStorage.setItem('home-chip-dismissed', 'true'); }}>
          No thanks
        </Button>
      </div>
    </div>
  )
}

function Avatar({ id, size }: { id: 'dev' | 'intern' | 'vp' | 'leet' | 'pm' | 'pe'; size: number }) {
  const colors: Record<string, string> = {
    dev: '#3B2F5E',
    intern: '#12483B',
    vp: '#42324F',
    leet: '#4A2530',
    pm: '#3E3A1E',
    pe: '#173B4D',
  }

  const names: Record<string, string> = {
    dev: 'Burned-Out Dev',
    intern: 'Grindset Intern',
    vp: 'Buzzword VP',
    leet: 'Leetcode Maxxer',
    pm: 'Vibe-Coding PM',
    pe: 'Principal Eng',
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 428"
      style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden' }}
      aria-label={names[id]}
      role="img"
    >
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors[id]} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colors[id]} stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="214" r="200" fill="url(#" + {`${id}-bg`}) + ")" />
      <circle cx="200" cy="214" r="197" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
      <text x="200" y="220" textAnchor="middle" fill="var(--text)" fontSize="48" fontWeight="800" fontFamily="Inter, sans-serif">
        {id.charAt(0).toUpperCase()}
      </text>
    </svg>
  )
}