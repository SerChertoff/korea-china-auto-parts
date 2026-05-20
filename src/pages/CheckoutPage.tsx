import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SeoHead } from '../components/common/SeoHead'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { useCart } from '../hooks/useCart'
import {
  checkoutContactSchema,
  checkoutDeliverySchema,
  checkoutPaymentSchema,
  type CheckoutContact,
  type CheckoutDelivery,
  type CheckoutPayment,
} from '../utils/checkoutSchemas'
import { submitOrder } from '../services/orderService'
import { createPaymentSessionDemo, fetchShippingQuote, type PaymentSessionDemo, type ShippingQuote } from '../services/checkoutIntegrations'
import { formatPrice } from '../utils/formatters'
import { formatRuPhoneInput, ruPhoneToE164 } from '../utils/phoneRu'

type Step = 0 | 1 | 2 | 3

/** Оформление заказа: многошаговая форма с Zod */
export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, total, clear } = useCart()
  const [step, setStep] = useState<Step>(0)
  const [doneId, setDoneId] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<{ lines: typeof items; subtotal: number; total: number } | null>(null)
  const [quote, setQuote] = useState<ShippingQuote | null>(null)
  const [quoteErr, setQuoteErr] = useState<string | null>(null)
  const [payInfo, setPayInfo] = useState<PaymentSessionDemo | null>(null)

  const contactForm = useForm<CheckoutContact>({
    resolver: zodResolver(checkoutContactSchema),
    defaultValues: { name: '', phone: '', email: '' },
  })
  const deliveryForm = useForm<CheckoutDelivery>({
    resolver: zodResolver(checkoutDeliverySchema),
    defaultValues: { method: 'cdek', address: '', comment: '', npPickup: '' },
  })
  const paymentForm = useForm<CheckoutPayment>({
    resolver: zodResolver(checkoutPaymentSchema),
    defaultValues: { method: 'card' },
  })

  const paymentMethod = useWatch({ control: paymentForm.control, name: 'method' })
  const deliveryMethod = useWatch({ control: deliveryForm.control, name: 'method' })

  useEffect(() => {
    if (deliveryMethod !== 'pickup') return
    const a = deliveryForm.getValues('address').trim()
    if (a.length < 5) {
      deliveryForm.setValue('address', 'Самовывоз — склад KR-CN Parts (демо)', { shouldValidate: true })
    }
  }, [deliveryMethod, deliveryForm])

  useEffect(() => {
    if (step !== 2) {
      setPayInfo(null)
      return
    }
    let cancelled = false
    void createPaymentSessionDemo({ amountRub: total, method: paymentMethod })
      .then((r) => {
        if (!cancelled) setPayInfo(r)
      })
      .catch(() => {
        if (!cancelled) setPayInfo(null)
      })
    return () => {
      cancelled = true
    }
  }, [step, total, paymentMethod])

  const steps = useMemo(
    () => ['Контакты', 'Доставка', 'Оплата', 'Подтверждение'] as const,
    [],
  )

  async function loadShippingQuote() {
    setQuoteErr(null)
    const ok = await deliveryForm.trigger()
    if (!ok) return
    try {
      const d = deliveryForm.getValues()
      const q = await fetchShippingQuote({
        method: d.method,
        address: d.address,
        npPickup: d.npPickup,
      })
      setQuote(q)
    } catch {
      setQuote(null)
      setQuoteErr('Не удалось получить расчёт. Запустите API (npm run dev:server).')
    }
  }

  async function finalize() {
    const contactRaw = contactForm.getValues()
    const contact = { ...contactRaw, phone: ruPhoneToE164(contactRaw.phone) }
    const delivery = deliveryForm.getValues()
    const payment = paymentForm.getValues()
    setReceipt({ lines: items, subtotal, total })
    const res = await submitOrder({
      contact,
      delivery,
      payment,
      items,
      total,
    })
    setDoneId(res.orderId)
    clear()
  }

  if (items.length === 0 && step < 3) {
    return (
      <>
        <SeoHead title="Оформление заказа" />
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="font-display text-2xl font-bold">Корзина пуста</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Добавьте товары, чтобы оформить заказ.</p>
          <Link className="mt-4 inline-block text-primary hover:underline" to="/catalog">
            В каталог
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <SeoHead title="Оформление заказа — KR‑CN Parts" />
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Оформление' }]} />
      <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-900 dark:text-white">Оформление заказа</h1>

      <ol className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
        {steps.map((s, i) => (
          <li
            key={s}
            className={
              'rounded-full px-3 py-1 ' +
              (i === step ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200')
            }
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {step === 0 ? (
            <Card className="p-5">
              <h2 className="font-display text-xl font-bold">Контактные данные</h2>
              <form
                className="mt-4 grid gap-3"
                onSubmit={contactForm.handleSubmit(() => setStep(1))}
              >
                <Input label="ФИО" {...contactForm.register('name')} error={contactForm.formState.errors.name?.message} />
                <Controller
                  name="phone"
                  control={contactForm.control}
                  render={({ field }) => (
                    <Input
                      label="Телефон"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={field.value}
                      onChange={(e) => field.onChange(formatRuPhoneInput(e.target.value))}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      error={contactForm.formState.errors.phone?.message}
                    />
                  )}
                />
                <Input label="Email" type="email" {...contactForm.register('email')} error={contactForm.formState.errors.email?.message} />
                <Button type="submit" variant="primary">
                  Далее
                </Button>
              </form>
            </Card>
          ) : null}

          {step === 1 ? (
            <Card className="p-5">
              <h2 className="font-display text-xl font-bold">Доставка</h2>
              <form className="mt-4 grid gap-3" onSubmit={deliveryForm.handleSubmit(() => setStep(2))}>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Способ</span>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                    {...deliveryForm.register('method')}
                  >
                    <option value="pickup">Самовывоз</option>
                    <option value="courier">Курьер</option>
                    <option value="cdek">СДЭК</option>
                    <option value="post">Почта России</option>
                  </select>
                </div>
                <Input label="Адрес / ПВЗ" {...deliveryForm.register('address')} error={deliveryForm.formState.errors.address?.message} />
                {deliveryMethod === 'cdek' ? (
                  <Input
                    label="Код ПВЗ СДЭК (демо)"
                    placeholder="MSK123"
                    {...deliveryForm.register('npPickup')}
                    error={deliveryForm.formState.errors.npPickup?.message}
                  />
                ) : null}
                <Input label="Комментарий" {...deliveryForm.register('comment')} />
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">Расчёт доставки (демо API)</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    Запрос к <span className="font-mono">GET /api/shipping/quote</span> — замените на интеграцию с перевозчиком.
                  </p>
                  <Button type="button" variant="outline" className="mt-3" onClick={() => void loadShippingQuote()}>
                    Рассчитать доставку
                  </Button>
                  {quoteErr ? <p className="mt-2 text-xs text-red-600">{quoteErr}</p> : null}
                  {quote ? (
                    <div className="mt-3 space-y-1 text-slate-700 dark:text-slate-200">
                      <div>
                        <span className="text-slate-500">Провайдер:</span> {quote.provider}
                      </div>
                      <div>
                        <span className="text-slate-500">Стоимость:</span>{' '}
                        <span className="font-mono font-bold">{formatPrice(quote.priceRub)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Срок:</span> {quote.daysMin}–{quote.daysMax} дн.
                      </div>
                      <p className="text-xs text-slate-500">{quote.message}</p>
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={() => setStep(0)}>
                    Назад
                  </Button>
                  <Button type="submit" variant="primary">
                    Далее
                  </Button>
                </div>
              </form>
            </Card>
          ) : null}

          {step === 2 ? (
            <Card className="p-5">
              <h2 className="font-display text-xl font-bold">Оплата</h2>
              <form className="mt-4 grid gap-3" onSubmit={paymentForm.handleSubmit(() => setStep(3))}>
                <div className="rounded-xl border border-amber-100 bg-amber-50/80 p-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
                  <p className="font-semibold">Интеграция оплаты (заглушка)</p>
                  <p className="mt-1 text-xs opacity-90">
                    Запрос <span className="font-mono">POST /api/payment/session</span> — в бою здесь будет редирект на
                    платёжный шлюз.
                  </p>
                  {payInfo ? <p className="mt-2 text-xs leading-relaxed">{payInfo.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Способ оплаты</span>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                    {...paymentForm.register('method')}
                  >
                    <option value="card">Банковская карта</option>
                    <option value="cash">Наличные при получении</option>
                    <option value="sbp">СБП</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Назад
                  </Button>
                  <Button type="submit" variant="primary">
                    Далее
                  </Button>
                </div>
              </form>
            </Card>
          ) : null}

          {step === 3 ? (
            <Card className="p-5">
              <h2 className="font-display text-xl font-bold">Подтверждение</h2>
              {doneId ? (
                <p className="mt-3 text-slate-700 dark:text-slate-200">
                  Заказ создан: <span className="font-mono font-bold">{doneId}</span>. Спасибо! (демо)
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Проверьте данные и нажмите «Оплатить и завершить». Сумма:{' '}
                    <span className="font-mono font-bold">{formatPrice(total)}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Назад
                    </Button>
                    <Button type="button" variant="accent" onClick={() => void finalize()}>
                      Оплатить и завершить
                    </Button>
                  </div>
                </div>
              )}
              {doneId ? (
                <Button type="button" className="mt-4" variant="primary" onClick={() => navigate('/')}>
                  На главную
                </Button>
              ) : null}
            </Card>
          ) : null}
        </div>

        <aside className="lg:col-span-5">
          <Card className="p-5">
            <h3 className="font-display text-lg font-bold">Состав</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {(receipt?.lines ?? items).map((l) => (
                <li key={l.product.id} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate">{l.product.name}</span>
                  <span className="shrink-0 font-mono">×{l.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
              <div className="flex justify-between">
                <span>Товары</span>
                <span className="font-mono font-bold">{formatPrice(receipt?.subtotal ?? subtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Итого с промокодом</span>
                <span className="font-mono font-bold text-primary">{formatPrice(receipt?.total ?? total)}</span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </>
  )
}
