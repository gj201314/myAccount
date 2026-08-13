import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 原生标准Vite React配置
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8001,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src')
    },
  },
})
