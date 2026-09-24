import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // lets the app call "/api/..." in dev without setting VITE_API_URL
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
