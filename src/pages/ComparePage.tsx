import { Link, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { SeoHead } from '../components/common/SeoHead'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { formatPrice } from '../utils/formatters'
import { useCompareStore } from '../store/compareStore'

/** Таблица сравнения сохранённых в localStorage товаров */
export default function ComparePage() {
  const navigate = useNavigate()
  const products = useCompareStore((s) => s.products)
  const remove = useCompareStore((s) => s.remove)
  const clear = useCompareStore((s) => s.clear)

  const charKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.characteristics))),
  ).sort()

  if (products.length === 0) {
    return (
      <div>
        <SeoHead title="Сравнение товаров — KR‑CN Parts" description="Добавьте товары из каталога для сравнения." />
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Сравнение' }]} />
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Список сравнения пуст</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            На карточке товара нажмите «В сравнение», чтобы добавить до 5 позиций.
          </p>
          <Button type="button" variant="primary" className="mt-6" onClick={() => navigate('/catalog')}>
            В каталог
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SeoHead title="Сравнение товаров — KR‑CN Parts" description="Сравнение характеристик и цен." />
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Сравнение' }]} />
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Сравнение</h1>
        <Button type="button" variant="ghost" className="text-red-600" onClick={() => clear()}>
          <Trash2 className="mr-2 h-4 w-4" />
          Очистить всё
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="sticky left-0 z-10 bg-white px-3 py-3 text-left font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                Параметр
              </th>
              {products.map((p) => (
                <th key={p.id} className="relative min-w-[180px] px-3 py-3 text-left align-top">
                  <button
                    type="button"
                    className="absolute right-1 top-1 rounded-lg px-2 py-0.5 text-lg leading-none text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
                    onClick={() => remove(p.id)}
                    aria-label={`Убрать ${p.name}`}
                  >
                    ×
                  </button>
                  <Link to={`/product/${p.id}`} className="font-semibold text-primary hover:underline">
                    {p.name}
                  </Link>
                  <div className="mt-1 font-mono text-xs text-slate-500">{p.article}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className="sticky left-0 bg-white px-3 py-2 font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                Цена
              </td>
              {products.map((p) => (
                <td key={p.id} className="px-3 py-2 font-mono font-bold tabular-nums">
                  {formatPrice(p.price)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className="sticky left-0 bg-white px-3 py-2 font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                Бренд
              </td>
              {products.map((p) => (
                <td key={p.id} className="px-3 py-2">
                  {p.brand}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className="sticky left-0 bg-white px-3 py-2 font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                Наличие
              </td>
              {products.map((p) => (
                <td key={p.id} className="px-3 py-2">
                  {p.inStock ? `Да (${p.stockCount} шт.)` : 'Под заказ'}
                </td>
              ))}
            </tr>
            {charKeys.map((key) => (
              <tr key={key} className="border-b border-slate-100 dark:border-slate-800">
                <td className="sticky left-0 bg-white px-3 py-2 font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  {key}
                </td>
                {products.map((p) => (
                  <td key={p.id} className="px-3 py-2 font-mono text-slate-800 dark:text-slate-100">
                    {p.characteristics[key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
