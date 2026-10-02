// Socket.io server with Redis adapter for PIP Roulette
// Handles real-time multiplayer, room management, and state synchronization

import { createServer, hitAll, of as socketOf } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import type { Server as HTTPServer } from 'http'
import type { PlayerId, RoomState, PlayerState, EventLogEntry } from '@/lib/rules-engine'
import type { CreateRoomResult } from '@/lib/rules-engine'

// Alphabet for room codes (without 0, O, 1, I, L to avoid confusion)
const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

let redisAdapter: ReturnType<typeof createAdapter> | null = null
let io: ReturnType<typeof createServer> | null = null
let redisClient: ReturnType<typeof createClient> | null = null

// Rooms storage (in production, this would be fully Redis-backed)
const rooms = new Map<string, RoomState>()
// Player sockets tracking: playerId -> socketId
const playerSockets = new Map<string, string>()
// Socket to player mapping: socketId -> playerId
const socketPlayers = new Map<string, string>()

// Session tracking: playerId -> { resume_secret, connectedAt }
const playerSessions = new Map<string, { resume_secret: string; connectedAt: number }>()

// Room code generation
function generateRoomCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) {
    const randomIdx = Math.floor(Math.random() * ROOM_CODE_ALPHABET.length)
    code += ROOM_CODE_ALPHABET[randomIdx]
  }
  return code
}

// Check for duplicate code (very unlikely with 36-char alphabet ^6)
function isCodeUnique(code: string): boolean {
  for (const existingCode of rooms.keys()) {
    if (existingCode === code) return false
  }
  return true
}

// Create a new game room
export function createRoom(settings: { playerCount: number; duration: '5' | '10' | '15' }, seed: string): CreateRoomResult {
  const code = generateRoomCode()
  
  if (!isCodeUnique(code)) {
    // Extremely unlikely, but retry
    return createRoom(settings, seed)
  }

  const result = (() => {
    // Use rules engine to create room
    // In a full implementation, this would call the rules engine
    // For now, create a basic structure
    const playerCount = settings.playerCount
    const players: PlayerState[] = []

    for (let i = 0; i < playerCount; i++) {
      const playerId = i === 0 ? 'dev' : `player_${i}` as PlayerId
      players.push({
        id: playerId,
        rsu: ECONOMY.startingRSUs,
        position: 0,
        status: 'active',
        repoCount: 0,
        upgradedRepos: new Set()
      })
    }

    // Add bot if solo
    if (playerCount === 1) {
      players.push({
        id: 'bot' as PlayerId,
        rsu: 0,
        position: 0,
        status: 'active',
        repoCount: 0,
        upgradedRepos: new Set()
      })
    }

    return {
      roomId: `room_${Math.random().toString(36).substr(2, 9)}`,
      code,
      initialState: {
        id: `room_${Math.random().toString(36).substr(2, 9)}`,
        seed,
        players,
        turn: 1,
        timer: settings.duration === '5' ? 10 : settings.duration === '10' ? 12 : 15,
        matchEnded: false,
        winner: null,
        victoryCondition: 'corner-office',
        events: []
      }
    }
  })()

  return result
}

// Initialize the Socket.io server
export function initSocketServer(httpServer: HTTPServer) {
  io = createServer({
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    // Enable per-room encoding for binary state diffs
    maxPayload: 1000 * 1024 // 1MB
  })

  // Create Redis clients for the adapter
  redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
  redisClient.connect().catch(console.error)

  redisAdapter = createAdapter(redisClient, redisClient)

  io!.use((socket, next) => {
    // Sticky session middleware - will be set on connect
    next()
  })

  io!.adapter(redisAdapter!)

  io!.on('connection', (socket) => {
    const { roomId, playerId, resume_secret } = socket.handshake.query as {
      roomId?: string
      playerId?: string
      resume_secret?: string
    }

    // Sticky session: bind socket to room
    if (roomId) {
      socket.join(roomId)
      socket.data.roomId = roomId
    }

    // Identity restoration via resume_secret
    if (resume_secret && playerId) {
      // Restore session
      playerSessions.set(playerId, { resume_secret, connectedAt: Date.now() })
      
      // Restore room state
      const existingRoom = rooms.get(roomId)
      if (existingRoom) {
        // Re-join the player to their seats
        // ... restoration logic
      }
    }

    // Handle player joining
    if (playerId) {
      playerSockets.set(playerId, socket.id)
      socketPlayers.set(socket.id, playerId)
      
      // Join room and notify
      socket.emit('room:joined', { 
        code: roomId, 
        players: [...rooms.get(roomId)?.players || []].map(p => ({
          id: p.id,
          rsu: p.rsu,
          status: p.status
        }))
      })
    }

    // Handle intent submissions
    socket.on('intent', (intent: any) => {
      handleIntent(socket, intent)
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      const playerId = socketPlayers.get(socket.id)
      if (playerId) {
        playerSockets.delete(playerId)
        socketPlayers.delete(socket.id)
        
        // Leave room
        socket.leave(roomId || '')
        
        // 60s grace period before Autopilot
        setTimeout(() => {
          // Check if we need to trigger Autopilot
          const room = rooms.get(roomId || '')
          if (room) {
            // ... Autopilot logic
          }
        }, 60000)
      }
    })
  })
}

// Handle client intents
function handleIntent(socket: any, intent: any) {
  const roomId = socket.data.roomId
  if (!roomId) return

  const room = rooms.get(roomId)
  if (!room) return

  const { type, nonce, room_version } = intent
  const playerId = socketPlayers.get(socket.id)

  // Rate limit: 10 intents per second per socket
  // ... rate limiting logic

  // Schema validation (simplified)
  if (!type || !playerId) return

  // Check room version for concurrency safety
  if (room_version !== room.version) {
    // Stale intent - reject
    socket.emit('intent:rejected', { reason: 'stale_version' })
    return
  }

  // Apply intent using rules engine
  const newState = applyIntent(room, type, playerId as PlayerId)
  rooms.set(roomId, newState)

  // Broadcast versioned state diff
  hitAll(roomId, 'state:diff', {
    room_version: room.version + 1,
    diff: generateStateDiff(room, newState),
    nonce: intent.nonce
  })
}

// Generate a state diff (only changed parts)
function generateStateDiff(oldState: RoomState, newState: RoomState): any {
  const diff: any = {
    players: newState.players.map(p => ({
      id: p.id,
      rsu: p.rsu,
      position: p.position,
      status: p.status
    }))
  }

  // Only include changes
  if (oldState.turn !== newState.turn) diff.turn = newState.turn
  if (oldState.timer !== newState.timer) diff.timer = newState.timer
  if (oldState.matchEnded !== newState.matchEnded) diff.matchEnded = newState.matchEnded

  return diff
}

// Leave room on disconnect
function handleLeave(socket: any) {
  // ...
}

// Export public API
export type { RoomState, PlayerState, EventLogEntry }
export { createRoom, initSocketServer, handleIntent }