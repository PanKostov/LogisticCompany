import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/authentication': 'http://localhost:3000',
      '/user': 'http://localhost:3000',
      '/admin': 'http://localhost:3000',
      '/customer': 'http://localhost:3000',
      '/office': 'http://localhost:3000',
      '/packet': 'http://localhost:3000',
      '/company': 'http://localhost:3000',
    },
  },
})
