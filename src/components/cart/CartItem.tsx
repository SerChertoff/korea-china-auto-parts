import type { CartItem as CartLine } from '../../types'
import { formatPrice } from '../../utils/formatters'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

type Props = {
  line: CartLine
  onQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
}

/** Строка корзины с количеством */
export function CartItemRow({ line, onQty, onRemove }: Props) {
  const { product, quantity } = line
  return (
    <div className="flex gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
      <img
        src={product.images[0]}
        alt=""
        className="h-16 w-16 rounded-lg object-cover"
        loading="lazy"
      />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="font-medium text-slate-900 dark:text-white">{product.name}</div>
        <div className="font-mono text-sm text-slate-500">Арт. {product.article}</div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            aria-label="Количество"
            className="w-24 py-2"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => onQty(product.id, Number(e.target.value))}
          />
          <Button type="button" variant="ghost" onClick={() => onRemove(product.id)}>
            Удалить
          </Button>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
          {formatPrice(product.price * quantity)}
        </div>
        <div className="font-mono text-xs text-slate-500">{formatPrice(product.price)} × {quantity}</div>
      </div>
    </div>
  )
}
