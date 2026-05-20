import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AppState, OrderRow, ReviewRow, UserRow } from './types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')
const STATE_FILE = join(DATA_DIR, 'app-state.json')

const empty: AppState = { users: [], orders: [], reviews: [] }

export function loadState(): AppState {
  try {
    if (!existsSync(STATE_FILE)) return structuredClone(empty)
    const raw = readFileSync(STATE_FILE, 'utf-8')
    const parsed = JSON.parse(raw) as AppState
    return {
      users: parsed.users ?? [],
      orders: parsed.orders ?? [],
      reviews: parsed.reviews ?? [],
    }
  } catch {
    return structuredClone(empty)
  }
}

export function saveState(state: AppState): void {
  mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8')
}

export function appendUser(state: AppState, u: UserRow): void {
  state.users.push(u)
  saveState(state)
}

export function appendOrder(state: AppState, o: OrderRow): void {
  state.orders.push(o)
  saveState(state)
}

export function appendReview(state: AppState, r: ReviewRow): void {
  state.reviews.push(r)
  saveState(state)
}
