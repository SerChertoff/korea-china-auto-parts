import { PART_CATEGORIES } from '../../data/categories'
import { VEHICLE_BRANDS } from '../../data/brands'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import type { CatalogSort } from '../../types'

type Props = {
  search: string
  brand: string
  category: string
  priceMin: number
  priceMax: number
  inStockOnly: boolean
  originalOnly: boolean
  sort: CatalogSort
  onSearch: (v: string) => void
  onBrand: (v: string) => void
  onCategory: (v: string) => void
  onPriceMin: (v: number) => void
  onPriceMax: (v: number) => void
  onInStock: (v: boolean) => void
  onOriginal: (v: boolean) => void
  onSort: (v: CatalogSort) => void
  onReset: () => void
}

/** Боковая панель фильтров каталога */
export function ProductFilters({
  search,
  brand,
  category,
  priceMin,
  priceMax,
  inStockOnly,
  originalOnly,
  sort,
  onSearch,
  onBrand,
  onCategory,
  onPriceMin,
  onPriceMax,
  onInStock,
  onOriginal,
  onSort,
  onReset,
}: Props) {
  return (
    <aside className="space-y-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">Фильтры</h2>
        <Button type="button" variant="ghost" className="px-2 py-1 text-xs" onClick={onReset}>
          Сбросить
        </Button>
      </div>

      <Input label="Поиск" value={search} onChange={(e) => onSearch(e.target.value)} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="sort">
          Сортировка
        </label>
        <select
          id="sort"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
          value={sort}
          onChange={(e) => onSort(e.target.value as CatalogSort)}
        >
          <option value="popular">По популярности</option>
          <option value="price-asc">Цена: по возрастанию</option>
          <option value="price-desc">Цена: по убыванию</option>
          <option value="new">Новизна</option>
          <option value="rating">Рейтинг</option>
        </select>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Бренд авто</span>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
          value={brand}
          onChange={(e) => onBrand(e.target.value)}
        >
          <option value="">Все</option>
          {VEHICLE_BRANDS.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Категория</span>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
          value={category}
          onChange={(e) => onCategory(e.target.value)}
        >
          <option value="">Все</option>
          {PART_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Цена, ₽</span>
        <div className="grid grid-cols-2 gap-2">
          <Input
            aria-label="Минимальная цена"
            inputMode="numeric"
            value={String(priceMin)}
            onChange={(e) => onPriceMin(Number(e.target.value.replace(/\D/g, '') || 0))}
          />
          <Input
            aria-label="Максимальная цена"
            inputMode="numeric"
            value={String(priceMax)}
            onChange={(e) => onPriceMax(Number(e.target.value.replace(/\D/g, '') || 0))}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input type="checkbox" checked={inStockOnly} onChange={(e) => onInStock(e.target.checked)} />
        Только в наличии
      </label>
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input type="checkbox" checked={originalOnly} onChange={(e) => onOriginal(e.target.checked)} />
        Только оригинал
      </label>
    </aside>
  )
}
