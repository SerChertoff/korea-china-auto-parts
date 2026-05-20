import type { CatalogSort, Product } from '../types'
import { MOCK_PRODUCTS } from '../data/mockProducts'

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

export interface ProductListResult {
  items: Product[]
  total: number
  page: number
  pageSize: number
}

/** Имитация задержки сети для демонстрации скелетонов и React Query */
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

/** Локальная фильтрация мок-каталога (вместо бэкенда на этапе прототипа) */
export async function fetchProducts(q: ProductQuery): Promise<ProductListResult> {
  await delay(380)
  let list = [...MOCK_PRODUCTS]

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

  const pageSize = q.pageSize ?? 12
  const page = q.page ?? 1
  const total = list.length
  const start = (page - 1) * pageSize
  const items = list.slice(start, start + pageSize)
  return { items, total, page, pageSize }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await delay(220)
  const p = MOCK_PRODUCTS.find((x) => x.id === id) ?? null
  return p
}
