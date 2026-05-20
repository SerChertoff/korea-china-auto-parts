import axios from 'axios'

/** Базовый HTTP-клиент; в продакшене подставьте VITE_API_URL */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})
