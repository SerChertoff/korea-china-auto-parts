import { create } from 'zustand'
import type { CatalogSort, CatalogViewMode } from '../types'

/** Состояние фильтров каталога (без персиста — при каждом визите сбрасывается) */
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
  page: number
  setSearch: (v: string) => void
  setBrand: (v: string) => void
  setCategory: (v: string) => void
  setPriceMin: (v: number) => void
  setPriceMax: (v: number) => void
  setInStockOnly: (v: boolean) => void
  setOriginalOnly: (v: boolean) => void
  setSort: (v: CatalogSort) => void
  setView: (v: CatalogViewMode) => void
  setPage: (v: number) => void
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
  page: 1,
}

export const useFiltersStore = create<FiltersState>((set) => ({
  ...initial,
  setSearch: (search) => set({ search, page: 1 }),
  setBrand: (brand) => set({ brand, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setPriceMin: (priceMin) => set({ priceMin, page: 1 }),
  setPriceMax: (priceMax) => set({ priceMax, page: 1 }),
  setInStockOnly: (inStockOnly) => set({ inStockOnly, page: 1 }),
  setOriginalOnly: (originalOnly) => set({ originalOnly, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setView: (view) => set({ view }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ ...initial }),
}))
