import { SeoHead } from '../components/common/SeoHead'
import { Card } from '../components/ui/Card'
import { SITE_EMAIL, SITE_PHONE, WORK_HOURS } from '../utils/constants'

/** Контакты */
export default function ContactPage() {
  return (
    <>
      <SeoHead title="Контакты — KR‑CN Parts" />
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Контакты</h1>
      <Card className="mt-6 max-w-2xl space-y-3 p-6 text-slate-700 dark:text-slate-200">
        <div>
          <div className="text-sm font-semibold text-slate-500">Телефон</div>
          <a className="text-lg font-bold text-primary hover:underline" href={`tel:${SITE_PHONE.replace(/\D/g, '')}`}>
            {SITE_PHONE}
          </a>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-500">Email</div>
          <a className="font-semibold hover:underline" href={`mailto:${SITE_EMAIL}`}>
            {SITE_EMAIL}
          </a>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-500">Режим работы</div>
          <div>{WORK_HOURS}</div>
        </div>
      </Card>
    </>
  )
}
