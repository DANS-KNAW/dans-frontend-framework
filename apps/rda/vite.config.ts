import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default ({mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
    ]
  })
}
