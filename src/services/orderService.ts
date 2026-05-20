import type { CartItem } from '../types'

export interface CheckoutPayload {
  contact: { name: string; phone: string; email: string }
  delivery: { method: string; address: string; comment?: string }
  payment: { method: string }
  items: CartItem[]
  total: number
}

/** Отправка заказа (заглушка под будущий REST) */
export async function submitOrder(payload: CheckoutPayload): Promise<{ orderId: string }> {
  await new Promise((r) => setTimeout(r, 600))
  void payload
  const orderId = `ORD-${Date.now()}`
  return { orderId }
}
