import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white hover:bg-red-700 shadow-md shadow-red-500/20 focus-visible:ring-red-400',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600',
        outline:
          'border border-slate-300 bg-transparent hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800',
        ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800',
        accent: 'bg-accent text-accent-foreground hover:bg-amber-500',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

/** Кнопка (варианты shadcn / Radix Slot). */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild, loading, disabled, children, type = 'button', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        type={asChild ? undefined : type}
        className={cn(buttonVariants({ variant }), className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? 'Загрузка…' : children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'
