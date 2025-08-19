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
        icons: [
          {
            src: 'web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.frankfurter\.app\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'troc-rates',
              expiration: {
                maxAgeSeconds: 24 * 60 * 60 // 1 day
              }
            }
          }
        ]
      }
    })
  ],
})
