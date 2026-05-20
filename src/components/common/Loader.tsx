import { Loader2 } from 'lucide-react'

type Props = { label?: string }

/** Индикатор загрузки для секций */
export function Loader({ label = 'Загрузка…' }: Props) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300" role="status">
      <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
      <span>{label}</span>
    </div>
  )
}
