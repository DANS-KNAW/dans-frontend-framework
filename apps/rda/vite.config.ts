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
}
