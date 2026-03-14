<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col" style="max-height: 90vh;">
    <div class="flex items-center justify-between p-5 pb-3">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ $t('selectCurrencies') }}</h2>
      <button
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-2xl leading-none p-1"
        @click="$emit('close')"
      >×</button>
    </div>
    <div class="overflow-y-auto flex-1 px-5 pb-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <button
          v-for="currency in selectedCurrencies"
          :key="currency"
          class="flex items-center gap-3 p-3 rounded-lg border-2 transition-all border-golden-400 dark:border-golden-500 bg-golden-50 dark:bg-golden-900/30 hover:shadow-sm active:scale-[0.98]"
          @click="toggleCurrency(currency)"
        >
          <span class="text-xl">{{ currencyToFlag[currency] }}</span>
          <div class="flex flex-col items-start min-w-0">
            <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ currency }}</span>
            <span class="text-xs text-gray-400 dark:text-gray-500 truncate max-w-full">{{ $t(`currencyNames.${currency}`) }}</span>
          </div>
          <span class="ml-auto text-golden-500 dark:text-golden-400 text-sm">✓</span>
        </button>
      </div>
      <div
        v-if="unselectedCurrencies.length > 0 && selectedCurrencies.length > 0"
        class="border-t border-gray-200 dark:border-gray-700 my-3"
      />
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <button
          v-for="currency in unselectedCurrencies"
          :key="currency"
          class="flex items-center gap-3 p-3 rounded-lg border-2 transition-all border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm active:scale-[0.98]"
          @click="toggleCurrency(currency)"
        >
          <span class="text-xl">{{ currencyToFlag[currency] }}</span>
          <div class="flex flex-col items-start min-w-0">
            <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ currency }}</span>
            <span class="text-xs text-gray-400 dark:text-gray-500 truncate max-w-full">{{ $t(`currencyNames.${currency}`) }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { currencyToFlag } from '../currencyFlags'

const props = defineProps<{
  selectedCurrencies: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update-currencies', currencies: string[]): void
}>()

const allCurrencies = Object.keys(currencyToFlag)

const unselectedCurrencies = computed(() => {
  return allCurrencies
    .filter(c => !props.selectedCurrencies.includes(c))
    .sort()
})

const toggleCurrency = (currency: string) => {
  const updatedCurrencies = [...props.selectedCurrencies]
  const index = updatedCurrencies.indexOf(currency)
  if (index > -1) {
    if (updatedCurrencies.length <= 1) return
    updatedCurrencies.splice(index, 1)
  } else {
    updatedCurrencies.push(currency)
  }
  emit('update-currencies', updatedCurrencies)
}
</script>
