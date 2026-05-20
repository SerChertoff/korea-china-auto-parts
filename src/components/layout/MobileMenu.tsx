import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { PART_CATEGORIES } from '../../data/categories'
import { VEHICLE_BRANDS } from '../../data/brands'

type Props = {
  open: boolean
  onClose: () => void
}

/** Полноэкранное мобильное меню */
export function MobileMenu({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] bg-white dark:bg-slate-950 lg:hidden"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 280, damping: 32 }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
            <div className="font-display text-lg font-extrabold">Меню</div>
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
              onClick={onClose}
              aria-label="Закрыть меню"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="max-h-[calc(100vh-64px)] space-y-6 overflow-y-auto p-4" aria-label="Мобильная навигация">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Каталог</div>
              <ul className="space-y-2">
                {PART_CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/catalog?category=${encodeURIComponent(c.id)}`}
                      className="block rounded-lg px-2 py-2 text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900"
                      onClick={onClose}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Бренды</div>
              <ul className="grid grid-cols-2 gap-2">
                {VEHICLE_BRANDS.map((b) => (
                  <li key={b.id}>
                    <Link
                      to={`/catalog?brand=${encodeURIComponent(b.name)}`}
                      className="block rounded-lg border border-slate-100 px-2 py-2 text-sm hover:border-primary dark:border-slate-800"
                      onClick={onClose}
                    >
                      {b.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <Link to="/catalog" className="block font-semibold" onClick={onClose}>
                Все товары
              </Link>
              <Link to="/brands" className="block" onClick={onClose}>
                Бренды авто
              </Link>
              <Link to="/about" className="block" onClick={onClose}>
                О компании
              </Link>
              <Link to="/contact" className="block" onClick={onClose}>
                Контакты
              </Link>
            </div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
