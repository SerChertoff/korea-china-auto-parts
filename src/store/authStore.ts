import { create } from 'zustand'
import type { User } from '../types'
import { apiLogin, apiLogout, apiMe, apiRegister } from '../services/authService'

interface AuthState {
  user: User | null
  ready: boolean
  error: string | null
  /** Загрузка профиля по сохранённому токену */
  hydrate: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (payload: { email: string; password: string; name: string; phone?: string }) => Promise<void>
  /** Быстрый вход демо-аккаунтом с сервера */
  loginDemo: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  ready: false,
  error: null,
  hydrate: async () => {
    set({ error: null })
    const u = await apiMe()
    set({ user: u, ready: true })
  },
  login: async (email, password) => {
    set({ error: null })
    const { user } = await apiLogin(email, password)
    set({ user })
  },
  register: async (payload) => {
    set({ error: null })
    const { user } = await apiRegister(payload)
    set({ user })
  },
  loginDemo: async () => {
    set({ error: null })
    const { user } = await apiLogin('demo@kr-cn.parts', 'demo1234')
    set({ user })
  },
  logout: () => {
    apiLogout()
    set({ user: null })
  },
}))
