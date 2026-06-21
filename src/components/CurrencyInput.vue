<template>
  <div
    class="flex items-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-golden-300 focus-within:border-golden-400 focus-within:ring-2 focus-within:ring-golden-400/20 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-golden-500 dark:focus-within:border-golden-500"
  >
    <span class="mr-3 text-xl" :aria-label="currency + ' flag'">{{
      currencyToFlag[currency]
    }}</span>
    <div class="flex-1">
      <input
        inputmode="decimal"
        :value="formattedAmount"
        @input="handleInput($event)"
        class="w-full appearance-none border-none bg-transparent text-2xl font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 dark:text-gray-200 dark:placeholder-gray-500"
        placeholder="0"
        :aria-label="$t('currencyAmount')"
      />
    </div>
    <div class="text-right">
      <span class="text-2xl font-semibold text-gray-600 dark:text-gray-300">{{ currency }}</span>
      <div v-if="$te(`currencyNames.${currency}`)" class="text-xs text-gray-400 dark:text-gray-500">
        {{ $t(`currencyNames.${currency}`) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { currencyToFlag } from '../currencyFlags'
import { formatAmount } from '../currency'

const { currency, amount } = defineProps<{
  currency: string
  amount: number
}>()

const emit = defineEmits<{
  (e: 'update:amount', value: number): void
}>()

const { locale } = useI18n()

const formattedAmount = computed(() => formatAmount(amount, currency, locale.value))

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target) return
  // Strip everything but digits and decimal points, then keep only the first point.
  let cleaned = target.value.replace(/[^0-9.]+/g, '')
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('')
  }
  const numericValue = parseFloat(cleaned) || 0
  emit('update:amount', numericValue)
}
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input {
  -moz-appearance: textfield;
  -webkit-appearance: textfield;
  appearance: textfield;
}
</style>
