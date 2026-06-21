<template>
  <div
    class="relative flex min-h-screen w-full flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100 px-6 pb-10 pt-6 dark:from-gray-900 dark:to-gray-950"
  >
    <!-- Top controls -->
    <div class="absolute right-6 top-6 flex items-center gap-3">
      <div
        class="flex overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700"
        role="group"
        :aria-label="$t('language')"
      >
        <button
          v-for="loc in supportedLocales"
          :key="loc.code"
          type="button"
          class="px-2.5 py-1 text-sm font-semibold transition-colors"
          :class="
            locale === loc.code
              ? 'bg-golden-400 text-white dark:bg-golden-600'
              : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          "
          :aria-pressed="locale === loc.code"
          @click="changeLocale(loc.code)"
        >
          {{ loc.label }}
        </button>
      </div>
      <button
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-xl shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-golden-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        :aria-label="$t('selectCurrencies')"
        @click="showSettings = true"
      >
        ⚙️
      </button>
    </div>

    <!-- Header -->
    <img
      src="/troc-512.png"
      alt="Troc Logo"
      class="mb-4 mt-2 h-16 w-16 object-contain drop-shadow-sm"
    />
    <h1
      class="mb-1 bg-gradient-to-r from-golden-500 to-golden-400 bg-clip-text text-3xl font-extrabold text-transparent"
    >
      {{ $t('title') }}
    </h1>
    <p class="mb-8 text-sm text-gray-500 dark:text-gray-400">
      {{ $t('lastRefreshed') }}{{ lastRefreshDate }}
    </p>

    <!-- Settings modal -->
    <transition name="fade">
      <div
        v-if="showSettings"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="showSettings = false"
      >
        <SettingsMenu
          :selectedCurrencies="selectedCurrencies"
          @close="showSettings = false"
          @update-currencies="updateCurrencies"
        />
      </div>
    </transition>

    <!-- Currency list -->
    <ul class="mx-auto w-full max-w-md flex-grow space-y-4 overflow-y-auto">
      <li v-for="currency in selectedCurrencies" :key="currency">
        <CurrencyInput
          :currency="currency"
          :amount="amounts[currency]"
          @update:amount="handleAmountChange(currency, $event)"
        />
      </li>
    </ul>

    <div v-if="error" class="mt-6 text-center text-lg text-red-500 dark:text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import CurrencyInput from './components/CurrencyInput.vue'
import SettingsMenu from './components/SettingsMenu.vue'
import { supportedLocales } from './i18n'
import { STORAGE_KEYS, readJSON, writeJSON } from './storage'
import { roundToCurrency } from './currency'

type Rates = Record<string, number>
type Amounts = Record<string, number>

interface CachedRates {
  rates: Rates
  timestamp: number
}

// ECB publishes rates roughly once per business day. Refetch when the cache is
// older than this; always fall back to cache on a failed fetch (offline-safe).
const MAX_CACHE_AGE_MS = 12 * 60 * 60 * 1000
const API_URL = 'https://api.frankfurter.app/latest'
const DEFAULT_CURRENCIES = ['EUR', 'USD', 'KRW']

const rates = ref<Rates>({})
const amounts = ref<Amounts>({})
const error = ref<string | null>(null)
const lastFetchTimestamp = ref<number | null>(null)
const showSettings = ref(false)
const selectedCurrencies = ref<string[]>([])

const { t, locale } = useI18n()

const changeLocale = (code: string) => {
  locale.value = code
  localStorage.setItem(STORAGE_KEYS.locale, code)
}

const lastRefreshDate = computed((): string => {
  if (!lastFetchTimestamp.value) return t('never')
  return new Date(lastFetchTimestamp.value).toLocaleString(locale.value, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

// Theme follows the OS preference; the `.dark` class on <html> drives styling.
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const updateTheme = () => {
  const dark = mediaQuery.matches
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

// EUR is the conversion base, so guarantee it's always present at 1.
const normalizeRates = (input: Rates): Rates => ({ ...input, EUR: 1 })

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showSettings.value) showSettings.value = false
}

onMounted(async () => {
  updateTheme()
  mediaQuery.addEventListener('change', updateTheme)
  window.addEventListener('keydown', onKeydown)

  const cached = readJSON<CachedRates | null>(STORAGE_KEYS.rates, null)
  const isFresh = cached && Date.now() - cached.timestamp < MAX_CACHE_AGE_MS

  if (cached && isFresh) {
    rates.value = normalizeRates(cached.rates)
    lastFetchTimestamp.value = cached.timestamp
  } else {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      rates.value = normalizeRates(data.rates)
      lastFetchTimestamp.value = Date.now()
      writeJSON(STORAGE_KEYS.rates, { rates: rates.value, timestamp: lastFetchTimestamp.value })
    } catch {
      if (!cached) {
        error.value = t('errorNoCache')
      } else {
        rates.value = normalizeRates(cached.rates)
        lastFetchTimestamp.value = cached.timestamp
        error.value = t('errorCachedFallback')
      }
    }
  }

  selectedCurrencies.value = readJSON<string[]>(STORAGE_KEYS.currencies, DEFAULT_CURRENCIES)
  updateAmounts()
})

onUnmounted(() => {
  mediaQuery.removeEventListener('change', updateTheme)
  window.removeEventListener('keydown', onKeydown)
})

const updateCurrencies = (currencies: string[]) => {
  selectedCurrencies.value = currencies
  writeJSON(STORAGE_KEYS.currencies, currencies)
  updateAmounts()
}

const updateAmounts = () => {
  const newAmounts: Amounts = {}
  for (const currency of selectedCurrencies.value) {
    newAmounts[currency] = amounts.value[currency] ?? 0
  }
  amounts.value = newAmounts
}

const handleAmountChange = (currency: string, value: number): void => {
  const sourceRate = rates.value[currency]
  if (!sourceRate) return
  const baseAmount = value / sourceRate // value expressed in EUR (the base)
  for (const curr of selectedCurrencies.value) {
    const rate = rates.value[curr]
    if (!rate) continue
    amounts.value[curr] = roundToCurrency(baseAmount * rate, curr)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
