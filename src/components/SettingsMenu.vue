<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md" style="max-height: 90vh; overflow-y: auto;">
    <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Select Currencies</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      <button
        v-for="currency in Object.keys(currencyToFlag)"
        :key="currency"
        class="flex flex-col items-center p-2 border-2 rounded"
        :class="[
          selectedCurrencies.includes(currency)
            ? 'border-lavender-400 bg-lavender-100 dark:bg-lavender-900 text-gray-900 dark:text-gray-900'
            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300',
          'hover:border-lavender-300 dark:hover:border-lavender-400'
        ]"
        @click="toggleCurrency(currency)"
      >
        <span class="text-xl mb-1">{{ currencyToFlag[currency] }}</span>
        <span class="text-sm">{{ currency }}</span>
      </button>
    </div>
    <button
      class="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      @click="$emit('close')"
    >
      Close
    </button>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  selectedCurrencies: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update-currencies', currencies: string[]): void
}>()

const currencyToFlag: { [key: string]: string } = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  BGN: '🇧🇬',
  CZK: '🇨🇿',
  DKK: '🇩🇰',
  HUF: '🇭🇺',
  PLN: '🇵🇱',
  RON: '🇷🇴',
  SEK: '🇸🇪',
  CHF: '🇨🇭',
  NOK: '🇳🇴',
  HRK: '🇭🇷',
  RUB: '🇷🇺',
  TRY: '🇹🇷',
  AUD: '🇦🇺',
  BRL: '🇧🇷',
  CAD: '🇨🇦',
  CNY: '🇨🇳',
  HKD: '🇭🇰',
  IDR: '🇮🇩',
  ILS: '🇮🇱',
  INR: '🇮🇳',
  KRW: '🇰🇷',
  MXN: '🇲🇽',
  MYR: '🇲🇾',
  NZD: '🇳🇿',
  PHP: '🇵🇭',
  SGD: '🇸🇬',
  THB: '🇹🇭',
  ZAR: '🇿🇦'
}

const toggleCurrency = (currency: string) => {
  const updatedCurrencies = [...props.selectedCurrencies]
  const index = updatedCurrencies.indexOf(currency)
  if (index > -1) {
    updatedCurrencies.splice(index, 1)
  } else {
    updatedCurrencies.push(currency)
  }
  emit('update-currencies', updatedCurrencies)
}
</script>

<style scoped>
.bg-lavender-100 {
  background-color: #f0f0ff;
}
.bg-lavender-900 {
  background-color: #4b0082;
}
</style>