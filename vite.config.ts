import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/troc/',
  plugins: [vue(), tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Troc - Currency Converter',
        short_name: 'Troc',
        description: 'A simple open-source currency converter.',
        theme_color: '#ffffff',
        icons: []
      },
    })
  ],
})
