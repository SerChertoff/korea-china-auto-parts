import { create } from 'zustand'
import type { CatalogSort, CatalogViewMode } from '../types'

/** Состояние фильтров каталога (синхронизируется с URL на странице каталога) */
interface FiltersState {
  search: string
  brand: string
  category: string
  priceMin: number
  priceMax: number
  inStockOnly: boolean
  originalOnly: boolean
  sort: CatalogSort
  view: CatalogViewMode
  setSearch: (v: string) => void
  setBrand: (v: string) => void
  setCategory: (v: string) => void
  setPriceMin: (v: number) => void
  setPriceMax: (v: number) => void
  setInStockOnly: (v: boolean) => void
  setOriginalOnly: (v: boolean) => void
  setSort: (v: CatalogSort) => void
  setView: (v: CatalogViewMode) => void
  resetFilters: () => void
}

const initial = {
  search: '',
  brand: '',
  category: '',
  priceMin: 0,
  priceMax: 120_000,
  inStockOnly: false,
  originalOnly: false,
  sort: 'popular' as CatalogSort,
  view: 'grid' as CatalogViewMode,
}

export const useFiltersStore = create<FiltersState>((set) => ({
  ...initial,
  setSearch: (search) => set({ search }),
  setBrand: (brand) => set({ brand }),
  setCategory: (category) => set({ category }),
  setPriceMin: (priceMin) => set({ priceMin }),
  setPriceMax: (priceMax) => set({ priceMax }),
  setInStockOnly: (inStockOnly) => set({ inStockOnly }),
  setOriginalOnly: (originalOnly) => set({ originalOnly }),
  setSort: (sort) => set({ sort }),
  setView: (view) => set({ view }),
  resetFilters: () => set({ ...initial }),
}))
