'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motionTokens, prefersReducedMotion } from '@/lib/motion'
import { motion } from 'framer-motion'

export type SegmentedControlVariant = 'default' | 'neon'

export interface SegmentedControlItem {
  value: string
  label: string
  disabled?: boolean
}

export interface SegmentedControlProps {
  items: SegmentedControlItem[]
  value: string
  onValueChange: (value: string) => void
  variant?: SegmentedControlVariant
  layoutId?: string
  className?: string
  reducedMotion?: boolean
}

export function SegmentedControl({ 
  items, 
  value, 
  onValueChange, 
  variant = 'default', 
  layoutId,
  className,
  reducedMotion = false
}: SegmentedControlProps) {
  const [isPressed, setIsPressed] = React.useState(false)
  const [highlightPosition, setHighlightPosition] = React.useState(0)
  const [highlightSize, setHighlightSize] = React.useState(0)

  const handleItemClick = (itemValue: string) => {
    onValueChange(itemValue)
    setIsPressed(false)
  }

  const handlePointerDown = (e: React.PointerEvent, itemValue: string) => {
    if (reducedMotion) return
    setIsPressed(true)
    // Start highlight animation
    const item = items.find(i => i.value === itemValue)
    if (!item) return

    // Calculate position and size based on item
    const rect = e.currentTarget.getBoundingClientRect()
    setHighlightPosition(rect.left)
    setHighlightSize(rect.width)
  }

  const handlePointerUp = () => {
    setIsPressed(false)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (reducedMotion || !isPressed) return
    // Could add drag highlights here
  }

  // Calculate highlight position and size based on selected item
  const selectedItem = items.find(i => i.value === value)
  let computedPosition = 0
  let computedSize = 0

  if (selectedItem) {
    // Position the highlight under the selected item
    // For simplicity, we'll use a proportional position
    const itemIndex = items.findIndex(i => i.value === value)
    if (itemIndex >= 0) {
      const itemWidth = 100 / items.length
      computedPosition = itemIndex * itemWidth
      computedSize = itemWidth
    }
  }

  // Animate highlight position on value change
  React.useEffect(() => {
    const animateHighlight = () => {
      // This would use Framer Motion for spring animation
      // For now, just set the state
      setHighlightPosition(computedPosition)
      setHighlightSize(computedSize)
    }

    animateHighlight()
  }, [value, computedPosition, computedSize])

  // Reduced motion: just position statically
  if (reducedMotion) {
    const itemWidth = 100 / items.length
    const itemIndex = items.findIndex(i => i.value === value)
    const position = itemIndex >= 0 ? itemIndex * itemWidth : 0
    const size = itemWidth

    return (
      <div className={cn(
        'flex rounded-md overflow-hidden',
        className
      )}>
        {items.map((item, index) => (
          <button
            key={item.value}
            type="button"
            className={cn(
              'flex-1 rounded-none flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
              item.disabled && 'opacity-50 cursor-not-allowed',
              item.value === value && 'border-b-2 border-[var(--accent)] text-[var(--accent)]',
              item.value !== value && 'text-[var(--muted)] hover:text-[var(--text)]'
            )}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => item.disabled ? null : handleItemClick(item.value)}
            disabled={item.disabled}
            aria-disabled={item.disabled}
          >
            {item.label}
          </button>
        ))}
        {/* Static highlight */}
        <div
          className={cn(
            'absolute bottom-0 left-0 h-0.5 w-full bg-[var(--accent)] transition-all duration-[var(--t-base)]',
            !reducedMotion && 'transform origin-left scale-x-100',
            reducedMotion && `transform: translateX(${position}%) scaleX(${size}%);`
          )}
        />
      </div>
    )
  }

  return (
    <div className={cn(
      'flex rounded-md overflow-hidden',
      variant === 'neon' && 'border border-[var(--accent)]'
    )} aria-label="Select players">
      {items.map((item, index) => (
        <button
          key={item.value}
          type="button"
          className={cn(
            'flex-1 rounded-none flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-[var(--t-base)]',
            item.disabled && 'opacity-50 cursor-not-allowed',
            item.value === value && cn(
              'relative text-[var(--accent)] bg-[var(--surface-2)] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--accent)] after:rounded-bl-md after:after:rounded-bl-md',
              isPressed && 'scale-[0.95]'
            ),
            item.value !== value && 'text-[var(--muted)] hover:text-[var(--text)]'
          )}
          onPointerDown={(e) => handlePointerDown(e, item.value)}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onClick={() => item.disabled ? null : handleItemClick(item.value)}
          disabled={item.disabled}
          aria-disabled={item.disabled}
          style={{ ['--layout-id' as any]: layoutId }}
        >
          {item.label}
        </button>
      ))}
      {/* Animated highlight with Framer Motion layoutId */}
      <div
        className={cn(
          'absolute bottom-0 left-[var(--highlight-position)] h-0.5 w-[var(--highlight-size)] bg-[var(--ok)] transition-transform duration-[var(--t-base)] ease-out',
          isPressed && 'scale-[0.95]',
          !isPressed && 'scale-100'
        )}
        style={{
          ['--highlight-position' as any]: `${highlightPosition}%`,
          ['--highlight-size' as any]: `${highlightSize}%`,
        }}
      />
    </div>
  )
}

// Storybook stories
export const Default = () => {
  const [value, setValue] = React.useState('1')
  return (
    <SegmentedControl
      items={[
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
      ]}
      value={value}
      onValueChange={setValue}
      layoutId="players-control"
    />
  )
}

export const WithNeon = () => {
  const [value, setValue] = React.useState('3')
  return (
    <SegmentedControl
      items={[
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
      ]}
      value={value}
      onValueChange={setValue}
      variant="neon"
      layoutId="neon-players"
    />
  )
}

export const DisabledItems = () => {
  const [value, setValue] = React.useState('3')
  return (
    <SegmentedControl
      items={[
        { value: '1', label: '1' },
        { value: '2', label: '2', disabled: true },
        { value: '3', label: '3' },
        { value: '4', label: '4', disabled: true },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
      ]}
      value={value}
      onValueChange={setValue}
    />
  )
}