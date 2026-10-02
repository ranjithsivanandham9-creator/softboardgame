'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type AvatarId = 'dev' | 'intern' | 'vp' | 'leet' | 'pm' | 'pe'
export type AvatarEmotion = 'idle' | 'happy' | 'shock' | 'smug' | 'sweat' | 'laid_off' | 'win'
export type AvatarSize = number

interface AvatarProps {
  id: AvatarId
  emotion?: AvatarEmotion
  size: AvatarSize
  speaking?: boolean
  onPointerMove?: (e: React.PointerEvent) => void
}

const emotionConfigs: Record<AvatarEmotion, {
  mouthOpen: boolean
  mouthScale: number
  browOffset: number
  eyeOffset: { x: number; y: number }
  headRotate: number
}> = {
  idle: {
    mouthOpen: false,
    mouthScale: 0,
    browOffset: 0,
    eyeOffset: { x: 0, y: 0 },
    headRotate: 0,
  },
  happy: {
    mouthOpen: true,
    mouthScale: 1,
    browOffset: -2,
    eyeOffset: { x: 0, y: -2 },
    headRotate: 0,
  },
  shock: {
    mouthOpen: true,
    mouthScale: 1.5,
    browOffset: -4,
    eyeOffset: { x: 0, y: -4 },
    headRotate: 0,
  },
  smug: {
    mouthOpen: false,
    mouthScale: 0,
    browOffset: 1,
    eyeOffset: { x: 2, y: 0 },
    headRotate: 0,
  },
  sweat: {
    mouthOpen: false,
    mouthScale: 0,
    browOffset: 0,
    eyeOffset: { x: -2, y: 1 },
    headRotate: 0,
  },
  laid_off: {
    mouthOpen: false,
    mouthScale: 0,
    browOffset: 0,
    eyeOffset: { x: 0, y: 0 },
    headRotate: 0,
  },
  win: {
    mouthOpen: true,
    mouthScale: 1,
    browOffset: 2,
    eyeOffset: { x: 0, y: 2 },
    headRotate: 0,
  },
}

const avatarColors: Record<AvatarId, { skin: string; hair: string; outfit: string; backdrop: string }> = {
  dev: { skin: '#E8B98F', hair: '#2B2118', outfit: '#4B4F73', backdrop: '#3B2F5E' },
  intern: { skin: '#F1C9A5', hair: '#8A4B1F', outfit: '#22C55E', backdrop: '#12483B' },
  vp: { skin: '#D9A47A', hair: '#C4C8CE', outfit: '#EF4444', backdrop: '#42324F' },
  leet: { skin: '#C68B63', hair: '#111111', outfit: '#EF4444', backdrop: '#4A2530' },
  pm: { skin: '#F3D2B5', hair: '#5B2A86', outfit: '#F59E0B', backdrop: '#3E3A1E' },
  pe: { skin: '#E2AE86', hair: '#E5E7EB', outfit: '#0EA5E9', backdrop: '#173B4D' },
}

export function Avatar({ id, emotion = 'idle', size = 200, speaking = false, onPointerMove }: AvatarProps) {
  const colors = avatarColors[id]
  const config = emotionConfigs[emotion]
  const [pointerPos, setPointerPos] = React.useState({ x: 0, y: 0 })
  const [animationFrame, setAnimationFrame] = React.useState(0)

  // Idle head bob animation
  React.useEffect(() => {
    let cancelled = false
    let frame = 0

    const animate = () => {
      if (cancelled) return
      const t = frame / 180
      const headRotate = Math.sin(t * Math.PI) * 1.6
      const bobY = Math.sin(t * Math.PI) * 1
      
      // Apply transform
      const svg = document.querySelector(`#avatar-${id}`)
      if (svg) {
        svg.style.transformOrigin = 'center center'
        svg.style.transform = `rotate(${headRotate}deg) translateY(${bobY}px)`
      }
      frame++
      setAnimationFrame(requestAnimationFrame(animate))
    }

    const id = requestAnimationFrame(animate)
    return () => {
      cancelled = true
      cancelAnimationFrame(id)
    }
  }, [id])

  // Random blink
  React.useEffect(() => {
    let cancelled = false
    let blinkTimeout: NodeJS.Timeout | null = null

    const scheduleBlink = () => {
      if (cancelled) return
      const interval = id === 'dev' ? 7000 : 3000 + Math.random() * 3000
      blinkTimeout = setTimeout(() => {
        // Trigger blink - lid closes and opens
        const svg = document.querySelector(`#avatar-${id}`)
        if (svg) {
          svg.style.transition = 'transform 140ms ease-in-out'
          svg.style.transform = 'scaleY(0.5)'
          setTimeout(() => {
            svg.style.transform = 'scaleY(1)'
          }, 140)
        }
        scheduleBlink()
      }, interval)
    }

    scheduleBlink()
    return () => {
      cancelled = true
      if (blinkTimeout) clearTimeout(blinkTimeout)
    }
  }, [id])

  // Pupil tracking
  React.useEffect(() => {
    let cancelled = false
    const svg = document.querySelector(`#avatar-${id}`)
    if (!svg) return

    const handleMouseMove = (e: MouseEvent) => {
      if (cancelled) return
      const rect = svg.getBoundingClientRect()
      const x = e.clientX - rect.left - 200 // center x
      const y = e.clientY - rect.top - 214 // center y
      
      // Max 3px x, 2px y movement
      const maxX = 3
      const maxY = 2
      const moveX = Math.max(-maxX, Math.min(maxX, x / 100 * maxX))
      const moveY = Math.max(-maxY, Math.min(maxY, y / 100 * maxY))
      
      svg.style.transform = `translate(${moveX}px, ${moveY}px)`
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      cancelled = true
      window.removeEventListener('mousemove', handleMouseMove)
      if (svg) svg.style.transform = ''
    }
  }, [id])

  // Brow flick
  React.useEffect(() => {
    let cancelled = false
    let browTimeout: NodeJS.Timeout | null = null

    const flickBrow = () => {
      if (cancelled) return
      const svg = document.querySelector(`#avatar-${id}`)
      if (svg) {
        svg.style.transition = 'transform 400ms ease'
        svg.style.transform = `rotate(${config.browOffset}deg)`
        setTimeout(() => {
          svg.style.transform = 'rotate(0deg)'
        }, 400)
      }
      // Random flick every 5-8 seconds
      const interval = 5000 + Math.random() * 3000
      browTimeout = setTimeout(flickBrow, interval)
    }

    browTimeout = setTimeout(flickBrow, 5000)
    return () => {
      cancelled = true
      if (browTimeout) clearTimeout(browTimeout)
    }
  }, [id, config.browOffset])

  // Speaking animation - mouth open
  React.useEffect(() => {
    const svg = document.querySelector(`#avatar-${id}`)
    if (!svg) return

    if (speaking) {
      svg.style.transition = 'transform 1.1s ease-in-out'
      svg.style.transform = 'scaleY(0.25)'
      // Loop the talk animation
      let reversed = false
      const interval = setInterval(() => {
        if (reversed) {
          svg.style.transform = 'scaleY(0.25)'
        } else {
          svg.style.transform = 'scaleY(1)'
        }
        reversed = !reversed
      }, 550)
      
      return () => {
        clearInterval(interval)
        svg.style.transform = 'scaleY(1)'
      }
    } else {
      svg.style.transition = 'transform 1.1s ease-in-out'
      svg.style.transform = 'scaleY(1)'
    }
  }, [speaking, id])

  // Determine which SVG groups to show based on emotion
  const getEmotionClasses = (emo: AvatarEmotion) => {
    const base = ''
    const mouth = emotionConfigs[emo].mouthOpen ? ' mouth-open-visible' : ' mouth-closed'
    const brow = emotionConfigs[emo].browOffset !== 0 ? ' brow-raised' : ''
    const eye = emotionConfigs[emo].eyeOffset.x !== 0 || emotionConfigs[emo].eyeOffset.y !== 0 ? ' eye-shifted' : ''
    const head = emotionConfigs[emo].headRotate !== 0 ? ' head-rotated' : ''
    return base + mouth + brow + eye + head
  }

  // SVG with named groups
  const svgId = `avatar-${id}`
  
  return (
    <svg
      id={svgId}
      width={size}
      height={size}
      viewBox="0 0 400 428"
      style={{ width: '100%', height: '100%' }}
      aria-label={id === 'dev' ? 'The Burned-Out Dev' : id === 'intern' ? 'The Grindset Intern' : id === 'vp' ? 'The Buzzword VP' : id === 'leet' ? 'The Leetcode Maxxer' : id === 'pm' ? 'The Vibe-Coding PM' : 'Principal Engineer Who Left in 2019'}
      role="img"
    >
      <g class="bg">
        {/* Backdrop - color depends on avatar */}
        <circle cx="200" cy="214" r="180" fill={colors.backdrop} opacity="0.3"/>
      </g>
      
      <g class="body" fill={colors.skin}>
        <path d="M150 200 Q100 250 150 300 Q200 350 250 300 Q300 250 250 200 Q200 150 150 150 Z"/>
      </g>
      
      <g class="neck">
        <rect x="195" y="300" width="10" height="20" fill={colors.outfit} rx="2"/>
      </g>
      
      <g class="head">
        <ellipse cx="200" cy="214" rx="180" ry="190" fill={colors.skin}/>
      </g>
      
      <g class="ear_L">
        <ellipse cx="130" cy="220" rx="25" ry="30" fill={colors.skin}/>
      </g>
      
      <g class="ear_R">
        <ellipse cx="270" cy="220" rx="25" ry="30" fill={colors.skin}/>
      </g>
      
      <g class="hair_back">
        {/* Simple hair shape */}
      </g>
      
      <g class="hair_front">
        {/* Simple hair shape */}
      </g>
      
      <g class="brow_L" transform="rotate({config.browOffset} 130 220)">
        {/* Brow shape */}
      </g>
      
      <g class="brow_R" transform="rotate({config.browOffset} 270 220)">
        {/* Brow shape */}
      </g>
      
      <g class="eye_L" transform={`translate(${config.eyeOffset.x}px, ${config.eyeOffset.y}px)`}>
        <circle cx="150" cy="200" r="35" fill="#FFF"/>
        <circle cx="150" cy="200" r="18" fill={colors.skin}/>
        <circle cx="150" cy="200" r="8" fill="#1A1410"/>
        <circle cx="145" cy="195" r="5" fill="#FFF" opacity="0.5"/>
      </g>
      
      <g class="eye_R" transform={`translate(${config.eyeOffset.x}px, ${config.eyeOffset.y}px)`}>
        <circle cx="250" cy="200" r="35" fill="#FFF"/>
        <circle cx="250" cy="200" r="18" fill={colors.skin}/>
        <circle cx="250" cy="200" r="8" fill="#1A1410"/>
        <circle cx="245" cy="195" r="5" fill="#FFF" opacity="0.5"/>
      </g>
      
      <g class="nose">
        <ellipse cx="200" cy="230" rx="15" ry="12" fill="#2B2118"/>
      </g>
      
      <g class="cheek_L">
        <circle cx="160" cy="240" r="12" fill={colors.skin} opacity="0.3"/>
      </g>
      
      <g class="cheek_R">
        <circle cx="240" cy="240" r="12" fill={colors.skin} opacity="0.3"/>
      </g>
      
      <g class="mouth_closed">
        <path d="M180 260 Q200 270 220 260"/>
      </g>
      
      <g class="mouth_open" style={{ transform: speaking ? 'scaleY(0.25)' : 'scaleY(0)' }}}>
        <path d="M170 250 Q190 230 210 250 Q200 260 210 270 Q190 280 170 270 Z"/>
      </g>
      
      <g class="glasses" opacity={0}/>
      
      <g class="accessory">
        {/* Avatar-specific accessory */}
        {id === 'dev' && (
          <path d="M180 330 Q200 340 220 330 Q210 320 200 310 Z" fill="#FAFAFA" opacity="0.8"/>
        )}
      </g>
      
      <g class="frame_rim" stroke="rgba(255,255,255,0.15)" stroke-width="2" fill="none">
        <path d="M10 10 Q10 0 50 0 Q90 0 90 10 Q90 50 50 50 Q10 50 10 10 Z"/>
      </g>
    </svg>
  )
}

// Storybook page showing all avatars x all emotions
if (typeof window !== 'undefined' && window.__STORYBOOK__) {
  export function AvatarStory() {
    const emotions: AvatarEmotion[] = ['idle', 'happy', 'shock', 'smug', 'sweat', 'laid_off', 'win']
    const ids: AvatarId[] = ['dev', 'intern', 'vp', 'leet', 'pm', 'pe']
    const sizes = [100, 200, 300]

    return (
      <div>
        {ids.map(id => (
          <div key={id} className="space-y-4">
            <h3 className="text-h2 text-center text-[var(--text)]">{id === 'dev' ? 'Burned-Out Dev' : id === 'intern' ? 'Grindset Intern' : id === 'vp' ? 'Buzzword VP' : id === 'leet' ? 'Leetcode Maxxer' : id === 'pm' ? 'Vibe-Coding PM' : 'Principal Eng'}</h3>
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
    // Storybook auto layout
    sortName: 'name',
    sortBy: { order: 'asc' },
  }
}