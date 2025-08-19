<template>
    <div
      class="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:border-lavender-300 focus-within:border-lavender-400 shadow-sm w-full"
    >
      <span class="text-xl mr-3" :aria-label="currency + ' flag'">{{ currencyToFlag[currency] }}</span>
      <div class="flex-1">
        <input
          type="number"
          :value="amount"
          @input="emit('update:amount', Number($event.target.value))"
          class="w-full text-2xl font-medium text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 appearance-textfield"
          :placeholder="currency"
          step="0.01"
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
  
  const currencyToFlag = {
    USD: '🇺🇸', // United States
    EUR: '🇪🇺', // European Union
    GBP: '🇬🇧', // United Kingdom
    JPY: '🇯🇵', // Japan
    BGN: '🇧🇬', // Bulgaria
    CZK: '🇨🇿', // Czech Republic
    DKK: '🇩🇰', // Denmark
    HUF: '🇭🇺', // Hungary
    PLN: '🇵🇱', // Poland
    RON: '🇷🇴', // Romania
    SEK: '🇸🇪', // Sweden
    CHF: '🇨🇭', // Switzerland
    NOK: '🇳🇴', // Norway
    HRK: '🇭🇷', // Croatia
    RUB: '🇷🇺', // Russia
    TRY: '🇹🇷', // Turkey
    AUD: '🇦🇺', // Australia
    BRL: '🇧🇷', // Brazil
    CAD: '🇨🇦', // Canada
    CNY: '🇨🇳', // China
    HKD: '🇭🇰', // Hong Kong
    IDR: '🇮🇩', // Indonesia
    ILS: '🇮🇱', // Israel
    INR: '🇮🇳', // India
    KRW: '🇰🇷', // South Korea
    MXN: '🇲🇽', // Mexico
    MYR: '🇲🇾', // Malaysia
    NZD: '🇳🇿', // New Zealand
    PHP: '🇵🇭', // Philippines
    SGD: '🇸🇬', // Singapore
    THB: '🇹🇭', // Thailand
    ZAR: '🇿🇦'  // South Africa
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
  }
  </style>