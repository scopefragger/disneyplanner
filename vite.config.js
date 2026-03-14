import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import yaml from '@modyfi/vite-plugin-yaml'

const base = process.env.BASE_PATH || '/disneyplanner/'

export default defineConfig({
  plugins: [
    react(),
    yaml(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['images/**/*'],
      manifest: {
        name: 'Disney Holiday Planner',
        short_name: 'Disney Planner',
        description: 'Plan and manage your Walt Disney World holidays',
        theme_color: '#003b78',
        background_color: '#f5f9ff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/disneyplanner/',
        scope: '/disneyplanner/',
        icons: [
          {
            src: 'images/app-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,jpg,png,webmanifest}'],
        navigateFallback: '/disneyplanner/',
        navigateFallbackDenylist: [/^\/_/]
      }
    })
  ],
  base,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/__tests__/setup.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/__tests__/**', 'src/main.jsx', 'src/App.jsx', 'src/components/**', 'src/data/restaurantMetadata.js'],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
      },
    },
  },
})
