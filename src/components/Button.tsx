'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motionTokens, prefersReducedMotion, useReducedMotion } from '@/lib/motion'
import { motion } from 'framer-motion'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  magnetic?: boolean
  idempotentKey?: string
}

const motionDuration = {
  fast: 120,
  base: 200,
  slow: 400,
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  magnetic = false,
  idempotentKey,
  className,
  onClick,
  onKeyDown,
  children,
  disabled = false,
  loading = false,
  success = false,
  error = false,
  ...props 
}: ButtonProps) {
  const [state, setState] = React.useState<'idle' | 'hover' | 'focus-visible' | 'pressed' | 'loading' | 'success' | 'error' | 'disabled'>('idle')
  const [isFocusVisible, setIsFocusVisible] = React.useState(false)
  const [internalDisabled, setInternalDisabled] = React.useState(false)
  const hoverRef = React.useRef<HTMLDivElement>(null)
  const pressedRef = React.useRef<HTMLDivElement>(null)
  const idempotentTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Handle idempotency - debounce clicks
  const handleIdempotentClick = React.useCallback((e: React.MouseEvent) => {
    if (idempotentKey && idempotentTimeoutRef.current) {
      clearTimeout(idempotentTimeoutRef.current)
    }
    idempotentTimeoutRef.current = setTimeout(() => {
      onClick?.(e)
    }, 300)
  }, [idempotentKey, onClick])

  // State machine transitions
  const handleMouseEnter = () => {
    if (internalDisabled || state === 'loading' || state === 'success' || state === 'error') return
    setState('hover')
  }

  const handleMouseLeave = () => {
    if (internalDisabled || state === 'loading' || state === 'success' || state === 'error') return
    setState('idle')
  }

  const handleFocus = (e: React.FocusEvent) => {
    if (internalDisabled) return
    setIsFocusVisible(true)
    setState('focus-visible')
  }

  const handleBlur = () => {
    if (internalDisabled) return
    setIsFocusVisible(false)
    setState('idle')
  }

  const handleFocusVisible = (e: React.FocusEvent) => {
    setIsFocusVisible(true)
  }

  const handlePointerDown = () => {
    if (internalDisabled) return
    setState('pressed')
  }

  const handlePointerUp = () => {
    if (internalDisabled) return
    setState('hover')
  }

  const handlePointerCancel = () => {
    if (internalDisabled) return
    setState(state === 'pressed' ? 'focus-visible' : 'idle')
  }

  // Handle loading, success, error states
  const handleLoadingStart = () => {
    setState('loading')
  }

  const handleSuccess = () => {
    setState('success')
    // Reset after 1.4s
    const timeout = setTimeout(() => {
      setState('idle')
    }, 1400)
    return () => clearTimeout(timeout)
  }

  const handleError = () => {
    setState('error')
    // Reset after 1.4s
    const timeout = setTimeout(() => {
      setState('idle')
    }, 1400)
    return () => clearTimeout(timeout)
  }

  // Haptics
  const handleHaptics = (type: 'tap' | 'success' | 'error' | 'wheel-stop') => {
    if (prefersReducedMotion()) return
    const navigator: any = window.navigator
    if (navigator.vibrate) {
      switch (type) {
        case 'tap':
          navigator.vibrate(10)
          break
        case 'success':
          navigator.vibrate([12, 40, 12])
          break
        case 'error':
          navigator.vibrate([40, 30, 40])
          break
        case 'wheel-stop':
          navigator.vibrate(25)
          break
      }
    }
  }

  // Reduced motion check
  const reducedMotion = useReducedMotion()

  // Click handler
  const handleClick = React.useCallback((e: React.MouseEvent) => {
    if (internalDisabled) return
    if (reducedMotion && state === 'pressed') {
      // Skip animation in reduced motion
      handleSuccess()
      handleHaptics('success')
      onClick?.(e)
      return
    }
    handleHaptics('tap')
    handleLoadingStart()
    const cleanup = handleSuccess()
    onClick?.(e)
    return cleanup
  }, [onClick, reducedMotion, state, internalDisabled])

  // Determine disabled state
  const isDisabled = internalDisabled || disabled

  // Render based on state
  const renderContent = React.useMemo(() => {
    if (state === 'loading') {
      return (
        <span className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[var(--muted)] animate-spin"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <span>{children}</span>
        </span>
      )
    }

    if (state === 'success') {
      return (
        <svg
          className="w-4 h-4 text-[var(--ok)] animate-bounce"
          viewBox="0 0 24 24"
          style={{ animationDuration: '1.4s' }}
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.21L5 12.14 2 9.27l6.91-1.02L12 2z"
          />
        </svg>
      )
    }

    if (state === 'error') {
      return (
        <svg
          className="w-4 h-4 text-[var(--bad)] animate-shake"
          viewBox="0 0 24 24"
          style={{ animationDuration: '400ms' }}
        >
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    }

    if (state === 'disabled') {
      return <span>{children}</span>
    }

    return children
  }, [state, children])

  // Button classes based on variant and state
  const buttonClasses = cn(
    'inline-flex items-center justify-center rounded-md text-button transition-all duration-[var(--t-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed',
    variant === 'primary' && 'bg-[var(--ok)] text-[var(--bg)] hover:bg-[var(--accent)]',
    variant === 'secondary' && 'bg-[var(--btn)] text-[var(--text)] hover:bg-[var(--surface-2)]',
    variant === 'ghost' && 'bg-transparent text-[var(--text)] hover:bg-[var(--surface-2)]',
    variant === 'icon' && 'bg-transparent text-[var(--accent)] hover:bg-[var(--surface-2)]',
    size === 'sm' && 'h-8 py-1 px-3 text-sm',
    size === 'md' && 'h-10 py-2 px-4 text-base',
    size === 'lg' && 'h-12 py-3 px-6 text-lg',
    size === 'icon' && 'h-10 w-10',
    loading && 'pointer-events-none',
    success && 'pointer-events-none',
    error && 'pointer-events-none',
    disabled && 'opacity-40 cursor-not-allowed',
    className
  )

  // Ripple effect
  const rippleEffect = React.useMemo(() => {
    if (state !== 'pressed' || !rippleRef.current) return null
    return (
      <div
        className="absolute inset-0 rounded-full opacity-12 bg-white transform scale-0"
        style={{
          left: rippleRef.current.getBoundingClientRect().left - hoveredRef.current.getBoundingClientRect().left,
          top: rippleRef.current.getBoundingClientRect().top - hoveredRef.current.getBoundingClientRect().top,
        }}
      />
    )
  }, [state])

  return (
    <button
      className={buttonClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onFocusVisible={handleFocusVisible}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClick={handleClick}
      disabled={isDisabled}
      type="button"
      ref={props.ref}
      {...props}
    >
      {renderContent}
      {loading && (
        <span
          className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-[var(--btn)] rounded-full animate-spin"
        />
      )}
      {!loading && !success && !error && !disabled && state === 'pressed' && (
        <div
          className="absolute inset-0 rounded-md opacity-8 pointer-events-none"
          style={{
            background: `rgba(255, 255, 255, 0.08)`,
          }}
        />
      )}
    </button>
  )
}

// Storybook stories
if (typeof window !== 'undefined' && window.__STORYBOOK__) {
  export const Primary = () => <Button variant="primary">Create Sprint</Button>
  export const Secondary = () => <Button variant="secondary">Join Retro</Button>
  export const Ghost = () => <Button variant="ghost">Cancel</Button>
  export const Icon = () => <Button variant="icon" size="icon">
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l4 4 4-4" />
    </svg>
  </Button>
  export const Disabled = () => (
    <Button variant="primary" disabled>
      Waiting for players
    </Button>
  )
  export const Loading = () => {
    const [loading, setLoading] = React.useState(true)
    setTimeout(() => setLoading(false), 3000)
    return <Button variant="primary" loading>{loading ? 'Creating...' : 'Create Sprint'}</Button>
  }
  export const Success = () => {
    const [success, setSuccess] = React.useState(true)
    const timeout = setTimeout(() => setSuccess(false), 1500)
    return (
      <Button variant="primary" onClick={() => setSuccess(false)} loading={success}>
        Create Sprint
      </Button>
    )
  }
  export const Error = () => {
    const [error, setError] = React.useState(true)
    const timeout = setTimeout(() => setError(false), 1500)
    return (
      <Button variant="primary" onClick={() => setError(false)} loading={error} disabled>
        Create Sprint
      </Button>
    )
  }
  export const Magnetic = () => <Button variant="primary" magnetic>Create Sprint</Button>
  export const Idle = () => <Button variant="primary">Idle State</Button>
  export const Hover = () => <Button variant="primary">Hover State</Button>
  export const FocusVisible = () => (
    <Button variant="primary" onFocusVisible={() => console.log('focus visible')}>Focus Visible</Button>
  )
  export const Pressed = () => <Button variant="primary">Pressed</Button>
  export const LabelSwap = () => {
    const [copied, setCopied] = React.useState(false)
    return (
      <Button
        variant="secondary"
        onClick={() => setCopied(true)}
        className={cn(className, 'data-[copied=true]:after:content-["Copied ✓"]')}
      >
        {copied ? 'Copied ✓' : 'Copy Invite Link'}
      </Button>
    )
  }
}

// Type scale for button text
export function useButtonTextScale(variant: ButtonVariant, size: ButtonSize) {
  const scales = {
    primary: {
      sm: '14px/20px',
      md: '14px/20px',
      lg: '14px/24px',
    },
    secondary: {
      sm: '11px/16px',
      md: '11px/16px',
      lg: '12px/18px',
    },
    ghost: {
      sm: '11px/16px',
      md: '11px/16px',
      lg: '12px/18px',
    },
    icon: {
      sm: 'inherit',
      md: 'inherit',
      lg: 'inherit',
    },
  }
  return scales[variant]?.[size] || '14px/20px'
}