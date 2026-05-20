import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Package, Shield, Truck } from 'lucide-react'
import { SeoHead } from '../components/common/SeoHead'
import { SITE_EMAIL, SITE_PHONE } from '../utils/constants'
import { SITE_NAME, absoluteUrl, getSiteOrigin } from '../utils/siteMeta'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProductGrid } from '../components/product/ProductGrid'
import { ProductCardSkeleton } from '../components/ui/Skeleton'
import { PART_CATEGORIES } from '../data/categories'
import { VEHICLE_BRANDS } from '../data/brands'
import { fetchProducts } from '../services/productService'
import { requestPartSchema, type RequestPartForm, vinSchema } from '../utils/validators'

const promos = [
  { title: 'Скидка 10% на фильтры Mann', text: 'До конца месяца', tone: 'danger' as const },
  { title: 'Бесплатная доставка от 15 000 ₽', text: 'По РФ', tone: 'accent' as const },
  { title: 'Расширенная гарантия на оригинал', text: 'Mobis / Chery OEM', tone: 'success' as const },
]

const reviews = [
  { name: 'Алексей', text: 'Заказал тормоза на Tucson — пришло за 3 дня, всё подошло.', car: 'Hyundai Tucson' },
  { name: 'Марина', text: 'Отличный подбор по VIN, менеджер помог с аналогом.', car: 'Chery Tiggo 8' },
  { name: 'Дмитрий', text: 'Оригинальные колодки Kia, цена адекватная.', car: 'Kia Sportage' },
]

/** Главная: промо, категории, бренды, хиты, УТП, отзывы, лид-форма */
export default function HomePage() {
  const navigate = useNavigate()

  const hitsQuery = useQuery({
    queryKey: ['home-hits'],
    queryFn: () => fetchProducts({ page: 1, pageSize: 8, sort: 'popular' }),
  })
  const hits = hitsQuery.data?.items ?? []

  const vinForm = useForm<{ vin: string }>({
    defaultValues: { vin: '' },
  })

  const reqForm = useForm<RequestPartForm>({
    resolver: zodResolver(requestPartSchema),
    defaultValues: { name: '', phone: '', comment: '' },
  })

  const homeJsonLd = useMemo(() => {
    if (!getSiteOrigin()) return undefined
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: absoluteUrl('/'),
        email: SITE_EMAIL,
        telephone: SITE_PHONE,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: absoluteUrl('/'),
        potentialAction: {
          '@type': 'SearchAction',
          target: `${absoluteUrl('/catalog')}?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ]
  }, [])

  return (
    <>
      <SeoHead
        title="KR‑CN Parts — автозапчасти Hyundai, Kia, Chery, Haval"
        description="Оригинальные и проверенные аналоги для корейских и китайских авто. Быстрая доставка, подбор по VIN."
        jsonLd={homeJsonLd}
      />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-secondary to-slate-900 text-white shadow-glow dark:border-slate-800">
        <div className="absolute inset-0 bg-hero-glass" />
        <div className="relative grid gap-10 px-6 py-12 lg:grid-cols-2 lg:px-10 lg:py-16">
          <div className="space-y-6">
            <Badge tone="accent" className="bg-white/10 text-white">
              Korea & China OEM
            </Badge>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Автозапчасти для корейских и китайских автомобилей
            </h1>
            <p className="max-w-xl text-lg text-slate-200">
              Подбор по VIN, оригинал Mobis и проверенные аналоги, прозрачные сроки и гарантия совместимости.
            </p>
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
              onSubmit={vinForm.handleSubmit((v) => {
                const vin = v.vin.trim()
                if (vin) {
                  const parsed = vinSchema.safeParse(vin)
                  if (!parsed.success) {
                    vinForm.setError('vin', { message: parsed.error.issues[0]?.message ?? 'Ошибка VIN' })
                    return
                  }
                  navigate(`/catalog?vin=${encodeURIComponent(vin)}`)
                  return
                }
                navigate('/catalog')
              })}
            >
              <Input
                label="VIN номер (необязательно)"
                className="border-white/20 bg-white/10 text-white placeholder:text-slate-300"
                placeholder="Например, KMHXX00XXXX000000"
                {...vinForm.register('vin')}
                error={vinForm.formState.errors.vin?.message}
              />
              <Button type="submit" variant="accent" className="sm:mb-0">
                Подобрать запчасти
              </Button>
            </form>
            <div className="flex flex-wrap gap-3 text-sm text-slate-200">
              <Link className="inline-flex items-center gap-2 hover:text-white" to="/catalog">
                Перейти в каталог <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="hidden sm:inline">·</span>
              <Link className="hover:text-white" to="/brands">
                Все бренды
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
            {promos.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Card className="border-white/10 bg-white/5 p-4 text-white backdrop-blur-md">
                  <Badge tone={p.tone}>{p.text}</Badge>
                  <div className="mt-2 font-display text-lg font-bold">{p.title}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Категории */}
      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Популярные категории
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Сетка 12 колонок на широких экранах</p>
          </div>
          <Link to="/catalog" className="text-sm font-semibold text-primary hover:underline">
            Смотреть всё
          </Link>
        </div>
        <div className="grid grid-cols-12 gap-3 sm:gap-4">
          {PART_CATEGORIES.map((c, idx) => (
            <Link
              key={c.id}
              to={`/catalog?category=${encodeURIComponent(c.id)}`}
              className={
                'group col-span-12 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition ' +
                'hover:-translate-y-0.5 hover:shadow-glow-sm dark:border-slate-800 dark:bg-slate-900 ' +
                (idx < 4 ? 'sm:col-span-6 lg:col-span-3' : 'sm:col-span-6 lg:col-span-4')
              }
            >
              <div className="font-display text-lg font-bold text-slate-900 group-hover:text-primary dark:text-white">
                {c.name}
              </div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Перейти в каталог →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Бренды */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Бренды автомобилей
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {VEHICLE_BRANDS.map((b) => (
            <Link
              key={b.id}
              to={`/catalog?brand=${encodeURIComponent(b.name)}`}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:border-primary dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/90 to-accent text-sm font-black text-white">
                {b.logoPlaceholder}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{b.name}</div>
                <div className="text-xs text-slate-500">{b.country === 'KR' ? 'Корея' : 'Китай'}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Хиты */}
      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Хиты продаж
          </h2>
          <Link to="/catalog" className="text-sm font-semibold text-primary hover:underline">
            В каталог
          </Link>
        </div>
        {hitsQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProductGrid products={hits} view="grid" />
        )}
      </section>

      {/* Преимущества */}
      <section className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Shield, title: 'Оригинал и OE-качество', text: 'Прозрачное происхождение деталей и гарантия.' },
          { icon: Truck, title: 'Доставка по РФ', text: 'Курьер, ПВЗ, транспортные компании.' },
          { icon: Package, title: 'Наличие на складе', text: 'Часть позиций доступна для немедленной отправки.' },
          { icon: CheckCircle2, title: 'Возврат и обмен', text: 'Соблюдаем закон о защите прав потребителей.' },
        ].map((x) => (
          <Card key={x.title} variant="elevated" className="p-5">
            <x.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-white">{x.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{x.text}</p>
          </Card>
        ))}
      </section>

      {/* Отзывы */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Отзывы клиентов</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <Card key={r.name} className="p-5">
              <div className="text-sm font-semibold text-primary">{r.car}</div>
              <p className="mt-2 text-slate-700 dark:text-slate-200">«{r.text}»</p>
              <div className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{r.name}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Лид-форма */}
      <section className="mt-14 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/40 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Не нашли нужную деталь?</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Оставьте запрос — подберём по каталогам дилера, фото или оригинальному номеру.
            </p>
          </div>
          <form
            className="grid gap-3"
            onSubmit={reqForm.handleSubmit(() => {
              reqForm.reset()
              alert('Спасибо! Мы свяжемся с вами в ближайшее время (демо).')
            })}
          >
            <Input label="Имя" {...reqForm.register('name')} error={reqForm.formState.errors.name?.message} />
            <Input label="Телефон" {...reqForm.register('phone')} error={reqForm.formState.errors.phone?.message} />
            <Input
              label="Комментарий"
              {...reqForm.register('comment')}
              error={reqForm.formState.errors.comment?.message}
            />
            <Button type="submit" variant="primary">
              Отправить запрос
            </Button>
          </form>
        </div>
      </section>
    </>
  )
}
