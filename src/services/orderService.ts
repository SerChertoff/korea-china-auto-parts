import { api } from './api'
import type { CartItem } from '../types'

export interface CheckoutPayload {
  contact: { name: string; phone: string; email: string }
  delivery: { method: string; address: string; comment?: string }
  payment: { method: string }
  items: CartItem[]
  total: number
}

/** Создание заказа на сервере */
export async function submitOrder(payload: CheckoutPayload): Promise<{ orderId: string; total: number }> {
  const { data } = await api.post<{ orderId: string; total: number }>('/orders', {
    items: payload.items.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
    })),
    contact: payload.contact,
    delivery: payload.delivery,
    payment: payload.payment,
    clientTotal: payload.total,
  })
  return data
}
