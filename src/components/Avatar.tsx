'use client'

import * as React from 'react'

export type AvatarId = 'dev' | 'intern' | 'vp' | 'leet' | 'pm' | 'pe'
export type AvatarEmotion = 'idle' | 'happy' | 'shock' | 'smug' | 'sweat' | 'laid_off' | 'win'
export type AvatarSize = number

interface AvatarProps {
  id: AvatarId
  emotion?: AvatarEmotion
  size: AvatarSize
  speaking?: boolean
  onPointerMove?: (e: React.PointerEvent<SVGSVGElement>) => void
  onPointerEnter?: React.PointerEventHandler<SVGSVGElement>
  onPointerLeave?: React.PointerEventHandler<SVGSVGElement>
  style?: React.CSSProperties
  className?: string
}

const emotionConfigs: Record<AvatarEmotion, {
  mouthOpen: boolean
  browOffset: number
  eyeOffset: { x: number; y: number }
}> = {
  idle: { mouthOpen: false, browOffset: 0, eyeOffset: { x: 0, y: 0 } },
  happy: { mouthOpen: true, browOffset: -2, eyeOffset: { x: 0, y: -2 } },
  shock: { mouthOpen: true, browOffset: -4, eyeOffset: { x: 0, y: -4 } },
  smug: { mouthOpen: false, browOffset: 1, eyeOffset: { x: 2, y: 0 } },
  sweat: { mouthOpen: false, browOffset: 0, eyeOffset: { x: -2, y: 1 } },
  laid_off: { mouthOpen: false, browOffset: 0, eyeOffset: { x: 0, y: 0 } },
  win: { mouthOpen: true, browOffset: 2, eyeOffset: { x: 0, y: 2 } },
}

const avatarColors: Record<AvatarId, { skin: string; hair: string; outfit: string; backdrop: string }> = {
  dev: { skin: '#E8B98F', hair: '#2B2118', outfit: '#4B4F73', backdrop: '#3B2F5E' },
  intern: { skin: '#F1C9A5', hair: '#8A4B1F', outfit: '#22C55E', backdrop: '#12483B' },
  vp: { skin: '#D9A47A', hair: '#C4C8CE', outfit: '#EF4444', backdrop: '#42324F' },
  leet: { skin: '#C68B63', hair: '#111111', outfit: '#EF4444', backdrop: '#4A2530' },
  pm: { skin: '#F3D2B5', hair: '#5B2A86', outfit: '#F59E0B', backdrop: '#3E3A1E' },
  pe: { skin: '#E2AE86', hair: '#E5E7EB', outfit: '#0EA5E9', backdrop: '#173B4D' },
}

export function Avatar({
  id,
  emotion = 'idle',
  size = 200,
  speaking = false,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  style,
  className,
}: AvatarProps) {
  const colors = avatarColors[id]
  const config = emotionConfigs[emotion]
  const svgId = `avatar-${id}`

  return (
    <svg
      id={svgId}
      width={size}
      height={size}
      viewBox="0 0 400 428"
      style={{ width: '100%', height: '100%', ...style }}
      className={className}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      aria-label={
        id === 'dev'
          ? 'The Burned-Out Dev'
          : id === 'intern'
            ? 'The Grindset Intern'
            : id === 'vp'
              ? 'The Buzzword VP'
              : id === 'leet'
                ? 'The Leetcode Maxxer'
                : id === 'pm'
                  ? 'The Vibe-Coding PM'
                  : 'Principal Engineer Who Left in 2019'
      }
      role="img"
    >
      <circle cx="200" cy="214" r="180" fill={colors.backdrop} opacity="0.3" />
      <ellipse cx="200" cy="214" rx="155" ry="170" fill={colors.skin} />
      <circle cx="150" cy="200" r="28" fill="#fff" transform={`translate(${config.eyeOffset.x}px, ${config.eyeOffset.y}px)`} />
      <circle cx="250" cy="200" r="28" fill="#fff" transform={`translate(${config.eyeOffset.x}px, ${config.eyeOffset.y}px)`} />
      <circle cx="150" cy="200" r="12" fill="#1a1410" transform={`translate(${config.eyeOffset.x}px, ${config.eyeOffset.y}px)`} />
      <circle cx="250" cy="200" r="12" fill="#1a1410" transform={`translate(${config.eyeOffset.x}px, ${config.eyeOffset.y}px)`} />
      <path d="M180 260 Q200 275 220 260" stroke="#2b2118" strokeWidth="6" fill="none" strokeLinecap="round" opacity={config.mouthOpen ? 1 : 0.7} />
      <path d="M165 250 Q190 230 210 250 Q200 260 210 270 Q190 280 165 270 Z" fill="#f2b7b5" opacity={config.mouthOpen ? 1 : 0} transform={speaking ? 'scaleY(0.25)' : 'scaleY(0)'} />
      <path d="M165 230 L130 220" stroke="#2b2118" strokeWidth="8" strokeLinecap="round" transform={`rotate(${config.browOffset} 130 220)`} />
      <path d="M235 230 L270 220" stroke="#2b2118" strokeWidth="8" strokeLinecap="round" transform={`rotate(${config.browOffset} 270 220)`} />
      <path d="M175 330 Q200 340 225 330 Q210 320 200 310 Z" fill={colors.outfit} opacity="0.8" />
      <path d="M150 200 Q100 250 150 300 Q200 350 250 300 Q300 250 250 200 Q200 150 150 150 Z" fill={colors.skin} opacity="0.15" />
      <circle cx="200" cy="214" r="6" fill={colors.hair} opacity="0.25" />
    </svg>
  )
}

export function AvatarStory() {
  const emotions: AvatarEmotion[] = ['idle', 'happy', 'shock', 'smug', 'sweat', 'laid_off', 'win']
  const ids: AvatarId[] = ['dev', 'intern', 'vp', 'leet', 'pm', 'pe']

  return (
    <div>
      {ids.map(id => (
        <div key={id} className="space-y-4">
          <h3 className="text-h2 text-center text-[var(--text)]">
            {id === 'dev'
              ? 'Burned-Out Dev'
              : id === 'intern'
                ? 'Grindset Intern'
                : id === 'vp'
                  ? 'Buzzword VP'
                  : id === 'leet'
                    ? 'Leetcode Maxxer'
                    : id === 'pm'
                      ? 'Vibe-Coding PM'
                      : 'Principal Eng'}
          </h3>
          {emotions.map(emo => (
            <div key={emo} className="flex items-center gap-2">
              <Avatar id={id} emotion={emo} size={200} />
              <span className="text-caption text-[var(--muted)]">{emo}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

AvatarStory.parameters = {
  sortName: 'name',
  sortBy: { order: 'asc' },
}

export default Avatar
