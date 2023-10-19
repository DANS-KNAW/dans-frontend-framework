import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default ({mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    server: {
      proxy: {
        '/api/search': {
          target: process.env.VITE_ELASTICSEARCH_API_ENDPOINT,
          changeOrigin: true,
          rewrite: path => {
            return path.replace(/^\/api\/search/, '')
          }
        }
      },
      cors: true,
    },
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
    ]
  })
}
