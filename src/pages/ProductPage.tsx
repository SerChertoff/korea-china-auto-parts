import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { SeoHead } from '../components/common/SeoHead'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductGrid } from '../components/product/ProductGrid'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Loader } from '../components/common/Loader'
import { fetchProductById } from '../services/productService'
import { MOCK_PRODUCTS } from '../data/mockProducts'
import { formatPrice, reviewsWord } from '../utils/formatters'
import { useCart } from '../hooks/useCart'

type Tab = 'desc' | 'spec' | 'compat' | 'reviews' | 'delivery'

/** Карточка товара: галерея, табы, похожие, липкая панель на мобильных */
export default function ProductPage() {
  const { id } = useParams()
  const productId = id ?? ''
  const { addItem } = useCart()
  const [tab, setTab] = useState<Tab>('desc')
  const [qty, setQty] = useState(1)

  const q = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: Boolean(productId),
  })

  const p = q.data
  const similar = useMemo(() => {
    if (!p) return []
    return MOCK_PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4)
  }, [p])

  if (q.isLoading) {
    return (
      <div className="py-20">
        <Loader label="Загружаем карточку…" />
      </div>
    )
  }

  if (!p) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="font-display text-2xl font-bold">Товар не найден</h1>
        <Link className="mt-4 inline-block text-primary hover:underline" to="/catalog">
          В каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-24 sm:pb-0">
      <SeoHead title={`${p.name} — KR‑CN Parts`} description={p.description.slice(0, 160)} />
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', to: '/' },
            { label: 'Каталог', to: '/catalog' },
            { label: p.name },
          ]}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <ProductGallery product={p} />
        </div>
        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={p.isOriginal ? 'success' : 'neutral'}>{p.isOriginal ? 'Оригинал' : 'Аналог'}</Badge>
            <Badge tone={p.inStock ? 'success' : 'warning'}>{p.inStock ? 'В наличии' : 'Под заказ'}</Badge>
            <span className="text-sm text-slate-500">{p.brand}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {p.name}
          </h1>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span>
              Артикул: <span className="font-mono font-semibold text-slate-900 dark:text-white">{p.article}</span>
            </span>
            <span>
              OEM:{' '}
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{p.oem.join(', ')}</span>
            </span>
          </div>
          <div className="mt-3 inline-flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Star className="h-5 w-5 fill-current" aria-hidden />
            <span className="font-mono text-lg font-bold">{p.rating.toFixed(1)}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {p.reviewsCount} {reviewsWord(p.reviewsCount)}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-4">
            <div>
              <div className="font-mono text-3xl font-black tabular-nums text-slate-900 dark:text-white">
                {formatPrice(p.price)}
              </div>
              {p.oldPrice ? (
                <div className="font-mono text-lg text-slate-400 line-through">{formatPrice(p.oldPrice)}</div>
              ) : null}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Производитель: <span className="font-semibold">{p.manufacturer}</span>
              <div className="mt-1">На складе: {p.stockCount} шт.</div>
              <div>Доставка: от 2–5 дней по РФ (демо)</div>
            </div>
          </div>

          <div className="mt-6 hidden items-center gap-3 sm:flex">
            <div className="inline-flex items-center rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900"
                aria-label="Уменьшить количество"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="min-w-10 text-center font-mono font-bold">{qty}</div>
              <button
                type="button"
                className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900"
                aria-label="Увеличить количество"
                onClick={() => setQty((n) => n + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              type="button"
              variant="primary"
              className="px-6"
              disabled={!p.inStock}
              onClick={() => addItem(p, qty)}
            >
              <ShoppingCart className="h-5 w-5" />
              В корзину
            </Button>
          </div>
        </div>

        <div className="lg:col-span-12">
          <Card className="p-4">
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              {(
                [
                  ['desc', 'Описание'],
                  ['spec', 'Характеристики'],
                  ['compat', 'Совместимость'],
                  ['reviews', 'Отзывы'],
                  ['delivery', 'Доставка'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
                  className={
                    'rounded-xl px-3 py-2 text-sm font-semibold transition ' +
                    (tab === k
                      ? 'bg-primary text-white shadow-glow-sm'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800')
                  }
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="pt-4 text-sm text-slate-700 dark:text-slate-200">
              {tab === 'desc' ? <p>{p.description}</p> : null}
              {tab === 'spec' ? (
                <table className="w-full text-left">
                  <tbody>
                    {Object.entries(p.characteristics).map(([key, val]) => (
                      <tr key={key} className="border-b border-slate-100 dark:border-slate-800">
                        <th className="py-2 pr-4 font-semibold text-slate-600 dark:text-slate-300">{key}</th>
                        <td className="py-2 font-mono text-slate-900 dark:text-white">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
              {tab === 'compat' ? (
                <ul className="space-y-2">
                  {p.compatibility.map((c, i) => (
                    <li key={`${c.brand}-${c.model}-${i}`} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950">
                      <span className="font-semibold">
                        {c.brand} {c.model}
                      </span>{' '}
                      <span className="text-slate-600 dark:text-slate-300">
                        ({c.yearFrom}–{c.yearTo})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {tab === 'reviews' ? (
                <p className="text-slate-600 dark:text-slate-300">
                  Отзывы появятся после интеграции с CRM (демо: рейтинг {p.rating}, отзывов {p.reviewsCount}).
                </p>
              ) : null}
              {tab === 'delivery' ? (
                <p className="text-slate-600 dark:text-slate-300">
                  Доставка курьером, в пункты выдачи и транспортными компаниями. Точная стоимость рассчитывается на
                  этапе оформления заказа.
                </p>
              ) : null}
            </div>
          </Card>
        </div>

        {similar.length > 0 ? (
          <div className="lg:col-span-12">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Похожие товары</h2>
            <div className="mt-4">
              <ProductGrid products={similar} view="grid" />
            </div>
          </div>
        ) : null}
      </div>

      {/* Липкая панель «в корзину» на мобильных */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:hidden dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{p.name}</div>
            <div className="font-mono text-lg font-black tabular-nums">{formatPrice(p.price)}</div>
          </div>
          <Button type="button" variant="primary" disabled={!p.inStock} onClick={() => addItem(p, 1)}>
            В корзину
          </Button>
        </div>
      </div>
    </div>
  )
}
