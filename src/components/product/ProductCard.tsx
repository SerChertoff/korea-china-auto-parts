import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Star } from 'lucide-react'
import type { Product } from '../../types'
import { formatPrice, reviewsWord } from '../../utils/formatters'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useCart } from '../../hooks/useCart'

type Props = { product: Product; layout?: 'grid' | 'list' }

/** Карточка товара для сетки и списка */
export function ProductCard({ product, layout = 'grid' }: Props) {
  const { addItem } = useCart()
  const isList = layout === 'list'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={
        'group relative overflow-hidden rounded-2xl border border-slate-100 bg-white transition ' +
        'hover:-translate-y-0.5 hover:shadow-glow-sm dark:border-slate-800 dark:bg-slate-900 ' +
        (isList ? 'flex gap-4 p-3 sm:p-4' : 'flex flex-col p-3')
      }
    >
      <Link
        to={`/product/${product.id}`}
        className={isList ? 'relative block w-40 shrink-0 overflow-hidden rounded-xl' : 'block overflow-hidden rounded-xl'}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className={
            (isList ? 'h-28 w-full ' : 'aspect-square w-full ') +
            'object-cover transition duration-500 group-hover:scale-[1.03]'
          }
        />
        {!product.inStock ? (
          <span className="absolute left-2 top-2 rounded-lg bg-slate-900/80 px-2 py-1 text-xs font-semibold text-white">
            Под заказ
          </span>
        ) : null}
      </Link>

      <div className={isList ? 'flex min-w-0 flex-1 flex-col justify-between gap-3' : 'mt-3 flex flex-1 flex-col gap-2'}>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={product.isOriginal ? 'success' : 'neutral'}>
              {product.isOriginal ? 'Оригинал' : 'Аналог'}
            </Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400">{product.brand}</span>
          </div>
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="line-clamp-2 font-display text-sm font-bold leading-snug text-slate-900 hover:text-primary dark:text-white">
              {product.name}
            </h3>
          </Link>
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400">Арт. {product.article}</p>
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
            <Star className="h-4 w-4 fill-current" aria-hidden />
            <span className="font-mono font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-slate-500 dark:text-slate-400">
              · {product.reviewsCount} {reviewsWord(product.reviewsCount)}
            </span>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="font-mono text-lg font-extrabold tabular-nums text-slate-900 dark:text-white">
              {formatPrice(product.price)}
            </div>
            {product.oldPrice ? (
              <div className="font-mono text-sm text-slate-400 line-through">
                {formatPrice(product.oldPrice)}
              </div>
            ) : null}
          </div>
          <Button
            type="button"
            variant="primary"
            className="px-3 py-2"
            disabled={!product.inStock}
            onClick={() => addItem(product, 1)}
            aria-label={`Добавить в корзину: ${product.name}`}
          >
            <ShoppingCart className="h-4 w-4" />
            В корзину
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
