import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    strictPort: true,
    // Keeps dev same-origin like production (see `lib/api-base-url.ts`):
    // API calls go to `/api` on this server and are forwarded to the local
    // FastAPI backend (`fastapi dev main.py`).
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    outDir: '../backend/dist', // Replace with your desired folder
  },
})
