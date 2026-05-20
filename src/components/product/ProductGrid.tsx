import type { Product } from '../../types'
import { ProductCard } from './ProductCard'

type Props = {
  products: Product[]
  view: 'grid' | 'list'
}

/** Сетка или список карточек товаров */
export function ProductGrid({ products, view }: Props) {
  const list = view === 'list'
  return (
    <div
      className={
        list
          ? 'flex flex-col gap-3'
          : 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
      }
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} layout={list ? 'list' : 'grid'} />
      ))}
    </div>
  )
}
