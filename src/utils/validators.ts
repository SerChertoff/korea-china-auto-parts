import { z } from 'zod'

/** Простая проверка VIN (17 символов без I, O, Q) */
export const vinSchema = z
  .string()
  .trim()
  .length(17, 'VIN должен содержать 17 символов')
  .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, 'Некорректный формат VIN')

/** Форма «не нашли деталь» */
export const requestPartSchema = z.object({
  name: z.string().min(2, 'Укажите имя'),
  phone: z.string().min(10, 'Укажите телефон'),
  comment: z.string().min(10, 'Опишите запрос подробнее'),
})

export type RequestPartForm = z.infer<typeof requestPartSchema>
