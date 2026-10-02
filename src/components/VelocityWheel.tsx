'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/motion'
import { useHaptics } from '@/lib/haptics'

export type WheelResult = '1' | '2' | '3' | '5' | '8'

interface VelocityWheelProps {
  result: WheelResult | null
  isLocalTurn: boolean
  onSpin: () => void
  disabled?: boolean
}

const segmentWeights: Record<WheelResult, number> = {
  '1': 35,
  '2': 28,
  '3': 20,
  '5': 12,
  '8': 5,
}

const segmentLabels: Record<WheelResult, string> = {
  '1': 'Quick Hotfix',
  '2': 'Minor Refactor',
  '3': 'Core Feature Push',
  '5': 'Full AI Integration',
  '8': 'Legacy Rewrite',
}

// Compute target angle: each result occupies its weighted portion of the circle
// Start from top (12 o'clock) and go clockwise
const computeTargetAngle = (result: WheelResult): number => {
  const orderedResults = Object.keys(segmentWeights) as WheelResult[]
  const resultIndex = orderedResults.indexOf(result)
  let angle = 0
  for (let i = 0; i < resultIndex; i++) {
    const res = orderedResults[i]
    angle += segmentWeights[res]
  }
  // Each "unit" is 360 / total_weight degrees, starting from top
  const totalWeight = Object.values(segmentWeights).reduce((a, b) => a + b, 0)
  const unitDegrees = 360 / totalWeight
  const targetUnit = segmentWeights[result]
  // Result starts at accumulated angle + half its unit
  const startAngle = angle * unitDegrees
  const resultAngle = startAngle + (unitDegrees / 2)
  return resultAngle
}

// Pre-computed target angles for all results (starting from 12 o'clock, clockwise)
const TARGET_ANGLES: Record<WheelResult, number> = {
  '1': 0,           // Quick Hotfix - start at top
  '2': 35 * (360 / 100),  // Minor Refactor
  '3': (35 + 28) * (360 / 100),  // Core Feature Push
  '5': (35 + 28 + 20) * (360 / 100),  // Full AI Integration
  '8': (35 + 28 + 20 + 12) * (360 / 100),  // Legacy Rewrite
}

const spinDurations = {
  windUp: 150,
  fastSpin: 2000,
  decel: 1500,
}

export function VelocityWheel({ result, isLocalTurn, onSpin, disabled = false }: VelocityWheelProps) {
  const reducedMotion = useReducedMotion()
  const [isSpinning, setIsSpinning] = React.useState(false)
  const [finalResult, setFinalResult] = React.useState<WheelResult | null>(null)
  const [showInstant, setShowInstant] = React.useState(false)

  // Handle spin
  const handleSpin = () => {
    if (disabled || isSpinning) return
    if (reducedMotion) {
      // Instant result in reduced motion
      setFinalResult(result as WheelResult)
      setShowInstant(true)
      return
    }
    setIsSpinning(true)
    // Trigger haptics/tick sounds
    const haptic = navigator.vibrate
    if (haptic) {
      haptic([12, 40, 12]) // success pattern
    }
    onSpin()
  }

  // When result comes from server
  React.useEffect(() => {
    if (!result || !isSpinning) return
    setFinalResult(result as WheelResult)
    setShowInstant(false)
    setIsSpinning(false)
  }, [result])

  // Determine glow color based on result
  const glowColors: Record<WheelResult, string> = {
    '1': 'var(--ok)',     // Green - Quick Hotfix
    '2': 'var(--ok)',     // Green - Minor Refactor
    '3': 'var(--ok)',     // Green - Core Feature Push
    '5': 'var(--warn)',   // Yellow - Full AI Integration
    '8': 'var(--bad)',    // Red - Legacy Rewrite
  }

  const glowColor = glowColors[finalResult ?? '1']

  // Spin animation - target angle from result + 3-5 full rotations
  const totalRotations = reducedMotion ? 0 : 4 // 4 full rotations for visual spin
  const baseTargetAngle = TARGET_ANGLES[finalResult ?? '1']
  const targetAngle = baseTargetAngle + (360 * totalRotations)

  // Reduced motion: just show the result instantly
  if (reducedMotion && finalResult) {
    return (
      <div className="relative">
        <svg
          className="w-64 h-64 mx-auto"
          viewBox="0 0 100 100"
          style={{ transform: `rotate(${TARGET_ANGLES[finalResult] || 0}deg)` }}
        >
          <g>
            {/* Segment 1 - Quick Hotfix */}
            <path
              d="M50 5 L50 10 A45 45 0 0 1 50 55 Z"
              fill="var(--btn)"
              style={{ stroke: 'var(--accent)', strokeWidth: 1 }}
            />
            {/* Segment 2 - Minor Refactor */}
            <path
              d="M50 5.5 L50 11 A45 45 0 0 1 62 32 Z"
              fill="var(--btn)"
            />
            {/* Segment 3 - Core Feature Push */}
            <path
              d="M50 6 L50 12 A45 45 0 0 1 70 45 Z"
              fill="var(--btn)"
            />
            {/* Segment 5 - Full AI Integration */}
            <path
              d="M50 7 L50 13 A45 45 0 0 1 75 65 Z"
              fill="var(--btn)"
            />
            {/* Segment 8 - Legacy Rewrite */}
            <path
              d="M50 8 L50 14 A45 45 0 0 1 75 80 Z"
              fill="var(--btn)"
            />
          </g>
        </svg>
        <p className="text-caption mt-2">Result: {finalResult}</p>
      </div>
    )
  }

  // Full spin animation
  const spinAnimation = {
    rotate: [0, -12, targetAngle], // wind up then spin
    transition: {
      duration: {
        rotate: {
          start: 0,
          delay: spinDurations.windUp,
          end: spinDurations.fastSpin + spinDurations.decel,
        },
      },
      type: 'cubic',
      // Spring overshoot for deceleration
      // The actual landing is computed by the spring physics
    },
  }

  return (
    <div
      className={cn(
        'relative inline-block',
        disabled && 'cursor-not-allowed opacity-50',
        'data-[disabled=true]:pointer-events-none'
      )}
      onClick={reducedMotion && !isSpinning ? () => setShowInstant(true) : undefined}
      role="button"
      aria-disabled={disabled || !isLocalTurn}
      title={!isLocalTurn ? 'Waiting for CoffeeBadger' : ''}
    >
      {/* Wheel SVG */}
      <svg
        className="w-64 h-64 rounded-full overflow-hidden mx-auto"
        role="img"
        aria-label="Velocity Wheel - Story Points"
      >
        <g>
          {/* Wheel background */}
          <circle cx="50" cy="50" r="45" fill="var(--surface-2)" />

          {/* Segments - each with proportional size */}
          {/* Segment 1: 35% */}
          <path
            d="M50 5 L50 10 A45 45 0 0 1 50 55 Z"
            fill="var(--glow-accent)"
            style={{ stroke: 'var(--accent)', strokeWidth: 1 }}
          />
          {/* Segment 2: 28% */}
          <path
            d="M50 5.5 L50 11 A45 45 0 0 1 62 32 Z"
            fill="var(--glow-accent)"
          />
          {/* Segment 3: 20% */}
          <path
            d="M50 6 L50 12 A45 45 0 0 1 70 45 Z"
            fill="var(--glow-accent)"
          />
          {/* Segment 5: 12% */}
          <path
            d="M50 7 L50 13 A45 45 0 0 1 75 65 Z"
            fill="var(--glow-accent)"
          />
          {/* Segment 8: 5% */}
          <path
            d="M50 8 L50 14 A45 45 0 0 1 75 80 Z"
            fill="var(--glow-accent)"
          />
        </g>

        {/* Center label */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[14px] font-medium select-none"
        >
          {result ? segmentLabels[result] : 'Spin'}
        </text>

        {/* Result glow when stopped */}
        {finalResult && !isSpinning && (
          <circle
            cx="50"
            cy="50"
            r="50"
            fill="none"
            style={{
              boxShadow: `0 0 20px 5px ${glowColor}`,
              transition: 'box-shadow 300ms ease-out',
            }}
          />
        )}

        {/* Spin overlay during animation */}
        {isSpinning && (
          <g>
            {/* Spin indicator */}
            <circle
              cx="50"
              cy="50"
              r="30"
              fill="none"
              style={{
                border: '3px solid var(--accent)',
                borderRadius: '50%',
                animation: 'spin 2s linear infinite',
              }}
            />
            {/* Tick marks */}
            <g stroke="var(--accent)" strokeWidth="1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <line
                  key={i}
                  x1="50"
                  y1="40"
                  x2="50"
                  y2="45"
                  style={{ transform: `rotate(${(360 / 12) * (i - 1)}deg)` }}
                />
              ))}
            </g>
          </g>
        )}
      </svg>

      {/* Skip animation tap area */}
      {reducedMotion && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            setFinalResult(result as WheelResult)
            setShowInstant(true)
          }}
        />
      )}
    </div>
  )
}

// Storybook stories
export const VelocityWheelStory = () => {
  const [result, setResult] = React.useState<WheelResult | null>(null)
  const [isLocalTurn, setIsLocalTurn] = React.useState(true)

  return (
    <div className="p-8">
      <VelocityWheel
        result={result}
        isLocalTurn={isLocalTurn}
        onSpin={() => setResult('3')}
        disabled={!isLocalTurn}
      />
      <p className="mt-4 text-caption">
        Result: {result || 'Not spun yet'}
      </p>
      <button
        className="mt-2 px-4 py-2 bg-[var(--ok)] text-[var(--bg)] rounded-md"
        onClick={() => setResult('5')}
        disabled={!isLocalTurn}
      >
        Spin (5 pts)
      </button>
    </div>
  )
}

export const DisabledWheel = () => (
  <VelocityWheel
    result={null}
    isLocalTurn={false}
    onSpin={() => {}}
    disabled
  />
)
