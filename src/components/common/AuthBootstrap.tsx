import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'

/** Восстановление сессии по JWT при старте приложения */
export function AuthBootstrap() {
  const hydrate = useAuthStore((s) => s.hydrate)
  useEffect(() => {
    void hydrate()
  }, [hydrate])
  return null
}
