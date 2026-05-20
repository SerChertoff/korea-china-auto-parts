import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  Car,
  ChevronDown,
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  User,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { CITIES, SITE_PHONE, WORK_HOURS } from '../../utils/constants'
import { PART_CATEGORIES } from '../../data/categories'
import { VEHICLE_BRANDS } from '../../data/brands'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { CartDrawer } from '../cart/CartDrawer'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { useThemeStore, applyThemeClass } from '../../store/themeStore'
import { useVehicleStore } from '../../store/vehicleStore'
import { MobileMenu } from './MobileMenu'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold transition hover:text-primary ${isActive ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`

/** Шапка: три уровня, липкая, mega-menu каталога, поиск, корзина, автомобиль */
export function Header() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [vehicleOpen, setVehicleOpen] = useState(false)
  const [q, setQ] = useState('')
  const closeTimer = useRef<number | null>(null)

  const { count } = useCart()
  const { user, loginDemo, logout, isAuth } = useAuth()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggle)
  const vehicle = useVehicleStore((s) => s.vehicle)
  const setVehicle = useVehicleStore((s) => s.setVehicle)

  const [vBrand, setVBrand] = useState(VEHICLE_BRANDS[0]?.id ?? 'hyundai')
  const [vModel, setVModel] = useState('Creta')
  const [vYear, setVYear] = useState(2020)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    applyThemeClass(theme)
  }, [theme])

  const cityLabel = useMemo(() => CITIES[0] ?? 'Москва', [])

  function openMega() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }
  function delayCloseMega() {
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140)
  }

  function onSearchSubmit(e: FormEvent) {
    e.preventDefault()
    const s = q.trim()
    if (!s) return
    navigate(`/catalog?q=${encodeURIComponent(s)}`)
  }

  function saveVehicle() {
    const b = VEHICLE_BRANDS.find((x) => x.id === vBrand)
    if (!b) return
    setVehicle({
      brandId: b.id,
      brandName: b.name,
      model: vModel.trim(),
      year: vYear,
    })
    setVehicleOpen(false)
    navigate(`/catalog?brand=${encodeURIComponent(b.name)}`)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      {/* Верхняя полоса */}
      <div className="hidden border-b border-slate-100 bg-slate-50 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 lg:px-6">
          <div className="flex flex-wrap items-center gap-4">
            <a className="font-semibold hover:text-primary" href={`tel:${SITE_PHONE.replace(/\D/g, '')}`}>
              {SITE_PHONE}
            </a>
            <span className="text-slate-400">|</span>
            <span>{WORK_HOURS}</span>
            <span className="text-slate-400">|</span>
            <span className="inline-flex items-center gap-1">
              <span className="hidden md:inline">Город:</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 font-semibold hover:text-primary"
                aria-haspopup="listbox"
              >
                {cityLabel}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a className="hover:text-primary" href="https://t.me/" target="_blank" rel="noreferrer">
              Telegram
            </a>
            <a className="hover:text-primary" href="https://vk.com/" target="_blank" rel="noreferrer">
              VK
            </a>
          </div>
        </div>
      </div>

      {/* Основная панель */}
      <div className={`mx-auto max-w-7xl px-4 transition-all lg:px-6 ${scrolled ? 'py-2' : 'py-3'}`}>
        <div className="flex items-center gap-3 lg:gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-display text-lg font-black text-white shadow-glow-sm">
              K
            </div>
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                KR‑CN Parts
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Korea & China OEM</span>
            </div>
          </Link>

          <form className="mx-auto hidden min-w-0 max-w-xl flex-1 md:block" onSubmit={onSearchSubmit} role="search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Поиск по артикулу, OEM, названию…"
                className="w-full rounded-2xl border border-slate-200 bg-surface py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                aria-label="Поиск по каталогу"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              className="hidden px-2 sm:inline-flex"
              aria-label="Переключить тему"
              onClick={() => toggleTheme()}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button type="button" variant="ghost" className="hidden px-2 lg:inline-flex" aria-label="Избранное">
              <Heart className="h-5 w-5" />
            </Button>

            {isAuth ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/account" className="inline-flex max-w-[140px] items-center gap-2 truncate text-sm font-semibold text-slate-800 hover:text-primary dark:text-slate-100">
                  <User className="h-5 w-5 shrink-0" />
                  <span className="truncate">{user?.name}</span>
                </Link>
                <Button type="button" variant="outline" className="px-2 py-1 text-xs" onClick={() => logout()}>
                  Выйти
                </Button>
              </div>
            ) : (
              <Button type="button" variant="outline" className="hidden sm:inline-flex" onClick={() => loginDemo()}>
                <User className="h-4 w-4" />
                Войти
              </Button>
            )}

            <Button
              type="button"
              variant="primary"
              className="relative px-3"
              onClick={() => setCartOpen(true)}
              aria-label={`Корзина, товаров: ${count}`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Корзина</span>
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-slate-900">
                  {count > 99 ? '99+' : count}
                </span>
              ) : null}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="lg:hidden"
              aria-label="Открыть меню"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Виджет автомобиля + мобильный поиск */}
        <div className="mt-3 flex flex-col gap-2 md:hidden">
          <form onSubmit={onSearchSubmit} role="search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Быстрый поиск…"
                className="w-full rounded-2xl border border-slate-200 bg-surface py-2.5 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                aria-label="Поиск по каталогу"
              />
            </div>
          </form>
          <button
            type="button"
            onClick={() => setVehicleOpen(true)}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <span className="inline-flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              {vehicle ? `${vehicle.brandName} ${vehicle.model}, ${vehicle.year}` : 'Подбор по авто'}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Нижняя навигация (десктоп) */}
      <div className="hidden border-t border-slate-100 bg-white/90 dark:border-slate-800 dark:bg-slate-950/90 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-6">
          <nav className="flex items-center gap-6" aria-label="Основная навигация">
            <div className="relative" onMouseEnter={openMega} onMouseLeave={delayCloseMega}>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800 hover:text-primary dark:text-slate-100"
                aria-expanded={megaOpen}
                aria-haspopup="true"
              >
                Каталог
                <ChevronDown className="h-4 w-4" />
              </button>
              {megaOpen ? (
                <div className="absolute left-0 top-full z-40 mt-2 w-[min(920px,calc(100vw-48px))] rounded-2xl border border-slate-100 bg-white p-4 shadow-glow dark:border-slate-800 dark:bg-slate-900">
                  <div className="grid grid-cols-3 gap-3">
                    {PART_CATEGORIES.map((c) => (
                      <Link
                        key={c.id}
                        to={`/catalog?category=${encodeURIComponent(c.id)}`}
                        className="rounded-xl border border-slate-100 px-3 py-2 text-sm font-semibold hover:border-primary hover:text-primary dark:border-slate-800"
                        onClick={() => setMegaOpen(false)}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <NavLink to="/brands" className={navClass}>
              Бренды
            </NavLink>
            <button
              type="button"
              className="text-sm font-semibold text-slate-800 hover:text-primary dark:text-slate-100"
              onClick={() => setVehicleOpen(true)}
            >
              Подбор по авто
            </button>
            <NavLink to="/catalog" className={navClass}>
              Акции
            </NavLink>
            <NavLink to="/about#delivery" className={navClass}>
              Доставка
            </NavLink>
            <NavLink to="/contact" className={navClass}>
              Контакты
            </NavLink>
          </nav>

          <motion.div
            className="hidden items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 xl:flex"
            layout
          >
            <Car className="h-4 w-4 text-primary" />
            <span className="max-w-[220px] truncate">
              {vehicle ? `Мой авто: ${vehicle.brandName} ${vehicle.model}, ${vehicle.year}` : 'Автомобиль не выбран'}
            </span>
            <Button type="button" variant="ghost" className="px-2 py-1 text-xs" onClick={() => setVehicleOpen(true)}>
              Изменить
            </Button>
          </motion.div>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Modal open={vehicleOpen} onClose={() => setVehicleOpen(false)} title="Подбор по автомобилю" size="lg">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="vbrand">
              Марка
            </label>
            <select
              id="vbrand"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
              value={vBrand}
              onChange={(e) => setVBrand(e.target.value)}
            >
              {VEHICLE_BRANDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <Input label="Модель" value={vModel} onChange={(e) => setVModel(e.target.value)} />
          <Input
            label="Год выпуска"
            inputMode="numeric"
            value={String(vYear)}
            onChange={(e) => setVYear(Number(e.target.value.replace(/\D/g, '').slice(0, 4) || 0))}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="primary" onClick={saveVehicle}>
            Сохранить и показать запчасти
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setVehicle(null)
              setVehicleOpen(false)
            }}
          >
            Сбросить авто
          </Button>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Выбор сохраняется в браузере (localStorage) и подставляется в фильтры каталога.
        </p>
      </Modal>
    </header>
  )
}
