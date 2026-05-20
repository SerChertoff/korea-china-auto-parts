import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, List, X } from 'lucide-react'
import { SeoHead } from '../components/common/SeoHead'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Pagination } from '../components/common/Pagination'
import { ProductGrid } from '../components/product/ProductGrid'
import { ProductFilters } from '../components/product/ProductFilters'
import { Sidebar } from '../components/layout/Sidebar'
import { ProductCardSkeleton } from '../components/ui/Skeleton'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useDebounce } from '../hooks/useDebounce'
import { useFiltersStore } from '../store/filtersStore'
import { useVehicleStore } from '../store/vehicleStore'
import { fetchProducts } from '../services/productService'
import { PART_CATEGORIES } from '../data/categories'

/** Каталог: фильтры, сортировка, переключение вида, пагинация */
export default function CatalogPage() {
  const [params] = useSearchParams()
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
  const page = useFiltersStore((s) => s.page)

  const setSearch = useFiltersStore((s) => s.setSearch)
  const setBrand = useFiltersStore((s) => s.setBrand)
  const setCategory = useFiltersStore((s) => s.setCategory)
  const setPriceMin = useFiltersStore((s) => s.setPriceMin)
  const setPriceMax = useFiltersStore((s) => s.setPriceMax)
  const setInStockOnly = useFiltersStore((s) => s.setInStockOnly)
  const setOriginalOnly = useFiltersStore((s) => s.setOriginalOnly)
  const setSort = useFiltersStore((s) => s.setSort)
  const setView = useFiltersStore((s) => s.setView)
  const setPage = useFiltersStore((s) => s.setPage)
  const resetFilters = useFiltersStore((s) => s.resetFilters)

  /** Синхронизация URL → фильтры при первом заходе и смене query */
  useEffect(() => {
    const q = params.get('q') ?? ''
    const vin = params.get('vin') ?? ''
    const b = params.get('brand') ?? ''
    const c = params.get('category') ?? ''
    if (q) setSearch(q)
    else if (vin) setSearch(vin)
    if (b) setBrand(b)
    if (c) setCategory(c)
  }, [params, setSearch, setBrand, setCategory])

  const debouncedSearch = useDebounce(search, 350)

  const query = useQuery({
    queryKey: [
      'products',
      debouncedSearch,
      brand,
      category,
      priceMin,
      priceMax,
      inStockOnly,
      originalOnly,
      sort,
      page,
    ],
    queryFn: () =>
      fetchProducts({
        search: debouncedSearch,
        brand: brand || undefined,
        category: category || undefined,
        priceMin,
        priceMax,
        inStockOnly,
        originalOnly,
        sort,
        page,
        pageSize: 12,
      }),
  })

  const chips = useMemo(() => {
    const out: { key: string; label: string; onClear: () => void }[] = []
    if (search.trim())
      out.push({ key: 'q', label: `Поиск: ${search}`, onClear: () => setSearch('') })
    if (brand) out.push({ key: 'b', label: `Авто: ${brand}`, onClear: () => setBrand('') })
    if (category) {
      const name = PART_CATEGORIES.find((x) => x.id === category)?.name ?? category
      out.push({ key: 'c', label: `Категория: ${name}`, onClear: () => setCategory('') })
    }
    if (inStockOnly) out.push({ key: 's', label: 'В наличии', onClear: () => setInStockOnly(false) })
    if (originalOnly) out.push({ key: 'o', label: 'Только оригинал', onClear: () => setOriginalOnly(false) })
    return out
  }, [search, brand, category, inStockOnly, originalOnly, setSearch, setBrand, setCategory, setInStockOnly, setOriginalOnly])

  const items = query.data?.items ?? []
  const total = query.data?.total ?? 0

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
              Найдено: <span className="font-mono font-semibold">{total}</span> позиций
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
          <Button type="button" variant="ghost" className="px-2 py-1 text-xs" onClick={() => resetFilters()}>
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
            onReset={() => resetFilters()}
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
          {query.isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ProductGrid products={items} view={view} />
          )}

          <div className="mt-8">
            <Pagination page={page} pageSize={12} total={total} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </>
  )
}
