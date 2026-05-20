import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  variant?: 'default' | 'elevated'
}

/** Карточка-контейнер (паттерн shadcn). */
export function Card({ children, className = '', variant = 'default', ...rest }: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-4 dark:bg-slate-900/80',
        variant === 'elevated'
          ? 'shadow-glow-sm border border-slate-100 dark:border-slate-700'
          : 'shadow-md shadow-slate-900/5 dark:shadow-none border border-slate-100 dark:border-slate-700',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
