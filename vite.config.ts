/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      renderLegacyChunks: false
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Eqiz Studio',
        short_name: 'Eqiz Studio',
        description: 'Eqiz Studio content & order management',
        theme_color: '#f5f0f0',
        background_color: '#f5f0f0',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'apple-touch-icon.png',
            sizes: 'any',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'favicon.png',
            sizes: 'any',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,webp,woff2}']
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
