import type { PartCategory } from '../types'

/** 10 категорий запчастей для главной и фильтров */
export const PART_CATEGORIES: PartCategory[] = [
  { id: 'engine', name: 'Двигатель', slug: 'dvigatel', icon: 'engine' },
  { id: 'brakes', name: 'Тормоза', slug: 'tormoza', icon: 'brake' },
  { id: 'suspension', name: 'Подвеска', slug: 'podveska', icon: 'suspension' },
  { id: 'filters', name: 'Фильтры', slug: 'filtry', icon: 'filter' },
  { id: 'body', name: 'Кузовные', slug: 'kuzov', icon: 'body' },
  { id: 'electrical', name: 'Электрика', slug: 'elektrika', icon: 'bolt' },
  { id: 'consumables', name: 'Расходники', slug: 'rashodniki', icon: 'package' },
  { id: 'oils', name: 'Масла и жидкости', slug: 'masla', icon: 'droplet' },
  { id: 'timing', name: 'ГРМ и приводы', slug: 'grm', icon: 'cog' },
  { id: 'exhaust', name: 'Выхлоп', slug: 'vihlop', icon: 'flame' },
]
