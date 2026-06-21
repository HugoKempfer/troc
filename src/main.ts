import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import './style.css'
import App from './App.vue'
import i18n from './i18n'

// Keep clients on the latest version: registerType 'autoUpdate' applies a new
// service worker and reloads automatically. We also poll for updates hourly and
// whenever the tab regains focus, so long-lived sessions don't go stale.
registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return
    const checkForUpdate = () => registration.update()
    setInterval(checkForUpdate, 60 * 60 * 1000)
    window.addEventListener('focus', checkForUpdate)
  },
})

createApp(App).use(i18n).mount('#app')
