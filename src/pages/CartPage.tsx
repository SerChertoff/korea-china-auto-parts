import { Link } from 'react-router-dom'
import { SeoHead } from '../components/common/SeoHead'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { CartItemRow } from '../components/cart/CartItem'
import { CartSummary } from '../components/cart/CartSummary'
import { Button } from '../components/ui/Button'
import { useCart } from '../hooks/useCart'

/** Полная страница корзины */
export default function CartPage() {
  const { items, setQuantity, removeItem, clear } = useCart()

  return (
    <>
      <SeoHead title="Корзина — KR‑CN Parts" description="Проверьте состав заказа перед оформлением." noindex />
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Корзина' }]} />
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Корзина
      </h1>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-300">Корзина пуста.</p>
          <Link className="mt-4 inline-block" to="/catalog">
            <Button type="button" variant="primary">
              Перейти в каталог
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className="space-y-3 lg:col-span-8" aria-label="Состав заказа">
            <div className="flex justify-end">
              <Button type="button" variant="ghost" onClick={() => clear()}>
                Очистить корзину
              </Button>
            </div>
            {items.map((line) => (
              <CartItemRow key={line.product.id} line={line} onQty={setQuantity} onRemove={removeItem} />
            ))}
          </section>
          <aside className="lg:col-span-4" aria-label="Итого">
            <CartSummary />
            <Link className="mt-4 block" to="/checkout">
              <Button type="button" variant="accent" className="w-full">
                Перейти к оформлению
              </Button>
            </Link>
          </aside>
        </div>
      )}
    </>
  )
}
