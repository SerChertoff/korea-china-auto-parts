import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '../ui/Button'
import { useCart } from '../../hooks/useCart'
import { CartItemRow } from './CartItem'

type Props = {
  open: boolean
  onClose: () => void
}

/** Боковая панель быстрого просмотра корзины */
export function CartDrawer({ open, onClose }: Props) {
  const { items, setQuantity, removeItem, subtotal, total, count } = useCart()

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Закрыть корзину"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-950"
            aria-label="Корзина"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
              <div>
                <div className="font-display text-lg font-bold text-slate-900 dark:text-white">Корзина</div>
                <div className="text-sm text-slate-500">Позиций: {count}</div>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
                onClick={onClose}
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {items.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-300">Корзина пуста. Добавьте запчасти из каталога.</p>
              ) : (
                items.map((line) => (
                  <CartItemRow
                    key={line.product.id}
                    line={line}
                    onQty={setQuantity}
                    onRemove={removeItem}
                  />
                ))
              )}
            </div>
            <div className="space-y-3 border-t border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Промежуточно</span>
                <span className="font-mono font-bold tabular-nums">{subtotal.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">С учётом промокода</span>
                <span className="font-mono font-bold tabular-nums text-primary">
                  {total.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/cart" onClick={onClose}>
                  <Button type="button" variant="outline" className="w-full">
                    В корзину
                  </Button>
                </Link>
                <Link to="/checkout" onClick={onClose}>
                  <Button type="button" variant="primary" className="w-full" disabled={items.length === 0}>
                    Оформить
                  </Button>
                </Link>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
