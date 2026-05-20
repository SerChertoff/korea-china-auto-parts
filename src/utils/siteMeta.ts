/** Имя сайта для OG / JSON-LD */
export const SITE_NAME = 'KR-CN Parts'

/** Базовый URL без завершающего слэша (для OG, canonical, sitemap). */
export function getSiteOrigin(): string {
  const raw = import.meta.env.VITE_SITE_URL as string | undefined
  if (raw && /^https?:\/\//i.test(raw.trim())) return raw.trim().replace(/\/$/, '')
  if (import.meta.env.DEV) return 'http://localhost:5173'
  return ''
}

/** Абсолютный URL пути; при пустом origin — относительный путь (только для UI). */
export function absoluteUrl(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  const o = getSiteOrigin()
  return o ? `${o}${path}` : path
}
