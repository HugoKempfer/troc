import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import ko from './locales/ko.json'

const supportedLocales = ['en', 'fr', 'ko'] as const

function detectLocale(): string {
  const browserLang = navigator.language.split('-')[0]
  if (supportedLocales.includes(browserLang as typeof supportedLocales[number])) {
    return browserLang
  }
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, fr, ko }
})

export default i18n
