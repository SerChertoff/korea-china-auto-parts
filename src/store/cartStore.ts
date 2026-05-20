import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '../types'

interface CartState {
  items: CartItem[]
  promoCode: string | null
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
  setPromoCode: (code: string | null) => void
}

function applyPromo(subtotal: number, code: string | null): number {
  if (!code) return subtotal
  const c = code.trim().toUpperCase()
  if (c === 'PARTS5') return Math.round(subtotal * 0.95)
  return subtotal
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      addItem: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find((i) => i.product.id === product.id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          })
        } else {
          set({ items: [...items, { product, quantity }] })
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.product.id !== productId) }),
      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i,
          ),
        })
      },
      clear: () => set({ items: [], promoCode: null }),
      setPromoCode: (code) => set({ promoCode: code }),
    }),
    { name: 'kr-cn-cart' },
  ),
)

export function selectCartSubtotal(state: CartState): number {
  return state.items.reduce((s, i) => s + i.product.price * i.quantity, 0)
}

export function selectCartTotal(state: CartState): number {
  return applyPromo(selectCartSubtotal(state), state.promoCode)
}

export function selectCartCount(state: CartState): number {
  return state.items.reduce((n, i) => n + i.quantity, 0)
}
