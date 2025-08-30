<template>
  <div
    class="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:border-lavender-300 focus-within:border-lavender-400 shadow-sm w-full"
  >
    <span class="text-xl mr-3" :aria-label="currency + ' flag'">{{ currencyToFlag[currency] }}</span>
    <div class="flex-1">
      <input
        inputmode="numeric"
        pattern="[0-9]*"
        :value="formattedAmount"
        @input="handleInput($event)"
        class="w-full text-2xl font-medium text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 appearance-none"
        :placeholder="currency"
        aria-label="Currency amount"
      />
    </div>
    <span class="text-2xl font-semibold text-gray-600 dark:text-gray-300">{{ currency }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, computed } from 'vue'
import { currencyToFlag } from '../currencyFlags'

const { currency, amount } = defineProps<{
  currency: string
  amount: number
}>()

const emit = defineEmits<{
  (e: 'update:amount', value: number): void
}>()

const formattedAmount = computed(() => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(amount)
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target) {
    const numericValue = Number(target.value.replace(/[^0-9.-]+/g, ''))
    emit('update:amount', numericValue)
  }
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