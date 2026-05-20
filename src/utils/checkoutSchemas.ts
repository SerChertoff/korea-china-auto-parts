import { z } from 'zod'
import { isCompleteRuMobile } from './phoneRu'

export const checkoutContactSchema = z.object({
  name: z.string().min(2, 'Укажите имя'),
  phone: z.string().refine(isCompleteRuMobile, 'Введите полный мобильный номер РФ'),
  email: z.string().email('Некорректный email'),
})

export const checkoutDeliverySchema = z
  .object({
    method: z.enum(['pickup', 'courier', 'cdek', 'post']),
    address: z.string(),
    comment: z.string().optional(),
    /** Код ПВЗ для демо-интеграции СДЭК */
    npPickup: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.method === 'pickup') return
    if (data.address.trim().length < 5) {
      ctx.addIssue({
        code: 'custom',
        path: ['address'],
        message: 'Укажите адрес или пункт выдачи',
      })
    }
    if (data.method === 'cdek') {
      const c = data.npPickup?.trim() ?? ''
      if (c.length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['npPickup'],
          message: 'Укажите код ПВЗ (демо, например MSK123)',
        })
      }
    }
  })

export const checkoutPaymentSchema = z.object({
  method: z.enum(['card', 'cash', 'sbp']),
})

export type CheckoutContact = z.infer<typeof checkoutContactSchema>
export type CheckoutDelivery = z.infer<typeof checkoutDeliverySchema>
export type CheckoutPayment = z.infer<typeof checkoutPaymentSchema>
