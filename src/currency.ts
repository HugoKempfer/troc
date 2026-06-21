// How many decimal places a currency conventionally uses (e.g. JPY/KRW use 0).
// Derived from the runtime's Intl data so we don't hand-maintain a table.
const fractionDigitsCache: Record<string, number> = {}

export function currencyFractionDigits(currency: string): number {
  const cached = fractionDigitsCache[currency]
  if (cached !== undefined) return cached
  let digits = 2
  try {
    digits =
      new Intl.NumberFormat('en', {
        style: 'currency',
        currency,
      }).resolvedOptions().maximumFractionDigits ?? 2
  } catch {
    // Unknown currency code — fall back to 2.
  }
  fractionDigitsCache[currency] = digits
  return digits
}

// Round a value to the precision the currency actually supports, so we don't
// invent cents for zero-decimal currencies or accumulate rounding error.
export function roundToCurrency(value: number, currency: string): number {
  const digits = currencyFractionDigits(currency)
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export function formatAmount(amount: number, currency: string, locale: string): string {
  if (!amount) return ''
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: currencyFractionDigits(currency),
    useGrouping: true,
  }).format(amount)
}
