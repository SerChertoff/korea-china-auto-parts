import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const loginDemo = useAuthStore((s) => s.loginDemo)
  const logout = useAuthStore((s) => s.logout)
  return { user, loginDemo, logout, isAuth: !!user }
}
