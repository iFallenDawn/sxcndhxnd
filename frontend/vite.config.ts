import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Pinned rather than left to Vite's default 5173: the backend's CORS
    // allowlist names this origin explicitly, so a silent port fallback
    // would break API calls. strictPort surfaces a clash instead.
    port: 3000,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
