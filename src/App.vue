<template>
  <div
    class="p-6 flex flex-col items-center min-h-screen w-screen"
    :class="['bg-gray-100', { 'dark:bg-gray-900': isDarkMode }]"
  >
    <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">Last refreshed: {{ lastRefreshDate }}</div>
    <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200 text-center">Troc - Currency Converter</h1>
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
import axios from 'axios'
import CurrencyInput from './components/CurrencyInput.vue'
import { computed, onMounted, ref } from 'vue'

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

  // Initialize amounts with all currencies from rates
  for (const currency in rates.value) {
    amounts.value[currency] = amounts.value[currency] ?? 0
  }
})

const handleAmountChange = (currency: string, value: number): void => {
  if (!rates.value[currency]) return
  const baseAmount = value / rates.value[currency] // Convert to EUR (base)
  for (const curr in amounts.value) {
    amounts.value[curr] = Number((baseAmount * rates.value[curr]).toFixed(2))
  }
}
</script>