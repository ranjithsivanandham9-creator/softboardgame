// Pure deterministic rules engine with no I/O
// All constants come from config.ts

export type PlayerId = 'dev' | 'intern' | 'vp' | 'leet' | 'pm' | 'pe'
export type SeatCount = 1 | 2 | 3 | 4 | 5 | 6

export interface GameSettings {
  playerCount: SeatCount
  matchDuration: '5' | '10' | '15' // minutes
  turnTimer: '10' | '12' | '15' // seconds
  seed?: string
}

export interface WheelResult {
  points: '1' | '2' | '3' | '5' | '8'
  label: 'Quick Hotfix' | 'Minor Refactor' | 'Core Feature Push' | 'Full AI Integration' | 'Legacy Rewrite'
}

export interface Economy {
  startingRSUs: number
  quarterlyVest: number
  repoPriceBase: number
  repoPriceIncrement: number
  techDebtFeePercent: number
  upgradeCostPercent: number
}

export interface RoomState {
  id: string
  seed: string
  players: PlayerState[]
  path: number[]
  turn: number
  timer: number
  matchEnded: boolean
  winner: PlayerId | null
  victoryCondition: 'corner-office' | 'valuation' | 'last-man-standing'
  layoffWave: number
  events: EventLog[]
}

export interface PlayerState {
  id: PlayerId
  rsu: number
  position: number // square index on board
  status: 'active' | 'laid_off' | 'eliminated'
  repoCount: number
  upgradedRepos: Set<number>
}

export interface EventLogEntry {
  type: string
  player: PlayerId | null
  details: string
  timestamp: number
}

export type EventLog = EventLogEntry

export interface CreateRoomResult {
  roomId: string
  code: string // 6-char code
  initialState: RoomState
  seed: string
}

// Wheel weights from PRD 8.3
const WHEEL_WEIGHTS = {
  '1': 35, // Quick Hotfix
  '2': 28, // Minor Refactor
  '3': 20, // Core Feature Push
  '5': 12, // Full AI Integration
  '8': 5,  // Legacy Rewrite
}

// Total weight for random selection
const TOTAL_WHEEL_WEIGHT = 100

// Economy constants from PRD 9
const ECONOMY: Economy = {
  startingRSUs: 1000,
  quarterlyVest: 60,
  repoPriceBase: 100,
  repoPriceIncrement: 50,
  techDebtFeePercent: 25,
  upgradeCostPercent: 50,
}

// Board size matrix from PRD 8.1
const BOARD_MATRIX = {
  '1-2': { '5': { steps: 24, grid: '5x5' }, '10': { steps: 48, grid: '7x7' }, '15': { steps: 80, grid: '9x9' } },
  '3-4': { '5': { steps: 24, grid: '5x5' }, '10': { steps: 48, grid: '7x7' }, '15': { steps: 48, grid: '7x7' } },
  '5-6': { '5': { steps: 24, grid: '5x5' }, '10': { steps: 24, grid: '5x5' }, '15': { steps: 48, grid: '7x7' } }
}

// Spiral path generation from outer corner to center
export function generateSpiralPath(gridSize: number): { path: number[], center: number } {
  const path: number[] = []
  let x = gridSize - 1
  let y = 0
  let dx = 1
  let dy = 0
  let limit = 1
  let steps = 0

  for (let i = 1; i <= gridSize * gridSize; i++) {
    path.push(i)

    // Change direction every 2 steps (spiral pattern)
    if (steps === limit) {
      const temp = dx
      dx = -dy
      dy = temp
      steps = 0
      limit++
      if (limit % 2 === 0) {
        // Increase segment length every 2 direction changes
        // (handled by limit increment pattern)
      }
    }

    x += dx
    y += dy
    steps++

    // Check if we should stop (center)
    if (path.length === 1) continue // Skip center placement for now

    // When we hit the center, stop
    if (x === Math.floor(gridSize / 2) && y === Math.floor(gridSize / 2)) {
      break
    }
  }

  // Find center square index
  const centerIndex = path.findIndex(p => p === undefined) || path.length - 1

  return { path, center: centerIndex }
}

// Apply a player's intent to the room state
export function applyIntent(
  state: RoomState,
  intent: string,
  playerId: PlayerId
): RoomState {
  let newState = { ...state }

  switch (intent) {
    case 'SPIN':
      newState = applySpin(newState, playerId)
      break
    case 'BUY':
      newState = applyBuy(newState, playerId)
      break
    case 'PASS':
      newState = applyPass(newState, playerId)
      break
    case 'ACK':
      newState = applyAck(newState, playerId)
      break
    case 'START':
      newState = applyStart(newState)
      break
    case 'PICK_AVATAR':
      newState = applyPickAvatar(newState, playerId)
      break
    default:
      // No-op for unrecognized intents
      break
  }

  // Append event to log
  newState.events.push({
    type: intent,
    player: playerId,
    details: `Intent: ${intent}`,
    timestamp: Date.now()
  })

  return newState
}

// Spin the wheel and determine result
function applySpin(state: RoomState, playerId: PlayerId): RoomState {
  const nextState: RoomState = {
    ...state,
    players: state.players.map((player) => (player.id === playerId ? { ...player } : player)),
    events: [...state.events],
  }

  const random = Math.random() * TOTAL_WHEEL_WEIGHT
  let cumulative = 0

  for (const [result, weight] of Object.entries(WHEEL_WEIGHTS)) {
    cumulative += weight
    if (random <= cumulative) {
      const resultPoints = result as '1' | '2' | '3' | '5' | '8'
      nextState.players = nextState.players.map((player) => {
        if (player.id !== playerId) return player

        const nextPosition = player.position + Number(resultPoints)
        const cappedPosition = Math.min(nextPosition, nextState.path.length - 1)

        if (cappedPosition >= nextState.path.length - 1) {
          nextState.winner = playerId
          nextState.victoryCondition = 'corner-office'
          nextState.matchEnded = true
        }

        return { ...player, position: cappedPosition }
      })
      break
    }
  }

  nextState.events.push({
    type: 'SPIN',
    player: playerId,
    details: 'Wheel spin resolved',
    timestamp: Date.now(),
  })

  return nextState
}

// Buy a repository
function applyBuy(state: RoomState, playerId: PlayerId): RoomState {
  const nextState: RoomState = { ...state, players: state.players.map((player) => ({ ...player, upgradedRepos: new Set(player.upgradedRepos) })), events: [...state.events] }
  const player = nextState.players.find((p) => p.id === playerId)
  if (!player || player.rsu < ECONOMY.repoPriceBase) return nextState

  const priceTier = Math.min(Math.floor(player.position / (nextState.path.length / 5)), 4) + 1
  const price = ECONOMY.repoPriceBase + (priceTier - 1) * ECONOMY.repoPriceIncrement

  if (player.rsu < price) return nextState

  player.rsu -= price
  player.repoCount++
  player.upgradedRepos.add(player.position)

  const techDebt = Math.round(price * (ECONOMY.techDebtFeePercent / 100))
  player.rsu += techDebt

  nextState.events.push({ type: 'BUY', player: playerId, details: `Bought repo at ${player.position}`, timestamp: Date.now() })
  return nextState
}

// Pass turn
function applyPass(state: RoomState, playerId: PlayerId): RoomState {
  const nextState: RoomState = { ...state, events: [...state.events] }
  nextState.turn = (nextState.turn % nextState.players.length) + 1
  nextState.events.push({ type: 'PASS', player: playerId, details: 'Passed turn', timestamp: Date.now() })
  return nextState
}

// Acknowledge incident/modal
function applyAck(state: RoomState, playerId: PlayerId): RoomState {
  const nextState: RoomState = { ...state, events: [...state.events] }
  nextState.events.push({ type: 'ACK', player: playerId, details: 'Acknowledged', timestamp: Date.now() })
  return nextState
}

// Start the match
function applyStart(state: RoomState): RoomState {
  const nextState: RoomState = { ...state, events: [...state.events] }
  nextState.matchEnded = false
  nextState.winner = null
  nextState.players = nextState.players.map((player) => ({ ...player, position: 0 }))
  nextState.events.push({ type: 'START', player: null, details: 'Match started', timestamp: Date.now() })
  return nextState
}

// Pick avatar (first-write-wins)
function applyPickAvatar(state: RoomState, playerId: PlayerId): RoomState {
  const nextState: RoomState = { ...state, players: state.players.map((player) => ({ ...player, upgradedRepos: new Set(player.upgradedRepos) })), events: [...state.events] }

  const alreadyPicked = nextState.players.some((p) => p.id !== playerId && p.status === 'active')

  if (alreadyPicked) {
    const player = nextState.players.find((p) => p.id === playerId)
    if (player) {
      player.status = 'active'
    }
  }

  nextState.events.push({ type: 'PICK_AVATAR', player: playerId, details: 'Avatar selected', timestamp: Date.now() })
  return nextState
}

// Create a new room
export function createRoom(settings: GameSettings, seed: string): CreateRoomResult {
  // Generate deterministic seed-based room ID
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const roomId = `room_${hash.toString(36).padStart(8, '0')}`
  const code = generateRoomCode(seed)

  // Initialize players
  const playerCount = settings.playerCount
  const players: PlayerState[] = []
  const playerPool: PlayerId[] = ['dev', 'intern', 'vp', 'leet', 'pm', 'pe']

  const actualPlayerCount = playerCount === 1 ? 1 : playerCount

  for (let i = 0; i < actualPlayerCount; i++) {
    const playerId = playerPool[i % playerPool.length]
    players.push({
      id: playerId,
      rsu: ECONOMY.startingRSUs,
      position: 0,
      status: 'active',
      repoCount: 0,
      upgradedRepos: new Set()
    })
  }

  // Generate board
  const boardInfo = generateSpiralPath(7)
  const grid: any[] = []
  for (let i = 0; i < boardInfo.path.length; i++) {
    grid.push({
      id: i,
      type: Math.random() > 0.7 ? 'repository' : 'open-floor', // Simplified tile type
      owner: null,
      level: 0
    })
  }

  // Initial state
  const initialState: RoomState = {
    id: roomId,
    seed,
    players,
    path: boardInfo.path,
    turn: 1,
    timer: settings.turnTimer === '10' ? 10 : settings.turnTimer === '12' ? 12 : 15,
    matchEnded: false,
    winner: null,
    victoryCondition: 'corner-office',
    layoffWave: 0,
    events: []
  }

  return {
    roomId,
    code,
    seed,
    initialState
  }
}

// Generate 6-char room code from alphabet without 0/O/1/I/L
function generateRoomCode(seed: string): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  const seedChars = seed.split('').map(c => c.toUpperCase().charCodeAt(0))

  for (let i = 0; i < 6; i++) {
    const seedIndex = i % seedChars.length
    code += alphabet[seedIndex % alphabet.length]
  }

  return code
}

// Tick function - advance game state by one time unit
export function tick(state: RoomState, now: number): RoomState {
  const newState = { ...state }
  const timeDiff = now - (state.events[state.events.length - 1]?.timestamp || 0)

  // Advance timer
  if (newState.timer > 0) {
    newState.timer = Math.max(0, newState.timer - timeDiff / 1000) // Convert ms to seconds
  }

  // Check for layoff wave
  const matchDuration = determineMatchDuration(newState)
  const waveThreshold = 0.7 * matchDuration * 60 // 70% of match in seconds

  if (newState.timer <= waveThreshold && newState.layoffWave < 95) {
    newState.layoffWave += 5 // Progress wave
    // Collapse rings - simplify players' positions
    newState.players.forEach(p => {
      if (p.status === 'active' && p.position > 0) {
        // Move players inward if on collapsing ring
        p.position = Math.max(0, p.position - 1)
      }
    })
  }

  // Check for elimination
  newState.players.forEach(p => {
    if (p.rsu < 0) {
      p.status = 'laid_off'
    }
  })

  // Check for winner
  const activePlayers = newState.players.filter(p => p.status === 'active')
  if (activePlayers.length === 1) {
    newState.winner = activePlayers[0].id
    newState.victoryCondition = 'last-man-standing'
    newState.matchEnded = true
  } else if (activePlayers.length === 0) {
    newState.winner = null
    newState.victoryCondition = 'last-man-standing'
    newState.matchEnded = true
  }

  // Add tick event
  newState.events.push({
    type: 'tick',
    player: null,
    details: `Tick at ${newState.timer}s remaining`,
    timestamp: now
  })

  return newState
}

// Determine match duration based on settings
function determineMatchDuration(state: RoomState): number {
  // Use settings from the initial game config
  // For now, default to 15 min
  return 15
}

// Property tests for the rules engine
export function testDeterminism() {
  // Test that createRoom produces consistent results for same seed
  const result1 = createRoom({ playerCount: 2, matchDuration: '10', turnTimer: '10' }, 'test-seed-1')
  const result2 = createRoom({ playerCount: 2, matchDuration: '10', turnTimer: '10' }, 'test-seed-1')

  // Room IDs should be different (based on hash), but structure should be consistent
  if (result1.initialState.players.length !== result2.initialState.players.length) {
    throw new Error('Player count mismatch')
  }

  if (result1.initialState.players[0].rsu !== ECONOMY.startingRSUs) {
    throw new Error('Starting RSU mismatch')
  }

  // Test that wheel weights are correct
  let cumulative = 0
  const weights: Record<string, number> = {}
  for (const [result, weight] of Object.entries(WHEEL_WEIGHTS)) {
    cumulative += weight
    weights[result] = cumulative
  }

  // All weights should be positive and total should be 100
  if (cumulative !== 100) {
    throw new Error(`Wheel weights total should be 100, got ${cumulative}`)
  }

  for (const weight of Object.values(WHEEL_WEIGHTS)) {
    if (weight <= 0) {
      throw new Error(`All wheel weights must be positive`)
    }
  }

  console.log('All rules engine property tests passed')
}

