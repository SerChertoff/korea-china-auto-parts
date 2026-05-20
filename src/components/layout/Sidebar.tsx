import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Заголовок для доступности и визуальной иерархии */
  title?: string
}

/** Обёртка сайдбара (каталог, фильтры, ЛК) — div, т.к. внутри уже может быть aside */
export function Sidebar({ children, title }: Props) {
  return (
    <div className="space-y-4" role="complementary" aria-label={title ?? 'Боковая панель'}>
      {title ? <h2 className="sr-only">{title}</h2> : null}
      {children}
    </div>
  )
}
