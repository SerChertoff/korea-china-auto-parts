import { useCartStore, selectCartCount, selectCartSubtotal, selectCartTotal } from '../store/cartStore'

/** Удобная обёртка над корзиной для компонентов */
export function useCart() {
  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const clear = useCartStore((s) => s.clear)
  const promoCode = useCartStore((s) => s.promoCode)
  const setPromoCode = useCartStore((s) => s.setPromoCode)
  const subtotal = useCartStore(selectCartSubtotal)
  const total = useCartStore(selectCartTotal)
  const count = useCartStore(selectCartCount)
  return {
    items,
    addItem,
    removeItem,
    setQuantity,
    clear,
    promoCode,
    setPromoCode,
    subtotal,
    total,
    count,
  }
}
