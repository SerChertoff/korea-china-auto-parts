import { useState } from 'react'
import type { Product } from '../../types'

type Props = { product: Product }

/** Галерея с переключением кадра и лёгким «zoom» при наведении */
export function ProductGallery({ product }: Props) {
  const [idx, setIdx] = useState(0)
  const src = product.images[idx] ?? product.images[0]!

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div className="aspect-square overflow-hidden">
          <img
            src={src}
            alt={`${product.name} — фото ${idx + 1}`}
            className="h-full w-full object-cover transition duration-500 ease-out hover:scale-110"
            loading="eager"
          />
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
    </div>
  )
}
