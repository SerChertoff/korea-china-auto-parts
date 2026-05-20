import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const ready = useAuthStore((s) => s.ready)
  const error = useAuthStore((s) => s.error)
  const hydrate = useAuthStore((s) => s.hydrate)
  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const loginDemo = useAuthStore((s) => s.loginDemo)
  const logout = useAuthStore((s) => s.logout)
  return { user, ready, error, hydrate, login, register, loginDemo, logout, isAuth: !!user }
}
