import { Link } from 'react-router-dom'
import { Instagram, Mail, MapPin, Phone, Send } from 'lucide-react'
import { SITE_EMAIL, SITE_PHONE, SOCIAL_LINKS } from '../../utils/constants'

/** Подвал сайта: контакты, навигация, юридическая информация */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div className="space-y-3">
          <div className="font-display text-lg font-extrabold text-slate-900 dark:text-white">KR‑CN Parts</div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Специализированный магазин автозапчастей для корейских и китайских автомобилей. Оригинал и проверенные
            аналоги.
          </p>
        </div>
        <div className="space-y-3">
          <div className="font-display font-bold text-slate-900 dark:text-white">Покупателям</div>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <Link className="hover:text-primary" to="/catalog">
                Каталог
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/brands">
                Бренды авто
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/cart">
                Корзина
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/account">
                Личный кабинет
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <div className="font-display font-bold text-slate-900 dark:text-white">Компания</div>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <Link className="hover:text-primary" to="/about">
                О нас
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/contact">
                Контакты
              </Link>
            </li>
            <li>
              <span className="text-slate-400">Доставка и оплата (скоро)</span>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <div className="font-display font-bold text-slate-900 dark:text-white">Контакты</div>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <a className="hover:text-primary" href={`tel:${SITE_PHONE.replace(/\D/g, '')}`}>
                {SITE_PHONE}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <a className="hover:text-primary" href={`mailto:${SITE_EMAIL}`}>
                {SITE_EMAIL}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>Россия · доставка по РФ</span>
            </li>
          </ul>
          <div className="flex gap-2 pt-2">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                aria-label={s.ariaLabel}
              >
                {s.name === 'Telegram' ? <Send className="h-4 w-4" /> : <span className="text-xs font-bold">VK</span>}
              </a>
            ))}
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900">
              <Instagram className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © {new Date().getFullYear()} KR‑CN Parts. Демонстрационный прототип интернет‑магазина.
      </div>
    </footer>
  )
}
