<template>
  <div
    class="p-6 flex flex-col items-center min-h-screen w-screen"
    :class="['bg-gray-100', { 'dark:bg-gray-900': isDarkMode }]"
  >
    <div class="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">Last refreshed: {{ lastRefreshDate }}</div>
    <h1 class="text-3xl font-extrabold mb-8 text-gray-900 dark:text-gray-100 text-center">Troc - Currency Converter</h1>
    <span
      class="absolute top-6 right-6 text-2xl cursor-pointer text-gray-600 dark:text-gray-300"
      @click="showSettings = !showSettings"
      >⚙️</span>
    <transition name="fade">
      <div
        v-if="showSettings"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <SettingsMenu
          v-if="showSettings"
          :selectedCurrencies="selectedCurrencies"
          @close="showSettings = false"
          @update-currencies="updateCurrencies"
        />
      </div>
    </transition>
    <ul class="mx-auto w-full max-w-md space-y-6 flex-grow overflow-y-auto">
      <li v-for="currency in Object.keys(amounts)" :key="currency">
        <CurrencyInput
          :currency="currency"
          :amount="amounts[currency]"
          @update:amount="handleAmountChange(currency, $event)"
        />
      </li>
    </ul>
    <div v-if="error" class="text-red-500 dark:text-red-400 mt-6 text-center text-lg">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import CurrencyInput from './components/CurrencyInput.vue'
import SettingsMenu from './components/SettingsMenu.vue'

interface Rates {
  [key: string]: number
}

interface Amounts {
  [key: string]: number
}

const rates = ref<Rates>({})
const amounts = ref<Amounts>({})
const error = ref<string | null>(null)
const lastFetchTimestamp = ref<number | null>(null)
const isDarkMode = ref(false)
const showSettings = ref(false)
const selectedCurrencies = ref<string[]>([])

const lastRefreshDate = computed((): string => {
  if (!lastFetchTimestamp.value) return 'Never'
  return new Date(lastFetchTimestamp.value).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
})

const updateTheme = () => {
  isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle('dark', isDarkMode.value) // Ensure dark mode is applied globally
  document.documentElement.style.colorScheme = isDarkMode.value ? 'dark' : 'light' // Enhance OS-level theme support
}

onMounted(async () => {
  updateTheme()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme)

  const cached = localStorage.getItem('troc-rates')
  const today = new Date().toLocaleDateString()
  let cachedData = cached ? (JSON.parse(cached) as { rates: Rates; timestamp: number }) : null

  if (cachedData && new Date(cachedData.timestamp).toLocaleDateString() === today) {
    rates.value = cachedData.rates
    lastFetchTimestamp.value = cachedData.timestamp
  } else {
    try {
      const response = await axios.get('https://api.frankfurter.app/latest')
      rates.value = { ...response.data.rates, EUR: 1 } // Include EUR as base
      lastFetchTimestamp.value = Date.now()
      localStorage.setItem(
        'troc-rates',
        JSON.stringify({ rates: rates.value, timestamp: lastFetchTimestamp.value })
      )
    } catch (err) {
      if (!cachedData) {
        error.value = 'Failed to fetch rates and no cache available.'
      } else {
        rates.value = cachedData.rates
        lastFetchTimestamp.value = cachedData.timestamp
        error.value = 'Using cached rates due to fetch failure.'
      }
    }
  }

  // Load or set default selected currencies
  const savedCurrencies = localStorage.getItem('selectedCurrencies')
  selectedCurrencies.value = savedCurrencies ? JSON.parse(savedCurrencies) : ['EUR', 'USD', 'KRW']
  updateAmounts()
})

const updateCurrencies = (currencies: string[]) => {
  selectedCurrencies.value = currencies
  localStorage.setItem('selectedCurrencies', JSON.stringify(currencies))
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
  if (!rates.value[currency]) return
  const baseAmount = value / rates.value[currency] // Convert to EUR (base)
  for (const curr of selectedCurrencies.value) {
    amounts.value[curr] = Number((baseAmount * rates.value[curr]).toFixed(2))
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