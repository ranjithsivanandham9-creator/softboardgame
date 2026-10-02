import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        line: 'var(--line)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        btn: 'var(--btn)',
        accent: 'var(--accent)',
        ok: 'var(--ok)',
        bad: 'var(--bad)',
        warn: 'var(--warn)',
        'glow-accent': 'var(--glow-accent)',
        'glow-ok': 'var(--glow-ok)',
        'glow-bad': 'var(--glow-bad)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'SF Pro Display', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'Geist Mono', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        display: ['clamp(36px, 8vw, 56px)', { lineHeight: '1.07', letterSpacing: '-0.04em', fontWeight: '800' }],
        h1: ['32px', { lineHeight: '36px', letterSpacing: '-0.03em', fontWeight: '800' }],
        h2: ['22px', { lineHeight: '28px', letterSpacing: '-0.025em', fontWeight: '700' }],
        h3: ['16px', { lineHeight: '22px', letterSpacing: '-0.02em', fontWeight: '700' }],
        button: ['14px', { lineHeight: '20px', letterSpacing: '-0.01em', fontWeight: '700' }],
        body: ['13px', { lineHeight: '22px', letterSpacing: '0', fontWeight: '400' }],
        'body-strong': ['13px', { lineHeight: '22px', letterSpacing: '0', fontWeight: '500' }],
        label: ['11px', { lineHeight: '16px', letterSpacing: '0.12em', fontWeight: '500' }],
        stat: ['20px', { lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: '700' }],
        ticker: ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '400' }],
        dialog: ['14px', { lineHeight: '24px', letterSpacing: '0', fontWeight: '400' }],
        badge: ['10px', { lineHeight: '12px', letterSpacing: '0.08em', fontWeight: '800' }],
        caption: ['11px', { lineHeight: '16px', letterSpacing: '0', fontWeight: '400' }],
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
        full: 'var(--r-full)',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
      },
      boxShadow: {
        glow: '0 0 16px -2px var(--glow-accent)',
        'glow-ok': '0 0 16px -2px var(--glow-ok)',
        'glow-bad': '0 0 16px -2px var(--glow-bad)',
        elevated: '0 0 0 1px var(--line), 0 0 16px -2px var(--glow-accent)',
      },
      transitionDuration: {
        fast: 'var(--t-fast)',
        base: 'var(--t-base)',
        slow: 'var(--t-slow)',
      },
      transitionTimingFunction: {
        ease: 'var(--ease)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulse-glow 1.6s ease-in-out infinite',
        'sheen': 'sheen 6s ease-in-out infinite',
        'blink': 'blink 4s ease-in-out infinite',
        'bob': 'bob 4.5s ease-in-out infinite',
        'breathe': 'breathe 3.6s ease-in-out infinite',
        'border-draw': 'border-draw 1.2s ease-out forwards',
        'shake': 'shake 400ms ease-in-out',
        'pop': 'pop 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'confetti': 'confetti 600ms ease-out forwards',
        'slide-up': 'slide-up 200ms var(--ease)',
        'slide-down': 'slide-down 200ms var(--ease)',
        'fade-in': 'fade-in 120ms var(--ease)',
        'fade-out': 'fade-out 120ms var(--ease)',
        'scale-in': 'scale-in 200ms var(--ease)',
        'scale-out': 'scale-out 150ms var(--ease)',
        'typing': 'typing 1s steps(40, end)',
        'cursor-blink': 'cursor-blink 1s step-end infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        sheen: {
          '0%': { transform: 'translateX(-100%)' },
          '10%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0)' },
        },
        bob: {
          '0%, 100%': { transform: 'rotate(0deg) translateY(0)' },
          '50%': { transform: 'rotate(1.6deg) translateY(-1px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.012)' },
        },
        'border-draw': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        confetti: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(180deg)', opacity: '0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'cursor-blink': {
          '0%, 50%': { borderColor: 'transparent' },
          '51%, 100%': { borderColor: 'currentColor' },
        },
      },
    },
  },
  plugins: [],
}

export default config