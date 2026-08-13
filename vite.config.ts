// import path from 'path'
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // 原生标准Vite React配置
// export default defineConfig({
//   base: './', // 相对路径打包，Vercel CDN正常加载
//   define: {
//     'process.env': {}
//   },
//   plugins: [react()],
//   server: {
//     port: 8001,
//     open: true,
//     host: true
//   },
//   build: {
//     outDir: 'dist',       // 最终输出根目录
//     emptyOutDir: true,    // 打包前清空dist
//     assetsDir: 'assets'   // 静态资源都放在dist/assets，不会嵌套文件夹
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(import.meta.dirname, 'src')
//     },
//   },
// })
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
  }
})