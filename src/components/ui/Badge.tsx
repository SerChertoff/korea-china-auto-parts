import type { HTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      tone: {
        neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100',
        success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
        warning: 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100',
        accent: 'bg-accent/20 text-amber-950 dark:text-amber-100',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

type Props = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    children: ReactNode
  }

/** Бейдж статусов (cva / shadcn). */
export function Badge({ children, className, tone = 'neutral', ...rest }: Props) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...rest}>
      {children}
    </span>
  )
}
