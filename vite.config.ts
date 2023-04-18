import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'public',
    rollupOptions: {
        // overwrite default .html entry
        input: './src/client/main.tsx',
      }
    },
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  resolve:{
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  }
})
