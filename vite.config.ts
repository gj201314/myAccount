import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    'process.env': {}
  },
  server: {
    port: 8001,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    // 关闭chunk大小警告（可选）
    chunkSizeWarningLimit: 1500
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src')
    },
  },
})