/** Совместимость запчасти с конкретным автомобилем */
export interface VehicleCompatibility {
  brand: string
  model: string
  yearFrom: number
  yearTo: number
}

/** Карточка товара в каталоге */
export interface Product {
  id: string
  name: string
  article: string
  oem: string[]
  brand: string
  manufacturer: string
  category: string
  price: number
  oldPrice?: number
  images: string[]
  inStock: boolean
  stockCount: number
  rating: number
  reviewsCount: number
  isOriginal: boolean
  compatibility: VehicleCompatibility[]
  characteristics: Record<string, string>
  description: string
}

/** Отзыв о товаре (с API) */
export interface ProductReview {
  id: string
  productId: string
  authorName: string
  rating: number
  text: string
  createdAt: string
}

/** Позиция в корзине */
export interface CartItem {
  product: Product
  quantity: number
}

/** Бренд автомобиля в каталоге подбора */
export interface VehicleBrand {
  id: string
  name: string
  country: 'KR' | 'CN'
  /** Placeholder: градиент или URL; в макете используем CSS-инициалы */
  logoPlaceholder: string
}

/** Категория запчастей */
export interface PartCategory {
  id: string
  name: string
  slug: string
  icon: string
}

/** Пользователь (упрощённо для демо) */
export interface User {
  id: string
  email: string
  name: string
  phone?: string
}

/** Заказ после оформления */
export interface Order {
  id: string
  createdAt: string
  items: CartItem[]
  total: number
  deliveryMethod: string
  paymentMethod: string
}

/** Сортировка каталога */
export type CatalogSort = 'popular' | 'price-asc' | 'price-desc' | 'new' | 'rating'

/** Режим отображения сетки */
export type CatalogViewMode = 'grid' | 'list'

/** Выбранный автомобиль для подбора */
export interface SelectedVehicle {
  brandId: string
  brandName: string
  model: string
  year: number
  modification?: string
}
