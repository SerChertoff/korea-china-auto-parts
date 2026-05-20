import { formatPrice } from '../../utils/formatters'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useCart } from '../../hooks/useCart'

type Props = {
  /** Примерная доставка (демо) */
  deliveryEstimate?: number
}

/** Итоги корзины: промокод, доставка, сумма */
export function CartSummary({ deliveryEstimate = 490 }: Props) {
  const { subtotal, total, promoCode, setPromoCode } = useCart()
  const discount = subtotal - total

  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Итого</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600 dark:text-slate-300">Товары</dt>
          <dd className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
            {formatPrice(subtotal)}
          </dd>
        </div>
        {discount > 0 ? (
          <div className="flex justify-between gap-4 text-emerald-700 dark:text-emerald-300">
            <dt>Скидка по промокоду</dt>
            <dd className="font-mono font-semibold tabular-nums">−{formatPrice(discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600 dark:text-slate-300">Доставка (ориентир)</dt>
          <dd className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
            от {formatPrice(deliveryEstimate)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-base dark:border-slate-800">
          <dt className="font-semibold text-slate-900 dark:text-white">К оплате</dt>
          <dd className="font-mono text-lg font-extrabold tabular-nums text-primary">{formatPrice(total)}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Input
          label="Промокод"
          placeholder="PARTS5"
          value={promoCode ?? ''}
          onChange={(e) => setPromoCode(e.target.value.trim() || null)}
        />
        <Button type="button" variant="secondary" onClick={() => setPromoCode('PARTS5')}>
          Применить демо
        </Button>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Промокод <span className="font-mono">PARTS5</span> даёт −5% для демонстрации.
      </p>
    </div>
  )
}
