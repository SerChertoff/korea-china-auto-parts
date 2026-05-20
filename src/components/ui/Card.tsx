import type { HTMLAttributes, ReactNode } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  /** Вариант подложки */
  variant?: 'default' | 'elevated'
}

/** Карточка-контейнер с мягкой тенью */
export function Card({ children, className = '', variant = 'default', ...rest }: Props) {
  const styles =
    variant === 'elevated'
      ? 'shadow-glow-sm border border-slate-100 dark:border-slate-700'
      : 'shadow-md shadow-slate-900/5 dark:shadow-none border border-slate-100 dark:border-slate-700'
  return (
    <div
      className={`rounded-2xl bg-white p-4 dark:bg-slate-900/80 ${styles} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
