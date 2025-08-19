<template>
    <div
      class="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:border-lavender-300 focus-within:border-lavender-400 shadow-sm w-full"
    >
      <span class="text-xl mr-3" :aria-label="currency + ' flag'">{{ currencyToFlag[currency] }}</span>
      <div class="flex-1">
        <input
          type="number"
          :value="amount"
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
  
  defineProps<{
    currency: string
    amount: number
  }>()
  
  const emit = defineEmits<{
    (e: 'update:amount', value: number): void
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
  
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target) {
      emit('update:amount', Number(target.value))
    }
  }
  </script>
  
  <style scoped>
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type='number'] {
    -moz-appearance: textfield;
    -webkit-appearance: textfield;
    appearance: textfield;
  }
  </style>