import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'

type Props = {
  page: number
  pageSize: number
  total: number
  onPageChange: (p: number) => void
}

/** Простая пагинация для каталога */
export function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < pages
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Страница <span className="font-mono font-semibold">{page}</span> из{' '}
        <span className="font-mono font-semibold">{pages}</span> · Всего {total}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          type="button"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          aria-label="Предыдущая страница"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Следующая страница"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
