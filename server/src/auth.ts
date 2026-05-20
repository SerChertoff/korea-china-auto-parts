import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { UserRow } from './types.js'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-jwt-secret-change-in-production'

export function signToken(user: Pick<UserRow, 'id' | 'email'>): string {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { sub: string; email: string } | null {
  try {
    const p = jwt.verify(token, JWT_SECRET) as { sub: string; email: string }
    if (typeof p.sub === 'string' && typeof p.email === 'string') return p
    return null
  } catch {
    return null
  }
}

export interface AuthedRequest extends Request {
  userId?: string
  userEmail?: string
}

/** Bearer JWT → req.userId */
export function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction): void {
  const h = req.headers.authorization
  if (!h?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Требуется авторизация' })
    return
  }
  const token = h.slice(7)
  const payload = verifyToken(token)
  if (!payload) {
    res.status(401).json({ error: 'Недействительный токен' })
    return
  }
  req.userId = payload.sub
  req.userEmail = payload.email
  next()
}

/** Опционально: если токен есть и валиден — проставляет userId */
export function optionalAuthMiddleware(req: AuthedRequest, _res: Response, next: NextFunction): void {
  const h = req.headers.authorization
  if (h?.startsWith('Bearer ')) {
    const payload = verifyToken(h.slice(7))
    if (payload) {
      req.userId = payload.sub
      req.userEmail = payload.email
    }
  }
  next()
}
