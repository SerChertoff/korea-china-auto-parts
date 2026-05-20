import { api } from './api'
import type { CatalogSort, Product } from '../types'

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

export interface ProductOffsetResult {
  items: Product[]
  total: number
  offset: number
  limit: number
  nextOffset: number | null
}

/** Список товаров (пагинация) */
export async function fetchProducts(q: ProductQuery): Promise<ProductListResult> {
  const { data } = await api.get<ProductListResult>('/products', {
    params: {
      search: q.search || undefined,
      brand: q.brand || undefined,
      category: q.category || undefined,
      priceMin: q.priceMin,
      priceMax: q.priceMax,
      inStockOnly: q.inStockOnly || undefined,
      originalOnly: q.originalOnly || undefined,
      sort: q.sort,
      page: q.page,
      pageSize: q.pageSize,
    },
  })
  return data
}

/** Бесконечный скролл: порция по offset */
export async function fetchProductsOffset(params: {
  search?: string
  brand?: string
  category?: string
  priceMin?: number
  priceMax?: number
  inStockOnly?: boolean
  originalOnly?: boolean
  sort?: CatalogSort
  offset: number
  limit?: number
}): Promise<ProductOffsetResult> {
  const { data } = await api.get<ProductOffsetResult>('/products/offset', {
    params: {
      ...params,
      limit: params.limit ?? 12,
    },
  })
  return data
}

/** Подсказки поиска */
export async function fetchSearchSuggest(q: string): Promise<Product[]> {
  if (!q.trim()) return []
  const { data } = await api.get<{ items: Product[] }>('/products/suggest', { params: { q } })
  return data.items
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const { data } = await api.get<Product>(`/products/${id}`)
    return data
  } catch {
    return null
  }
}
