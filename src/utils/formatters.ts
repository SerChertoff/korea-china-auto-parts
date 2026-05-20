/** Форматирование цены в рублях с неразрывным пробелом */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}

/** Склонение слова «отзыв» */
export function reviewsWord(count: number): string {
  const n = Math.abs(count) % 100
  const n1 = n % 10
  if (n > 10 && n < 20) return 'отзывов'
  if (n1 > 1 && n1 < 5) return 'отзыва'
  if (n1 === 1) return 'отзыв'
  return 'отзывов'
}
