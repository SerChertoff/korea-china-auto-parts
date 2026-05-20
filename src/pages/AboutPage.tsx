import { SeoHead } from '../components/common/SeoHead'
import { Card } from '../components/ui/Card'

/** О компании */
export default function AboutPage() {
  return (
    <>
      <SeoHead title="О нас — KR‑CN Parts" />
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">О компании</h1>
      <Card className="mt-6 p-6 leading-relaxed text-slate-700 dark:text-slate-200">
        <p>
          KR‑CN Parts — демонстрационный интернет‑магазин автозапчастей для корейских и китайских автомобилей. Мы
          сфокусированы на прозрачном подборе, понятных сроках поставки и сочетании оригинальных деталей с проверенными
          аналогами.
        </p>
        <p className="mt-4" id="delivery">
          <span className="font-semibold text-slate-900 dark:text-white">Доставка и оплата (демо).</span>{' '}
          Расчёт стоимости доступен на этапе оформления заказа: курьер, ПВЗ, СДЭК, Почта России.
        </p>
      </Card>
    </>
  )
}
