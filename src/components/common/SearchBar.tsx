import { Search } from 'lucide-react'
import { Input } from '../ui/Input'

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  /** Подпись для доступности */
  ariaLabel?: string
}

/** Строка поиска с иконкой */
export function SearchBar({ value, onChange, placeholder = 'Поиск по названию, артикулу, OEM…', ariaLabel }: Props) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <Input
        aria-label={ariaLabel ?? 'Поиск по каталогу'}
        className="pl-10"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
