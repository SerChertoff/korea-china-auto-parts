import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import type { Product } from '../../types'

type Props = { product: Product }

/** Галерея: превью, lightbox по клику, стрелки и Escape */
export function ProductGallery({ product }: Props) {
  const [idx, setIdx] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const src = product.images[idx] ?? product.images[0]!

  const n = product.images.length
  const prev = useCallback(() => setIdx((i) => (i - 1 + n) % n), [n])
  const next = useCallback(() => setIdx((i) => (i + 1) % n), [n])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, prev, next])

  useEffect(() => {
    if (!lightbox) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [lightbox])

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div className="aspect-square overflow-hidden">
          <button
            type="button"
            className="group relative block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setLightbox(true)}
            aria-label="Открыть фото во весь экран"
          >
            <img
              src={src}
              alt={`${product.name} — фото ${idx + 1}`}
              className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
              loading="eager"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-lg bg-slate-900/70 px-2 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
              <ZoomIn className="h-3.5 w-3.5" aria-hidden />
              Увеличить
            </span>
          </button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {product.images.map((im, i) => (
          <button
            key={im}
            type="button"
            aria-label={`Показать фото ${i + 1}`}
            onClick={() => setIdx(i)}
            className={
              'h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ' +
              (i === idx
                ? 'border-primary shadow-glow-sm'
                : 'border-transparent opacity-80 hover:opacity-100')
            }
          >
            <img src={im} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[90] flex flex-col bg-slate-950/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фотографий"
        >
          <div className="flex items-center justify-between gap-3 p-3 text-white sm:p-4">
            <span className="truncate text-sm font-medium sm:text-base">
              {product.name} — {idx + 1} / {n}
            </span>
            <button
              type="button"
              className="rounded-xl p-2 hover:bg-white/10"
              onClick={() => setLightbox(false)}
              aria-label="Закрыть"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-4 sm:px-8">
            {n > 1 ? (
              <button
                type="button"
                className="absolute left-2 top-1/2 z-[91] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:left-4"
                onClick={prev}
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            ) : null}
            <img
              src={src}
              alt={`${product.name} — фото ${idx + 1}`}
              className="max-h-[min(78vh,900px)] max-w-full object-contain"
            />
            {n > 1 ? (
              <button
                type="button"
                className="absolute right-2 top-1/2 z-[91] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-4"
                onClick={next}
                aria-label="Следующее фото"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            ) : null}
          </div>
          {n > 1 ? (
            <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-6">
              {product.images.map((im, i) => (
                <button
                  key={im}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={
                    'h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 ' +
                    (i === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100')
                  }
                  aria-label={`Миниатюра ${i + 1}`}
                >
                  <img src={im} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
