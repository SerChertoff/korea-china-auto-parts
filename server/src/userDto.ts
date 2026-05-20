import type { UserRow } from './types.js'

export interface PublicUser {
  id: string
  email: string
  name: string
  phone?: string
}

export function toPublicUser(u: UserRow): PublicUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone ?? undefined,
  }
}
