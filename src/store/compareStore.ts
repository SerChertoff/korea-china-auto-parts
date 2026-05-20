import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../types'

const MAX = 5

interface CompareState {
  products: Product[]
  toggle: (product: Product) => boolean
  remove: (productId: string) => void
  clear: () => void
  has: (productId: string) => boolean
}

/** Сравнение до MAX товаров; при переполнении последний не добавляется — возвращает false */
export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      products: [],
      has: (productId) => get().products.some((p) => p.id === productId),
      remove: (productId) =>
        set({ products: get().products.filter((p) => p.id !== productId) }),
      clear: () => set({ products: [] }),
      toggle: (product) => {
        const { products } = get()
        if (products.some((p) => p.id === product.id)) {
          set({ products: products.filter((p) => p.id !== product.id) })
          return true
        }
        if (products.length >= MAX) return false
        set({ products: [...products, product] })
        return true
      },
    }),
    { name: 'kr-cn-compare' },
  ),
)

export function selectCompareCount(state: CompareState): number {
  return state.products.length
}
