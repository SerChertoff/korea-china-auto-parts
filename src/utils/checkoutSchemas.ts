import { z } from 'zod'

export const checkoutContactSchema = z.object({
  name: z.string().min(2, 'Укажите имя'),
  phone: z.string().min(10, 'Укажите телефон'),
  email: z.string().email('Некорректный email'),
})

export const checkoutDeliverySchema = z.object({
  method: z.enum(['pickup', 'courier', 'cdek', 'post']),
  address: z.string().min(5, 'Укажите адрес'),
  comment: z.string().optional(),
})

export const checkoutPaymentSchema = z.object({
  method: z.enum(['card', 'cash', 'sbp']),
})

export type CheckoutContact = z.infer<typeof checkoutContactSchema>
export type CheckoutDelivery = z.infer<typeof checkoutDeliverySchema>
export type CheckoutPayment = z.infer<typeof checkoutPaymentSchema>
