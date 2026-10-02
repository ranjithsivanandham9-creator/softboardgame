'use client'

import * as React from 'react'
import { FocusModal } from '@/components/FocusModal'
import { useState, useEffect, useRef } from 'react'

export interface BuyRepositoryProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  repoName: string
  price: number
  techDebtFee: number
  rsuBalance: number
  onBuy?: () => void
  onPass?: () => void
}

export function BuyRepository({ isOpen, onOpenChange, repoName, price, techDebtFee, rsuBalance, onBuy, onPass }: BuyRepositoryProps) {
  const [displayPrice, setDisplayPrice] = useState(price)
  const [rsuCounter, setRsuCounter] = useState(rsuBalance)
  const [animated, setAnimated] = useState(false)

  // Odometer animation for RSU counter
  React.useEffect(() => {
    if (animated) {
      // Animate from current to new balance
      const start = rsuCounter
      const end = rsuBalance - price + techDebtFee // RSUs after purchase
      const duration = 1000
      const startTime = performance.now()

      const animate = () => {
        const elapsed = performance.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Odometer-style counting
        const counted = Math.round(start + (end - start) * progress)
        setRsuCounter(counted)
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }
  }, [animated, rsuBalance, price, techDebtFee])

  // Coin fly animation
  const handleBuy = () => {
    setAnimated(true)
    setTimeout(() => {
      setAnimated(false)
      onBuy?.()
      onOpenChange(false)
    }, 1500)
  }

  // Pass handler
  const handlePass = () => {
    onPass?.()
    onOpenChange(false)
  }

  return (
    <FocusModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Buy Repository"
      onBuy={handleBuy}
      onPass={handlePass}
    >
      <div className="space-y-6">
        {/* Repo info */}
        <div>
          <p className="text-body-strong">Repository: {repoName}</p>
          <p className="text-sm text-[var(--muted)]">
            Tech debt fee: {techDebtFee}% of price
          </p>
          <p className="text-sm text-[var(--muted)]">
            RSU balance after purchase: {rsuBalance - price + techDebtFee}
          </p>
        </div>

        {/* RSU counter with odometer animation */}
        <p className="text-h3 font-medium">
          {rsuCounter} RSUs
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleBuy}
            className="flex-1 rounded-md px-4 py-2 bg-[var(--ok)] text-[var(--bg)] font-medium transition-colors hover:bg-[var(--accent)]"
          >
            Buy
          </button>
          <button
            onClick={handlePass}
            className="flex-1 rounded-md px-4 py-2 bg-[var(--surface-2)] text-[var(--text)] font-medium transition-colors"
          >
            Pass
          </button>
        </div>
      </div>
    </FocusModal>
  )
}