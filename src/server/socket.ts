// Socket.io server with Redis adapter for PIP Roulette
// Handles real-time multiplayer, room management, and state synchronization

import { Server as SocketIOServer } from 'socket.io'
import type { Server as HTTPServer } from 'http'
import type { CreateRoomResult, PlayerId, PlayerState, RoomState } from '@/lib/rules-engine'
import { applyIntent } from '@/lib/rules-engine'

const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

let io: SocketIOServer | null = null

const rooms = new Map<string, RoomState>()
const playerSockets = new Map<string, string>()
const socketPlayers = new Map<string, string>()
const playerSessions = new Map<string, { resume_secret: string; connectedAt: number }>()

function generateRoomCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) {
    const randomIdx = Math.floor(Math.random() * ROOM_CODE_ALPHABET.length)
    code += ROOM_CODE_ALPHABET[randomIdx]
  }
  return code
}

function isCodeUnique(code: string): boolean {
  for (const existingCode of Array.from(rooms.keys())) {
    if (existingCode === code) return false
  }
  return true
}

export function createRoom(settings: { playerCount: number; duration: '5' | '10' | '15' }, seed: string): CreateRoomResult {
  const code = generateRoomCode()

  if (!isCodeUnique(code)) {
    return createRoom(settings, seed)
  }

  const result = (() => {
    const playerCount = settings.playerCount
    const players: PlayerState[] = []
    const playerPool: PlayerId[] = ['dev', 'intern', 'vp', 'leet', 'pm', 'pe']

    for (let i = 0; i < playerCount; i++) {
      const playerId = playerPool[i % playerPool.length]
      players.push({
        id: playerId,
        rsu: 1000,
        position: 0,
        status: 'active',
        repoCount: 0,
        upgradedRepos: new Set<number>(),
      })
    }

    const roomId = `room_${Math.random().toString(36).slice(2, 11)}`
    const initialState: RoomState = {
      id: roomId,
      seed,
      players,
      path: Array.from({ length: 24 }, (_, index) => index),
      turn: 1,
      timer: settings.duration === '5' ? 10 : settings.duration === '10' ? 12 : 15,
      matchEnded: false,
      winner: null,
      victoryCondition: 'corner-office',
      layoffWave: 0,
      events: [],
    }

    rooms.set(roomId, initialState)

    return {
      roomId,
      code,
      seed,
      initialState,
    }
  })()

  return result
}

export function initSocketServer(httpServer: HTTPServer) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    const { roomId, playerId, resume_secret } = socket.handshake.query as {
      roomId?: string
      playerId?: string
      resume_secret?: string
    }

    if (roomId) {
      ;(socket as any).data.roomId = roomId
      void socket.join(roomId)
    }

    if (resume_secret && playerId) {
      playerSessions.set(playerId, { resume_secret, connectedAt: Date.now() })
    }

    if (playerId) {
      playerSockets.set(playerId, socket.id)
      socketPlayers.set(socket.id, playerId)
      socket.emit('room:joined', {
        code: roomId,
        players: [...(rooms.get(roomId ?? '')?.players ?? [])].map((p) => ({
          id: p.id,
          rsu: p.rsu,
          status: p.status,
        })),
      })
    }

    socket.on('intent', (intent: any) => {
      handleIntent(socket, intent)
    })

    socket.on('disconnect', () => {
      const disconnectedPlayer = socketPlayers.get(socket.id)
      if (disconnectedPlayer) {
        playerSockets.delete(disconnectedPlayer)
        socketPlayers.delete(socket.id)
      }

      if (roomId) {
        void socket.leave(roomId)
      }
    })
  })
}

export function handleIntent(socket: any, intent: any) {
  const roomId = (socket as any).data.roomId as string | undefined
  if (!roomId) return

  const room = rooms.get(roomId)
  if (!room) return

  const { type, nonce, room_version } = intent
  const playerId = socketPlayers.get(socket.id)

  if (!type || !playerId) return

  const currentVersion = (room as any).version ?? 0
  if (room_version !== undefined && room_version !== currentVersion) {
    socket.emit('intent:rejected', { reason: 'stale_version' })
    return
  }

  const newState = applyIntent(room, type, playerId as PlayerId)
  rooms.set(roomId, newState)

  io?.to(roomId).emit('state:diff', {
    room_version: currentVersion + 1,
    diff: generateStateDiff(room, newState),
    nonce,
  })
}

function generateStateDiff(oldState: RoomState, newState: RoomState): any {
  const diff: any = {
    players: newState.players.map((p) => ({
      id: p.id,
      rsu: p.rsu,
      position: p.position,
      status: p.status,
    })),
  }

  if (oldState.turn !== newState.turn) diff.turn = newState.turn
  if (oldState.timer !== newState.timer) diff.timer = newState.timer
  if (oldState.matchEnded !== newState.matchEnded) diff.matchEnded = newState.matchEnded

  return diff
}

export type { RoomState, PlayerState, EventLogEntry } from '@/lib/rules-engine'
