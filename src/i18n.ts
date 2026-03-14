import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import ko from './locales/ko.json'

export const supportedLocales = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'ko', label: '한' }
] as const

function detectLocale(): string {
  const saved = localStorage.getItem('troc-locale')
  if (saved && supportedLocales.some(l => l.code === saved)) return saved
  const browserLang = navigator.language.split('-')[0]
  if (supportedLocales.some(l => l.code === browserLang)) return browserLang
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, fr, ko }
})

export default i18n
