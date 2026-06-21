// Centralized localStorage access so keys aren't scattered as string literals.
export const STORAGE_KEYS = {
  rates: 'troc-rates',
  locale: 'troc-locale',
  currencies: 'troc-currencies',
} as const

export function safeParseJSON<T>(json: string | null, fallback: T): T {
  if (!json) return fallback
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  return safeParseJSON<T>(localStorage.getItem(key), fallback)
}

export function writeJSON(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}
