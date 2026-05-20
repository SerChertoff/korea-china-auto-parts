import { useEffect, useState } from 'react'

/** Медиа-запрос для адаптивной вёрстки и мобильного меню */
export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = () => setMatch(mq.matches)
    mq.addEventListener('change', handler)
    setMatch(mq.matches)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return match
}
