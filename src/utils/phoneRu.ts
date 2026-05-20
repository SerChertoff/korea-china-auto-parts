/** Маска и нормализация мобильного РФ для формы чекаута (+7 и 10 цифр). */

function digitsAfterSeven(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (d.length === 0) return ''
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (d.startsWith('9')) d = '7' + d
  if (!d.startsWith('7')) {
    if (d.length === 0) return ''
    d = '7' + d.replace(/^7+/, '')
  }
  return d.slice(1, 11)
}

/** Отображаемое значение для поля ввода */
export function formatRuPhoneInput(raw: string): string {
  const rest = digitsAfterSeven(raw)
  if (rest.length === 0 && raw.replace(/\D/g, '').length === 0) return ''
  let out = '+7 '
  if (rest.length >= 1) {
    out += '(' + rest.slice(0, 3)
  }
  if (rest.length >= 3) {
    out += ') ' + rest.slice(3, 6)
  }
  if (rest.length >= 6) {
    out += '-' + rest.slice(6, 8)
  }
  if (rest.length >= 8) {
    out += '-' + rest.slice(8, 10)
  }
  return out.trimEnd()
}

/** Для API и валидации: +7XXXXXXXXXX */
export function ruPhoneToE164(formatted: string): string {
  const rest = digitsAfterSeven(formatted)
  if (rest.length !== 10) return ''
  return '+7' + rest
}

export function isCompleteRuMobile(formatted: string): boolean {
  return ruPhoneToE164(formatted).length === 12
}
