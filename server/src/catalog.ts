import type { Product } from '../../src/types/index.ts'
import type { CatalogSort } from '../../src/types/index.ts'

export interface ProductQuery {
  search?: string
  brand?: string
  category?: string
  priceMin?: number
  priceMax?: number
  inStockOnly?: boolean
  originalOnly?: boolean
  sort?: CatalogSort
  page?: number
  pageSize?: number
}

export type ProductFilter = Omit<ProductQuery, 'page' | 'pageSize'>

/** Фильтрация + сортировка без пагинации */
export function filterAllProducts(all: Product[], q: ProductFilter): Product[] {
  let list = [...all]

  if (q.search?.trim()) {
    const s = q.search.trim().toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.article.toLowerCase().includes(s) ||
        p.oem.some((o) => o.toLowerCase().includes(s)) ||
        p.brand.toLowerCase().includes(s),
    )
  }
  if (q.brand) list = list.filter((p) => p.brand === q.brand)
  if (q.category) list = list.filter((p) => p.category === q.category)
  if (q.priceMin != null) list = list.filter((p) => p.price >= q.priceMin!)
  if (q.priceMax != null) list = list.filter((p) => p.price <= q.priceMax!)
  if (q.inStockOnly) list = list.filter((p) => p.inStock)
  if (q.originalOnly) list = list.filter((p) => p.isOriginal)

  const sort = q.sort ?? 'popular'
  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
  else if (sort === 'new') list.sort((a, b) => b.id.localeCompare(a.id))
  else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
  else list.sort((a, b) => b.reviewsCount - a.reviewsCount)

  return list
}

/** Пагинация поверх filterAllProducts */
export function queryProducts(all: Product[], q: ProductQuery): { items: Product[]; total: number } {
  const list = filterAllProducts(all, q)
  const total = list.length
  const pageSize = q.pageSize ?? 12
  const page = q.page ?? 1
  const start = (page - 1) * pageSize
  const items = list.slice(start, start + pageSize)
  return { items, total }
}

/** Подсказки для поиска */
export function suggestProducts(all: Product[], q: string, limit = 10): Product[] {
  const s = q.trim().toLowerCase()
  if (!s) return []
  return all
    .filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.article.toLowerCase().includes(s) ||
        p.oem.some((o) => o.toLowerCase().includes(s)),
    )
    .slice(0, limit)
}
