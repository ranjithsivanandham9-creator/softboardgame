'use client'

import * as React from 'react'

// Storage keys
const STORAGE_KEY = 'tut.v1'
const DISABLED_KEY = 'tut.disabled'

type TutorialStatus = 'seen' | 'skipped'

export type TutorialFeature = {
  id: string
  title?: string
  trigger: string
  steps: {
    element: string
    text: string
    requireAction?: boolean
  }[]
}

// Get persisted state
const getPersistedState = (): {
  seen: Record<string, TutorialStatus>
  disabled: boolean
} => {
  try {
    const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    const disabled = localStorage.getItem(DISABLED_KEY) === 'true'
    return { seen, disabled }
  } catch {
    return { seen: {}, disabled: false }
  }
}

// Save state
const saveState = (state: { seen: Record<string, TutorialStatus>; disabled: boolean }) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.seen))
    localStorage.setItem(DISABLED_KEY, String(state.disabled))
  } catch {
    // Ignore storage errors
  }
}

// Feature check: should a feature fire?
export const shouldFireFeature = (
  featureId: string,
  force = false
): { fire: boolean; seen: TutorialStatus; disabled: boolean } => {
  const { seen, disabled } = getPersistedState()
  const currentStatus = (seen[featureId] ?? 'skipped') as TutorialStatus

  if (disabled && !force) {
    return { fire: false, seen: currentStatus, disabled }
  }

  if (force) {
    // force:true ignores both without changing them
    return { fire: true, seen: currentStatus, disabled }
  }

  const alreadySeen = seen[featureId]
  if (alreadySeen === 'seen') {
    return { fire: false, seen: currentStatus, disabled }
  }

  if (alreadySeen === 'skipped') {
    return { fire: false, seen: currentStatus, disabled }
  }

  // First encounter - mark as seen
  const newSeen = { ...seen, [featureId]: 'seen' as TutorialStatus }
  saveState({ seen: newSeen, disabled })
  return { fire: true, seen: 'seen', disabled }
}

// Persistence toggle
export const toggleFeatureDisabled = () => {
  const { disabled } = getPersistedState()
  saveState({ seen: getPersistedState().seen, disabled: !disabled })
}

// Hook: complete tutorial engine
export function useTutorialEngine(features: Record<string, TutorialFeature>) {
  const [state, setState] = React.useState(() => getPersistedState())

  const startTutorial = React.useCallback((featureId: string, opts?: { force?: boolean }) => {
    const { fire, disabled } = shouldFireFeature(featureId, opts?.force)

    if (!fire) return

    const feature = features[featureId]
    if (!feature) return

    const { seen } = getPersistedState()
    const newSeen = { ...seen, [featureId]: 'seen' as TutorialStatus }
    saveState({ seen: newSeen, disabled })
  }, [features])

  const skipFeature = React.useCallback((featureId: string) => {
    const { seen, disabled } = getPersistedState()
    const newSeen: Record<string, TutorialStatus> = { ...seen, [featureId]: 'skipped' }
    saveState({ seen: newSeen, disabled })
  }, [])

  const disableAll = React.useCallback(() => {
    saveState({ seen: getPersistedState().seen, disabled: true })
  }, [])

  const reEnable = React.useCallback(() => {
    saveState({ seen: getPersistedState().seen, disabled: false })
  }, [])

  const isFeatureSeen = (featureId: string) => {
    const { seen } = getPersistedState()
    return seen[featureId] === 'seen'
  }

  const isFeatureSkipped = (featureId: string) => {
    const { seen } = getPersistedState()
    return seen[featureId] === 'skipped'
  }

  const isFeatureDisabled = () => {
    const { disabled } = getPersistedState()
    return disabled
  }

  return {
    state,
    startTutorial,
    skipFeature,
    disableAll,
    reEnable,
    isFeatureSeen,
    isFeatureSkipped,
    isFeatureDisabled,
  }
}

// Nine tutorial features from PRD 13.4
export const tutorialFeatures = {
  home_intro: {
    id: 'home_intro',
    trigger: 'Tap "Show me" on the chip',
    steps: [
      { element: '[data-t=create]', text: 'Create a sprint, pick a length, then send the link to your team. Solo works too: you play against Manager Bot.' },
      { element: '[data-t=join]', text: 'Got a code from a colleague? Enter it here to join.' },
      { element: '[data-t=daily]', text: 'A 3-minute puzzle, same board for everyone, every day. Keep your streak alive.' },
    ],
  },
  lobby_setup: {
    id: 'lobby_setup',
    trigger: 'First time in Lobby',
    steps: [
      { element: '[data-t=players]', text: 'Choose how many seats. 1 to 6 players.' },
      { element: '[data-t=duration]', text: '5, 10 or 15 minutes. The clock is real: a wave of layoffs starts at 70%.' },
      { element: '[data-t=avatars]', text: 'Pick your avatar. Taken ones are locked for everyone.' },
      { element: '[data-t=invite]', text: 'Anyone here can copy the invite link. Only the host presses Start.' },
    ],
  },
  board_basics: {
    id: 'board_basics',
    trigger: 'First match starts',
    steps: [
      { element: '[data-t=corner]', text: 'This is the Corner Office. First to reach it wins instantly.' },
      { element: '[data-t=timer]', text: 'If the clock hits zero first, the highest valuation wins.' },
      { element: '[data-t=roster]', text: 'Your RSUs are your money. Keep them above zero.' },
    ],
  },
  wheel_first_spin: {
    id: 'wheel_first_spin',
    trigger: 'First own turn',
    steps: [
      { element: '[data-t=wheel]', text: 'Spin the Velocity Wheel. Story points are the squares you move.' },
    ],
  },
  buy_first: {
    id: 'buy_first',
    trigger: 'First landing on an unowned repository',
    steps: [
      { element: '[data-t=buy]', text: 'Buy this repository with RSUs. When rivals land here, they pay you tech debt.' },
      { element: '[data-t=pass]', text: 'Or pass and keep your cash.' },
    ],
  },
  jump_first: {
    id: 'jump_first',
    trigger: 'First ladder or PIP trap',
    steps: [
      { element: 'the tile', text: 'Green pipes are promotions: jump ahead. Red signs are PIPs: you drop back.' },
    ],
  },
  incident_first: {
    id: 'incident_first',
    trigger: 'First incident or card',
    steps: [
      { element: 'modal', text: 'Incidents and cards apply instantly. Read fast: they auto-close.' },
    ],
  },
  wave_first: {
    id: 'wave_first',
    trigger: '15 s before the first collapse (non-blocking)',
    steps: [
      { element: 'outer ring', text: 'Layoff Wave! The outer ring collapses. Move inward or get laid off.' },
    ],
  },
  daily_first: {
    id: 'daily_first',
    trigger: 'First Daily run',
    steps: [
      { element: '[data-t=modifier]', text: 'Today\'s twist changes the rules.' },
      { element: '[data-t=turns]', text: '12 turns. Score as high as you can.' },
    ],
  },
}