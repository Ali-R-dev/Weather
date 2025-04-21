import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithm: 'brotliCompress' }),
    visualizer({ filename: 'bundle-stats.html', open: false, gzipSize: true }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'assets/weather-icon.svg'],
      manifest: {
        name: 'Weather App',
        short_name: 'WeatherApp',
        description: 'A modern, responsive weather application',
        theme_color: '#38B2AC',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/assets/weather-icon.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/assets/weather-icon.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/geocoding-api\.open-meteo\.com\/v1\/search.*/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'geo-api-cache', expiration: { maxAgeSeconds: 3600, maxEntries: 50 } }
          },
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/v1\/forecast.*/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'weather-api-cache', expiration: { maxAgeSeconds: 3600, maxEntries: 50 } }
          }
        ]
      }
    })
  ],
  base: '/',
  optimizeDeps: {
    include: ['recharts/es6'], // Ensures Vite processes only needed components
  },
  build: {
    minify: true,
    cssCodeSplit: true,
    sourcemap: true, // Enable source maps
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('framer-motion')) return 'framer-motion-vendor';
            if (id.includes('recharts')) return 'recharts-vendor';
            if (id.includes('axios')) return 'axios-vendor';
            if (id.includes('zustand')) return 'zustand-vendor';
            return 'vendor';
          }
        },
      },
    },
  },
});
