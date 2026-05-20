# KR‑CN Parts

Интернет‑магазин автозапчастей для корейских и китайских автомобилей (React + Vite + TypeScript + Tailwind).

Демо-каталог подгружается из `src/data/mockProducts.ts` с **реальными фото запчастей** (Wikimedia Commons, см. `src/data/partProductImages.ts`). Для коммерческого использования проверьте лицензии и атрибуцию на странице каждого файла.

## Запуск

### Фронтенд только

```bash
npm install
npm run dev
```

### API + фронт (рекомендуется)

В одном терминале:

```bash
npm run dev:full
```

Или отдельно: `npm run dev:server` (порт **4000**) и `npm run dev` (Vite, порт **5173**). Vite проксирует `/api` → `http://localhost:4000`.

Переменная **`VITE_SITE_URL`** (см. `.env.example`) задаёт канонический домен для SEO: Open Graph, canonical, JSON-LD, а также `sitemap.xml` и `robots.txt` при `npm run build`. В dev без `.env` используется `http://localhost:5173`.

## UI (shadcn-паттерн)

В корне лежит `components.json`. Базовые компоненты в `src/components/ui/` используют **`cn()`** (`src/lib/utils.ts`), **CVA**, **Radix** (`Dialog`, `Slot`). Добавлять блоки из реестра: `npx shadcn@latest add …` (при необходимости поправьте алиасы под этот проект).

## API (Express)

- `GET /api/health` — проверка
- `GET /api/shipping/quote` — демо-расчёт доставки (method, address, npPickup)
- `POST /api/payment/session` — демо-сессия оплаты (amountRub, method)
- `GET /api/products` — каталог (query: search, brand, category, priceMin, priceMax, inStockOnly, originalOnly, sort, page, pageSize)
- `GET /api/products/offset` — порции для бесконечного скролла (offset, limit, те же фильтры)
- `GET /api/products/suggest?q=` — подсказки поиска
- `GET /api/products/:id` — карточка товара
- `GET /api/products/:id/reviews` — отзывы
- `POST /api/products/:id/reviews` — добавить отзыв
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `POST /api/orders` — создать заказ (JWT опционально)
- `GET /api/orders` — заказы текущего пользователя (JWT)

Демо‑аккаунт: **demo@kr-cn.parts** / **demo1234**

Данные пользователей, заказов и отзывов пишутся в `server/data/app-state.json` (файл в `.gitignore`).

## Переменные окружения

- `JWT_SECRET` — секрет подписи JWT (на продакшене обязателен)
- `PORT` — порт API (по умолчанию 4000)
- `VITE_API_URL` — базовый URL API для фронта (если не используете прокси Vite)

## Сборка

```bash
npm run build
npm run preview
```

Сборка фронта не включает сервер; для продакшена API запускайте отдельно (`tsx server/src/index.ts` или соберите сервер под Node).
