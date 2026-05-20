import type { InputHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

/** Поле ввода с подписью и ошибкой (стили shadcn). */
export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className = '', id, ...rest },
  ref,
) {
  const uid = useId()
  const inputId = id ?? (typeof rest.name === 'string' ? rest.name : undefined) ?? uid
  return (
    <label className="block w-full space-y-1.5" htmlFor={inputId}>
      {label ? (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50',
          error && 'border-red-500 focus:ring-red-400',
          className,
        )}
        {...rest}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </label>
  )
})
