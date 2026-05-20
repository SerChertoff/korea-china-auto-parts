import { Link } from 'react-router-dom'
import { SeoHead } from '../components/common/SeoHead'
import { VEHICLE_BRANDS } from '../data/brands'

/** Список брендов с переходом в каталог */
export default function BrandPage() {
  return (
    <>
      <SeoHead title="Бренды автомобилей — KR‑CN Parts" />
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Бренды</h1>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {VEHICLE_BRANDS.map((b) => (
          <Link
            key={b.id}
            to={`/catalog?brand=${encodeURIComponent(b.name)}`}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-primary dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent font-black text-white">
                {b.logoPlaceholder}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{b.name}</div>
                <div className="text-xs text-slate-500">{b.country === 'KR' ? 'Корея' : 'Китай'}</div>
              </div>
            </div>
            <span className="text-sm font-semibold text-primary">В каталог →</span>
          </Link>
        ))}
      </div>
    </>
  )
}
