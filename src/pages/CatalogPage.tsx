import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { LayoutGrid, List, X } from 'lucide-react'
import { SeoHead } from '../components/common/SeoHead'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { ProductGrid } from '../components/product/ProductGrid'
import { ProductFilters } from '../components/product/ProductFilters'
import { Sidebar } from '../components/layout/Sidebar'
import { ProductCardSkeleton } from '../components/ui/Skeleton'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Loader } from '../components/common/Loader'
import { useDebounce } from '../hooks/useDebounce'
import { useFiltersStore } from '../store/filtersStore'
import { useVehicleStore } from '../store/vehicleStore'
import { fetchProductsOffset } from '../services/productService'
import { PART_CATEGORIES } from '../data/categories'
import type { CatalogSort, CatalogViewMode } from '../types'

const PAGE_SIZE = 12

const SORTS: CatalogSort[] = ['popular', 'price-asc', 'price-desc', 'new', 'rating']

function parseSort(v: string | null): CatalogSort {
  return v && SORTS.includes(v as CatalogSort) ? (v as CatalogSort) : 'popular'
}

function parseView(v: string | null): CatalogViewMode {
  return v === 'list' ? 'list' : 'grid'
}

/** Каталог: фильтры, URL, бесконечный скролл */
export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const paramsKey = searchParams.toString()
  const vehicle = useVehicleStore((s) => s.vehicle)

  const search = useFiltersStore((s) => s.search)
  const brand = useFiltersStore((s) => s.brand)
  const category = useFiltersStore((s) => s.category)
  const priceMin = useFiltersStore((s) => s.priceMin)
  const priceMax = useFiltersStore((s) => s.priceMax)
  const inStockOnly = useFiltersStore((s) => s.inStockOnly)
  const originalOnly = useFiltersStore((s) => s.originalOnly)
  const sort = useFiltersStore((s) => s.sort)
  const view = useFiltersStore((s) => s.view)

  const setSearch = useFiltersStore((s) => s.setSearch)
  const setBrand = useFiltersStore((s) => s.setBrand)
  const setCategory = useFiltersStore((s) => s.setCategory)
  const setPriceMin = useFiltersStore((s) => s.setPriceMin)
  const setPriceMax = useFiltersStore((s) => s.setPriceMax)
  const setInStockOnly = useFiltersStore((s) => s.setInStockOnly)
  const setOriginalOnly = useFiltersStore((s) => s.setOriginalOnly)
  const setSort = useFiltersStore((s) => s.setSort)
  const setView = useFiltersStore((s) => s.setView)
  const resetFilters = useFiltersStore((s) => s.resetFilters)

  const skipUrlToStore = useRef(false)
  const lastWritten = useRef<string | null>(null)

  /** URL → store (назад/вперёд в браузере и прямые ссылки) */
  useEffect(() => {
    if (skipUrlToStore.current) {
      skipUrlToStore.current = false
      return
    }
    const q = searchParams.get('q') ?? ''
    const vin = searchParams.get('vin') ?? ''
    const b = searchParams.get('brand') ?? ''
    const c = searchParams.get('category') ?? ''
    const pmin = searchParams.get('priceMin')
    const pmax = searchParams.get('priceMax')
    const stock = searchParams.get('stock')
    const orig = searchParams.get('orig')

    if (q) setSearch(q)
    else if (vin) setSearch(vin)
    else setSearch('')

    setBrand(b)
    setCategory(c)
    if (pmin != null && pmin !== '') setPriceMin(Number(pmin) || 0)
    else setPriceMin(0)
    if (pmax != null && pmax !== '') setPriceMax(Number(pmax) || 120_000)
    else setPriceMax(120_000)
    setInStockOnly(stock === '1')
    setOriginalOnly(orig === '1')
    setSort(parseSort(searchParams.get('sort')))
    setView(parseView(searchParams.get('view')))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- синхронизация по строке query
  }, [paramsKey])

  const debouncedSearch = useDebounce(search, 350)

  /** Store → URL */
  useEffect(() => {
    const sp = new URLSearchParams()
    const t = debouncedSearch.trim()
    if (t) sp.set('q', t)
    if (brand) sp.set('brand', brand)
    if (category) sp.set('category', category)
    if (priceMin > 0) sp.set('priceMin', String(priceMin))
    if (priceMax < 120_000) sp.set('priceMax', String(priceMax))
    if (inStockOnly) sp.set('stock', '1')
    if (originalOnly) sp.set('orig', '1')
    if (sort !== 'popular') sp.set('sort', sort)
    if (view !== 'grid') sp.set('view', view)
    const next = sp.toString()
    if (next === lastWritten.current) return
    lastWritten.current = next
    skipUrlToStore.current = true
    setSearchParams(sp, { replace: true })
  }, [
    debouncedSearch,
    brand,
    category,
    priceMin,
    priceMax,
    inStockOnly,
    originalOnly,
    sort,
    view,
    setSearchParams,
  ])

  const filterKey = useMemo(
    () =>
      [
        debouncedSearch,
        brand,
        category,
        priceMin,
        priceMax,
        inStockOnly,
        originalOnly,
        sort,
      ].join('|'),
    [debouncedSearch, brand, category, priceMin, priceMax, inStockOnly, originalOnly, sort],
  )

  const inf = useInfiniteQuery({
    queryKey: ['catalog-inf', filterKey],
    queryFn: ({ pageParam }) =>
      fetchProductsOffset({
        search: debouncedSearch || undefined,
        brand: brand || undefined,
        category: category || undefined,
        priceMin,
        priceMax,
        inStockOnly,
        originalOnly,
        sort,
        offset: pageParam as number,
        limit: PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextOffset ?? undefined,
  })

  const items = useMemo(() => inf.data?.pages.flatMap((p) => p.items) ?? [], [inf.data])
  const total = inf.data?.pages[0]?.total ?? 0

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries[0]?.isIntersecting
        if (hit && inf.hasNextPage && !inf.isFetchingNextPage) void inf.fetchNextPage()
      },
      { rootMargin: '240px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inf.hasNextPage, inf.isFetchingNextPage, inf.fetchNextPage])

  const chips = useMemo(() => {
    const out: { key: string; label: string; onClear: () => void }[] = []
    if (search.trim())
      out.push({ key: 'q', label: `Поиск: ${search}`, onClear: () => setSearch('') })
    if (brand) out.push({ key: 'b', label: `Авто: ${brand}`, onClear: () => setBrand('') })
    if (category) {
      const name = PART_CATEGORIES.find((x) => x.id === category)?.name ?? category
      out.push({ key: 'c', label: `Категория: ${name}`, onClear: () => setCategory('') })
    }
    if (priceMin > 0) out.push({ key: 'pmin', label: `Цена от ${priceMin}`, onClear: () => setPriceMin(0) })
    if (priceMax < 120_000)
      out.push({ key: 'pmax', label: `Цена до ${priceMax}`, onClear: () => setPriceMax(120_000) })
    if (inStockOnly) out.push({ key: 's', label: 'В наличии', onClear: () => setInStockOnly(false) })
    if (originalOnly) out.push({ key: 'o', label: 'Только оригинал', onClear: () => setOriginalOnly(false) })
    return out
  }, [
    search,
    brand,
    category,
    priceMin,
    priceMax,
    inStockOnly,
    originalOnly,
    setSearch,
    setBrand,
    setCategory,
    setPriceMin,
    setPriceMax,
    setInStockOnly,
    setOriginalOnly,
  ])

  const onReset = useCallback(() => {
    lastWritten.current = null
    resetFilters()
    skipUrlToStore.current = true
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [resetFilters, setSearchParams])

  return (
    <>
      <SeoHead title="Каталог — KR‑CN Parts" description="Фильтры, сортировка и быстрый поиск автозапчастей." />
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог' }]} />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Каталог
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Найдено: <span className="font-mono font-semibold">{total}</span> позиций · прокрутите вниз для подгрузки
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={view === 'grid' ? 'primary' : 'outline'}
              className="px-3"
              onClick={() => setView('grid')}
              aria-pressed={view === 'grid'}
            >
              <LayoutGrid className="h-4 w-4" />
              Сетка
            </Button>
            <Button
              type="button"
              variant={view === 'list' ? 'primary' : 'outline'}
              className="px-3"
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
            >
              <List className="h-4 w-4" />
              Список
            </Button>
          </div>
        </div>
      </div>

      {chips.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={c.onClear}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800 hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {c.label}
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          ))}
          <Button type="button" variant="ghost" className="px-2 py-1 text-xs" onClick={onReset}>
            Сбросить всё
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar title="Фильтры каталога">
            <ProductFilters
              search={search}
              brand={brand}
              category={category}
              priceMin={priceMin}
              priceMax={priceMax}
              inStockOnly={inStockOnly}
              originalOnly={originalOnly}
              sort={sort}
              onSearch={setSearch}
              onBrand={setBrand}
              onCategory={setCategory}
              onPriceMin={setPriceMin}
              onPriceMax={setPriceMax}
              onInStock={setInStockOnly}
              onOriginal={setOriginalOnly}
              onSort={setSort}
              onReset={onReset}
            />
          </Sidebar>
          {vehicle ? (
            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Мой автомобиль</div>
              <div className="mt-1 font-semibold text-slate-900 dark:text-white">
                {vehicle.brandName} {vehicle.model}, {vehicle.year}
              </div>
              <Badge tone="accent" className="mt-2">
                Фильтр по бренду активен
              </Badge>
            </div>
          ) : null}
        </div>

        <div className="col-span-12 lg:col-span-9">
          {inf.isPending ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ProductGrid products={items} view={view} />
          )}

          <div ref={sentinelRef} className="mt-10 flex min-h-16 items-center justify-center py-6">
            {inf.isFetchingNextPage ? <Loader label="Подгружаем…" /> : null}
            {!inf.hasNextPage && items.length > 0 ? (
              <span className="text-sm text-slate-500">Все товары загружены</span>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
