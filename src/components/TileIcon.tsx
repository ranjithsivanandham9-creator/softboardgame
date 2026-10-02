'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type TileIconName = 
  | 'start'
  | 'repository'
  | 'promotion'
  | 'pip-trap'
  | 'incident'
  | 'draw-card'
  | 'open-floor'
  | 'corner-office'
  | 'laid-off'

export type TileTheme = 'dark' | 'light'

export interface TileIconProps {
  name: TileIconName
  theme?: TileTheme
  size?: number
  className?: string
}

// Map tile names to their dark/light SVG paths
const tileSvgDark: Record<TileIconName, string> = {
  start: require('/public/tiles/start.svg'),
  repository: require('/public/tiles/repository-dark.svg'),
  promotion: require('/public/tiles/promotion-dark.svg'),
  'pip-trap': require('/public/tiles/pip-trap-dark.svg'),
  incident: require('/public/tiles/incident-dark.svg'),
  'draw-card': require('/public/tiles/draw-card-dark.svg'),
  'open-floor': require('/public/tiles/open-floor-dark.svg'),
  'corner-office': require('/public/tiles/corner-office-dark.svg'),
  'laid-off': require('/public/tiles/laid-off-dark.svg'),
}

const tileSvgLight: Record<TileIconName, string> = {
  start: require('/public/tiles/light/start.svg'),
  repository: require('/public/tiles/light/repository.svg'),
  promotion: require('/public/tiles/light/promotion.svg'),
  'pip-trap': require('/public/tiles/light/pip-trap.svg'),
  incident: require('/public/tiles/light/incident.svg'),
  'draw-card': require('/public/tiles/light/draw-card.svg'),
  'open-floor': require('/public/tiles/light/open-floor.svg'),
  'corner-office': require('/public/tiles/light/corner-office.svg'),
  'laid-off': require('/public/tiles/light/laid-off.svg'),
}

export function TileIcon({ name, theme = 'dark', size = 48, className }: TileIconProps) {
  const svgPath = theme === 'dark' ? tileSvgDark[name] : tileSvgLight[name]
  
  // Extract the SVG content from the require statement
  // In production, this would be handled differently
  const svgComponents: Record<TileIconName, React.ComponentType> = {
    start: require('/public/tiles/start.svg').default,
    repository: require('/public/tiles/repository-dark.svg').default,
    promotion: require('/public/tiles/promotion-dark.svg').default,
    'pip-trap': require('/public/tiles/pip-trap-dark.svg').default,
    incident: require('/public/tiles/incident-dark.svg').default,
    'draw-card': require('/public/tiles/draw-card-dark.svg').default,
    'open-floor': require('/public/tiles/open-floor-dark.svg').default,
    'corner-office': require('/public/tiles/corner-office-dark.svg').default,
    'laid-off': require('/public/tiles/laid-off-dark.svg').default,
  }

  const IconComponent = svgComponents[name]
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      className={cn(className, 'overflow-hidden')}
      fill="currentColor"
    >
      <IconComponent width={size} height={size} viewBox="0 0 96 96" />
    </svg>
  )
}

// Storybook stories
if (typeof window !== 'undefined' && window.__STORYBOOK__) {
  export const Dark = () => (
    <div className="grid grid-cols-4 gap-2">
      {['start', 'repository', 'promotion', 'pip-trap', 'incident', 'draw-card', 'open-floor', 'corner-office', 'laid-off'].map(name => (
        <TileIcon key={name} name={name as any} theme="dark" size={32} />
      ))}
    </div>
  )

  export const Light = () => (
    <div className="grid grid-cols-4 gap-2">
      {['start', 'repository', 'promotion', 'pip-trap', 'incident', 'draw-card', 'open-floor', 'corner-office', 'laid-off'].map(name => (
        <TileIcon key={name} name={name as any} theme="light" size={32} />
      ))}
    </div>
  )

  export const DarkLightComparison = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="text-caption text-[var(--muted)] dark:text-[var(--text)]">Dark</h4>
        <div className="grid grid-cols-4 gap-1">
          {['start', 'repository', 'promotion'].map(n => (
            <TileIcon key={n} name={n as any} theme="dark" size={24} />
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-caption text-[var(--muted)] dark:text-[var(--text)]">Light</h4>
        <div className="grid grid-cols-4 gap-1">
          {['start', 'repository', 'promotion'].map(n => (
            <TileIcon key={n} name={n as any} theme="light" size={24} />
          ))}
        </div>
      </div>
    </div>
  )
}