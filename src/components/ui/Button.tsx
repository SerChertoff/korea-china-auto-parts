import type { ButtonHTMLAttributes, ReactNode } from 'react'

const variants = {
  primary:
    'bg-primary text-white hover:bg-red-700 shadow-md shadow-red-500/20 focus-visible:ring-red-400',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600',
  outline:
    'border border-slate-300 bg-transparent hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800',
  ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800',
  accent: 'bg-accent text-accent-foreground hover:bg-amber-500',
} as const

type Variant = keyof typeof variants

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
  /** Показать состояние загрузки */
  loading?: boolean
}

/** Универсальная кнопка дизайн-системы */
export function Button({
  variant = 'primary',
  className = '',
  children,
  loading,
  disabled,
  type = 'button',
  ...rest
}: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ' +
    'transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ' +
    'disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'Загрузка…' : children}
    </button>
  )
}
