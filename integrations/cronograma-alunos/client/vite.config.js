import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/cronograma-alunos-app/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/cronograma-alunos': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})