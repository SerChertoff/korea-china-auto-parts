/** Персистентные сущности API (пользователи, заказы, отзывы) */
export interface UserRow {
  id: string
  email: string
  passwordHash: string
  name: string
  phone: string | null
  createdAt: string
}

export interface OrderRow {
  id: string
  userId: string | null
  guestEmail: string | null
  total: number
  payload: string
  status: string
  createdAt: string
}

export interface ReviewRow {
  id: string
  productId: string
  userId: string | null
  authorName: string
  rating: number
  text: string
  createdAt: string
}

export interface AppState {
  users: UserRow[]
  orders: OrderRow[]
  reviews: ReviewRow[]
}
