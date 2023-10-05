import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/search': {
        target: 'http://localhost:9200',
        changeOrigin: true,
        rewrite: path => {
          return path.replace(/^\/api\/search/, '')
        }
      }
    },
  },
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ]
})
