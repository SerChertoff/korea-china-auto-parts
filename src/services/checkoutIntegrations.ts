import { api } from './api'

/** Демо-ответ «перевозчика» (подключите CDEK/Почту и т.д.) */
export interface ShippingQuote {
  provider: string
  priceRub: number
  daysMin: number
  daysMax: number
  message: string
}

export async function fetchShippingQuote(params: {
  method: string
  address: string
  npPickup?: string
}): Promise<ShippingQuote> {
  const { data } = await api.get<ShippingQuote>('/shipping/quote', {
    params: {
      method: params.method,
      address: params.address,
      npPickup: params.npPickup || undefined,
    },
  })
  return data
}

/** Заглушка платёжной сессии (ЮKassa / CloudPayments и т.п.) */
export interface PaymentSessionDemo {
  demo: boolean
  provider: string
  confirmationUrl: string | null
  message: string
}

export async function createPaymentSessionDemo(body: {
  amountRub: number
  method: string
}): Promise<PaymentSessionDemo> {
  const { data } = await api.post<PaymentSessionDemo>('/payment/session', body)
  return data
}
