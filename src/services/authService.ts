import { api, setStoredToken, getStoredToken } from './api'
import type { User } from '../types'

export interface LoginResult {
  token: string
  user: User
}

export async function apiLogin(email: string, password: string): Promise<LoginResult> {
  const { data } = await api.post<LoginResult>('/auth/login', { email, password })
  setStoredToken(data.token)
  return data
}

export async function apiRegister(payload: {
  email: string
  password: string
  name: string
  phone?: string
}): Promise<LoginResult> {
  const { data } = await api.post<LoginResult>('/auth/register', payload)
  setStoredToken(data.token)
  return data
}

export async function apiMe(): Promise<User | null> {
  if (!getStoredToken()) return null
  try {
    const { data } = await api.get<{ user: User }>('/auth/me')
    return data.user
  } catch {
    return null
  }
}

export function apiLogout(): void {
  setStoredToken(null)
}
