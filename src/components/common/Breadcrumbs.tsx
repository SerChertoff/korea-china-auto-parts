import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export type Crumb = { label: string; to?: string }

type Props = { items: Crumb[] }

/** Хлебные крошки для SEO и навигации */
export function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Хлебные крошки" className="text-sm text-slate-500 dark:text-slate-400">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1">
            {i > 0 ? <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden /> : null}
            {c.to && i < items.length - 1 ? (
              <Link className="hover:text-primary" to={c.to}>
                {c.label}
              </Link>
            ) : (
              <span className="font-medium text-slate-800 dark:text-slate-100">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
