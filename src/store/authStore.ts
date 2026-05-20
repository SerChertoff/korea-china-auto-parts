import { create } from 'zustand'
import type { User } from '../types'

interface AuthState {
  user: User | null
  loginDemo: () => void
  logout: () => void
}

/** Демо-авторизация без бэкенда */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loginDemo: () =>
    set({
      user: {
        id: 'u-demo',
        email: 'client@example.com',
        name: 'Иван Петров',
        phone: '+7 900 000-00-00',
      },
    }),
  logout: () => set({ user: null }),
}))
