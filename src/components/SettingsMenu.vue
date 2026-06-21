<template>
  <div
    class="flex w-full max-w-xs flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 sm:max-w-sm md:max-w-md dark:bg-gray-800 dark:ring-white/10"
    style="max-height: 90vh"
  >
    <div class="flex items-center justify-between p-5 pb-3">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
        {{ $t('selectCurrencies') }}
      </h2>
      <button
        ref="closeButton"
        type="button"
        class="rounded-lg p-1 text-2xl leading-none text-gray-400 transition-colors hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-golden-400 dark:hover:text-gray-200"
        :aria-label="$t('close')"
        @click="$emit('close')"
      >
        ×
      </button>
    </div>

    <div class="px-5 pb-3">
      <input
        v-model="search"
        type="search"
        class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-golden-400 focus:outline-none focus:ring-2 focus:ring-golden-400/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500"
        :placeholder="$t('searchCurrencies')"
        :aria-label="$t('searchCurrencies')"
      />
    </div>

    <div class="flex-1 overflow-y-auto px-5 pb-5">
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        <button
          v-for="currency in filteredSelected"
          :key="currency"
          type="button"
          class="flex items-center gap-3 rounded-lg border-2 border-golden-400 bg-golden-50 p-3 transition-all hover:shadow-sm active:scale-[0.98] dark:border-golden-500 dark:bg-golden-900/30"
          :aria-pressed="true"
          @click="toggleCurrency(currency)"
        >
          <span class="text-xl">{{ currencyToFlag[currency] }}</span>
          <div class="flex min-w-0 flex-col items-start">
            <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{
              currency
            }}</span>
            <span class="max-w-full truncate text-xs text-gray-400 dark:text-gray-500">{{
              $t(`currencyNames.${currency}`)
            }}</span>
          </div>
          <span class="ml-auto text-sm text-golden-500 dark:text-golden-400">✓</span>
        </button>
      </div>
      <div
        v-if="filteredUnselected.length > 0 && filteredSelected.length > 0"
        class="my-3 border-t border-gray-200 dark:border-gray-700"
      />
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        <button
          v-for="currency in filteredUnselected"
          :key="currency"
          type="button"
          class="flex items-center gap-3 rounded-lg border-2 border-gray-100 p-3 transition-all hover:border-gray-300 hover:shadow-sm active:scale-[0.98] dark:border-gray-700 dark:hover:border-gray-500"
          :aria-pressed="false"
          @click="toggleCurrency(currency)"
        >
          <span class="text-xl">{{ currencyToFlag[currency] }}</span>
          <div class="flex min-w-0 flex-col items-start">
            <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{
              currency
            }}</span>
            <span class="max-w-full truncate text-xs text-gray-400 dark:text-gray-500">{{
              $t(`currencyNames.${currency}`)
            }}</span>
          </div>
        </button>
      </div>
      <p
        v-if="filteredSelected.length === 0 && filteredUnselected.length === 0"
        class="py-6 text-center text-sm text-gray-400 dark:text-gray-500"
      >
        {{ $t('noResults') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { currencyToFlag } from '../currencyFlags'

const props = defineProps<{
  selectedCurrencies: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update-currencies', currencies: string[]): void
}>()

const { t, te } = useI18n()

const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')

// Move focus into the dialog when it opens (basic focus management).
onMounted(() => closeButton.value?.focus())

const search = ref('')
const allCurrencies = Object.keys(currencyToFlag)

// Match against the currency code and its localized name.
const matches = (currency: string): boolean => {
  const query = search.value.trim().toLowerCase()
  if (!query) return true
  if (currency.toLowerCase().includes(query)) return true
  const key = `currencyNames.${currency}`
  return te(key) && t(key).toLowerCase().includes(query)
}

const filteredSelected = computed(() => props.selectedCurrencies.filter(matches))

const filteredUnselected = computed(() =>
  allCurrencies.filter((c) => !props.selectedCurrencies.includes(c) && matches(c)).sort(),
)

const toggleCurrency = (currency: string) => {
  const updated = [...props.selectedCurrencies]
  const index = updated.indexOf(currency)
  if (index > -1) {
    if (updated.length <= 1) return // keep at least one currency selected
    updated.splice(index, 1)
  } else {
    updated.push(currency)
  }
  emit('update-currencies', updated)
}
</script>
