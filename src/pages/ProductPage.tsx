import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Minus, Plus, Scale, ShoppingCart, Star } from 'lucide-react'
import { SeoHead } from '../components/common/SeoHead'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductGrid } from '../components/product/ProductGrid'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Loader } from '../components/common/Loader'
import { Input } from '../components/ui/Input'
import { fetchProductById, fetchProductReviews, fetchProducts, postProductReview } from '../services/productService'
import { formatPrice, reviewsWord } from '../utils/formatters'
import { absoluteUrl, getSiteOrigin } from '../utils/siteMeta'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useCompareStore } from '../store/compareStore'

type Tab = 'desc' | 'spec' | 'compat' | 'reviews' | 'delivery'

/** Карточка товара: галерея, табы, похожие, липкая панель на мобильных */
export default function ProductPage() {
  const { id } = useParams()
  const productId = id ?? ''
  const queryClient = useQueryClient()
  const { addItem } = useCart()
  const { user, isAuth } = useAuth()
  const [tab, setTab] = useState<Tab>('desc')
  const [qty, setQty] = useState(1)
  const [compareHint, setCompareHint] = useState<string | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewAuthor, setReviewAuthor] = useState('')

  const inCompare = useCompareStore((s) => s.has(productId))
  const toggleCompare = useCompareStore((s) => s.toggle)

  const q = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: Boolean(productId),
  })

  const p = q.data

  const reviewsQ = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => fetchProductReviews(productId),
    enabled: Boolean(productId),
  })

  const reviewMutation = useMutation({
    mutationFn: () =>
      postProductReview(productId, {
        rating: reviewRating,
        text: reviewText.trim(),
        ...(!isAuth && reviewAuthor.trim().length >= 2 ? { authorName: reviewAuthor.trim() } : {}),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] })
      setReviewText('')
      setReviewAuthor('')
      setReviewRating(5)
    },
  })

  const reviews = [...(reviewsQ.data ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const productJsonLd = useMemo(() => {
    if (!p || !getSiteOrigin()) return undefined
    const absImages = p.images.filter((u) => /^https?:\/\//i.test(u))
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      sku: p.article,
      ...(absImages.length ? { image: absImages } : {}),
      description: p.description.slice(0, 800),
      brand: { '@type': 'Brand', name: p.brand },
      offers: {
        '@type': 'Offer',
        url: absoluteUrl(`/product/${p.id}`),
        priceCurrency: 'RUB',
        price: p.price,
        availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    }
  }, [p])

  function onToggleCompare() {
    if (!p) return
    const ok = toggleCompare(p)
    if (!ok) {
      setCompareHint('В сравнении не больше 5 товаров. Удалите позицию на странице сравнения.')
      window.setTimeout(() => setCompareHint(null), 4000)
    } else {
      setCompareHint(null)
    }
  }

  const similarQ = useQuery({
    queryKey: ['similar', p?.id, p?.category],
    queryFn: async () => {
      const r = await fetchProducts({ category: p!.category, page: 1, pageSize: 12 })
      return r.items.filter((x) => x.id !== p!.id).slice(0, 4)
    },
    enabled: Boolean(p?.category),
  })
  const similar = similarQ.data ?? []

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
      <SeoHead
        title={`${p.name} — KR‑CN Parts`}
        description={p.description.slice(0, 160)}
        ogType="product"
        ogImage={p.images[0] && /^https?:\/\//i.test(p.images[0]) ? p.images[0] : undefined}
        jsonLd={productJsonLd}
      />
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
              variant="outline"
              className="px-4"
              aria-pressed={inCompare}
              onClick={onToggleCompare}
            >
              <Scale className="h-5 w-5" />
              {inCompare ? 'В сравнении' : 'В сравнение'}
            </Button>
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
          {compareHint ? <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">{compareHint}</p> : null}
          {inCompare ? (
            <Link to="/compare" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
              Открыть сравнение
            </Link>
          ) : null}
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
                <div className="space-y-6">
                  {reviewsQ.isLoading ? <p className="text-slate-500">Загружаем отзывы…</p> : null}
                  {reviewsQ.isError ? (
                    <p className="text-red-600">Не удалось загрузить отзывы. Проверьте, что API запущен.</p>
                  ) : null}
                  <ul className="space-y-4">
                    {reviews.map((r) => (
                      <li
                        key={r.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/80"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">{r.authorName}</span>
                          <time className="text-xs text-slate-500" dateTime={r.createdAt}>
                            {new Date(r.createdAt).toLocaleString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </time>
                        </div>
                        <div className="mt-1 flex items-center gap-0.5 text-amber-500" aria-label={`Оценка ${r.rating} из 5`}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < r.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`}
                            />
                          ))}
                        </div>
                        <p className="mt-2 text-slate-700 dark:text-slate-200">{r.text}</p>
                      </li>
                    ))}
                  </ul>
                  {reviews.length === 0 && !reviewsQ.isLoading ? (
                    <p className="text-slate-600 dark:text-slate-300">Пока нет отзывов — станьте первым.</p>
                  ) : null}

                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 dark:border-slate-700">
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Написать отзыв</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Минимум 5 символов в тексте. Оценка от 1 до 5.
                      {!isAuth ? ' Укажите имя (от 2 символов) или оставьте пустым — будет «Гость».' : null}
                    </p>
                    <div className="mt-3 flex items-center gap-1" role="group" aria-label="Оценка">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          className={`rounded-lg p-1 ${n <= reviewRating ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
                          onClick={() => setReviewRating(n)}
                          aria-label={`${n} из 5`}
                        >
                          <Star className={`h-7 w-7 ${n <= reviewRating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                    {!isAuth ? (
                      <div className="mt-3">
                        <Input
                          label="Ваше имя"
                          value={reviewAuthor}
                          onChange={(e) => setReviewAuthor(e.target.value)}
                          placeholder="Например, Иван"
                        />
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                        Вы вошли как <span className="font-semibold">{user?.name}</span>
                      </p>
                    )}
                    <div className="mt-3">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Текст отзыва</label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                        placeholder="Качество, доставка, совместимость…"
                      />
                    </div>
                    {reviewMutation.isError ? (
                      <p className="mt-2 text-sm text-red-600">
                        {isAxiosError(reviewMutation.error) &&
                        reviewMutation.error.response?.data &&
                        typeof reviewMutation.error.response.data === 'object' &&
                        'error' in reviewMutation.error.response.data
                          ? String((reviewMutation.error.response.data as { error: unknown }).error)
                          : 'Не удалось отправить отзыв. Проверьте поля и попробуйте снова.'}
                      </p>
                    ) : null}
                    <Button
                      type="button"
                      variant="primary"
                      className="mt-4"
                      loading={reviewMutation.isPending}
                      disabled={reviewText.trim().length < 5}
                      onClick={() => reviewMutation.mutate()}
                    >
                      Отправить
                    </Button>
                  </div>
                </div>
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
