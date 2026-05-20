import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { MOCK_PRODUCTS } from '../../src/data/mockProducts.ts'
import type { Product } from '../../src/types/index.ts'
import type { CatalogSort } from '../../src/types/index.ts'
import { queryProducts, suggestProducts, filterAllProducts } from './catalog.ts'
import { loadState, saveState, appendUser, appendOrder, appendReview } from './state.ts'
import { signToken, authMiddleware, optionalAuthMiddleware, type AuthedRequest } from './auth.ts'
import { toPublicUser } from './userDto.ts'
import type { AppState, OrderRow, ReviewRow, UserRow } from './types.js'

const PORT = Number(process.env.PORT ?? 4000)
const DEMO_EMAIL = 'demo@kr-cn.parts'
const DEMO_PASSWORD = 'demo1234'

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '1mb' }))

const products: Product[] = MOCK_PRODUCTS

let state: AppState = loadState()

function persist(): void {
  saveState(state)
}

function ensureDemoUser(): void {
  if (state.users.some((u) => u.email === DEMO_EMAIL)) return
  const id = randomUUID()
  const row: UserRow = {
    id,
    email: DEMO_EMAIL,
    passwordHash: bcrypt.hashSync(DEMO_PASSWORD, 10),
    name: 'Демо пользователь',
    phone: '+79000000000',
    createdAt: new Date().toISOString(),
  }
  state.users.push(row)
  persist()
}

function seedReviewsIfEmpty(): void {
  if (state.reviews.length > 0) return
  const now = new Date().toISOString()
  for (const p of products.slice(0, 15)) {
    const r1: ReviewRow = {
      id: randomUUID(),
      productId: p.id,
      userId: null,
      authorName: 'Покупатель',
      rating: 5,
      text: 'Деталь подошла, доставка быстрая.',
      createdAt: now,
    }
    state.reviews.push(r1)
  }
  persist()
}

ensureDemoUser()
seedReviewsIfEmpty()

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, products: products.length })
})

/** Важно: статические пути до :id */
app.get('/api/products/suggest', (req, res) => {
  const q = String(req.query.q ?? '')
  const items = suggestProducts(products, q, 12)
  res.json({ items })
})

app.get('/api/products/offset', (req, res) => {
  const filter = {
    search: String(req.query.search ?? '') || undefined,
    brand: String(req.query.brand ?? '') || undefined,
    category: String(req.query.category ?? '') || undefined,
    priceMin: req.query.priceMin != null ? Number(req.query.priceMin) : undefined,
    priceMax: req.query.priceMax != null ? Number(req.query.priceMax) : undefined,
    inStockOnly: req.query.inStockOnly === 'true' || req.query.inStockOnly === '1',
    originalOnly: req.query.originalOnly === 'true' || req.query.originalOnly === '1',
    sort: (String(req.query.sort || 'popular') || 'popular') as CatalogSort,
  }
  const all = filterAllProducts(products, filter)
  const total = all.length
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 12)))
  const offset = Math.max(0, Number(req.query.offset ?? 0))
  const slice = all.slice(offset, offset + limit)
  const nextOffset = offset + slice.length < total ? offset + slice.length : null
  res.json({ items: slice, total, offset, limit, nextOffset })
})

app.get('/api/products', (req, res) => {
  const q = {
    search: String(req.query.search ?? '') || undefined,
    brand: String(req.query.brand ?? '') || undefined,
    category: String(req.query.category ?? '') || undefined,
    priceMin: req.query.priceMin != null ? Number(req.query.priceMin) : undefined,
    priceMax: req.query.priceMax != null ? Number(req.query.priceMax) : undefined,
    inStockOnly: req.query.inStockOnly === 'true' || req.query.inStockOnly === '1',
    originalOnly: req.query.originalOnly === 'true' || req.query.originalOnly === '1',
    sort: (String(req.query.sort || 'popular') || 'popular') as CatalogSort,
    page: req.query.page != null ? Number(req.query.page) : 1,
    pageSize: req.query.pageSize != null ? Number(req.query.pageSize) : 12,
  }
  const { items, total } = queryProducts(products, q)
  res.json({ items, total, page: q.page, pageSize: q.pageSize })
})

app.get('/api/products/:id/reviews', (req, res) => {
  const list = state.reviews.filter((r) => r.productId === req.params.id)
  res.json({ items: list })
})

app.get('/api/products/:id', (req, res) => {
  const p = products.find((x) => x.id === req.params.id)
  if (!p) {
    res.status(404).json({ error: 'Товар не найден' })
    return
  }
  res.json(p)
})

const reviewBody = z.object({
  rating: z.number().min(1).max(5),
  text: z.string().min(5),
  authorName: z.string().min(2).optional(),
})

app.post('/api/products/:id/reviews', optionalAuthMiddleware, (req: AuthedRequest, res) => {
  const pid = req.params.id
  if (!products.some((p) => p.id === pid)) {
    res.status(404).json({ error: 'Товар не найден' })
    return
  }
  const parsed = reviewBody.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }
  const author =
    parsed.data.authorName ??
    (req.userId ? state.users.find((u) => u.id === req.userId)?.name : undefined) ??
    'Гость'
  const row: ReviewRow = {
    id: randomUUID(),
    productId: pid,
    userId: req.userId ?? null,
    authorName: author,
    rating: parsed.data.rating,
    text: parsed.data.text,
    createdAt: new Date().toISOString(),
  }
  appendReview(state, row)
  state = loadState()
  res.status(201).json(row)
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
})

app.post('/api/auth/register', (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Некорректные данные', details: parsed.error.flatten() })
    return
  }
  if (state.users.some((u) => u.email.toLowerCase() === parsed.data.email.toLowerCase())) {
    res.status(409).json({ error: 'Email уже зарегистрирован' })
    return
  }
  const row: UserRow = {
    id: randomUUID(),
    email: parsed.data.email.toLowerCase(),
    passwordHash: bcrypt.hashSync(parsed.data.password, 10),
    name: parsed.data.name,
    phone: parsed.data.phone ?? null,
    createdAt: new Date().toISOString(),
  }
  appendUser(state, row)
  state = loadState()
  const token = signToken(row)
  res.status(201).json({ token, user: toPublicUser(row) })
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

app.post('/api/auth/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Некорректные данные' })
    return
  }
  const u = state.users.find((x) => x.email.toLowerCase() === parsed.data.email.toLowerCase())
  if (!u || !bcrypt.compareSync(parsed.data.password, u.passwordHash)) {
    res.status(401).json({ error: 'Неверный email или пароль' })
    return
  }
  const token = signToken(u)
  res.json({ token, user: toPublicUser(u) })
})

app.get('/api/auth/me', authMiddleware, (req: AuthedRequest, res) => {
  const u = state.users.find((x) => x.id === req.userId)
  if (!u) {
    res.status(404).json({ error: 'Пользователь не найден' })
    return
  }
  res.json({ user: toPublicUser(u) })
})

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
})

const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  contact: z.object({
    name: z.string().min(2),
    phone: z.string().min(6),
    email: z.string().email(),
  }),
  delivery: z.object({
    method: z.string(),
    address: z.string(),
    comment: z.string().optional(),
  }),
  payment: z.object({ method: z.string() }),
  clientTotal: z.number().optional(),
})

app.post('/api/orders', optionalAuthMiddleware, (req: AuthedRequest, res) => {
  const parsed = orderSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Некорректный заказ', details: parsed.error.flatten() })
    return
  }
  let serverTotal = 0
  const lines: { productId: string; quantity: number; price: number; name: string }[] = []
  for (const line of parsed.data.items) {
    const p = products.find((x) => x.id === line.productId)
    if (!p) {
      res.status(400).json({ error: `Товар не найден: ${line.productId}` })
      return
    }
    serverTotal += p.price * line.quantity
    lines.push({ productId: p.id, quantity: line.quantity, price: p.price, name: p.name })
  }
  const id = `ORD-${Date.now()}`
  const row: OrderRow = {
    id,
    userId: req.userId ?? null,
    guestEmail: req.userId ? null : parsed.data.contact.email,
    total: serverTotal,
    payload: JSON.stringify({
      lines,
      contact: parsed.data.contact,
      delivery: parsed.data.delivery,
      payment: parsed.data.payment,
      clientTotal: parsed.data.clientTotal,
    }),
    status: 'new',
    createdAt: new Date().toISOString(),
  }
  appendOrder(state, row)
  state = loadState()
  res.status(201).json({ orderId: id, total: serverTotal })
})

app.get('/api/orders', authMiddleware, (req: AuthedRequest, res) => {
  const mine = state.orders.filter((o) => o.userId === req.userId)
  res.json({ items: mine })
})

app.listen(PORT, () => {
  console.log(`[server] API http://localhost:${PORT}`)
})
