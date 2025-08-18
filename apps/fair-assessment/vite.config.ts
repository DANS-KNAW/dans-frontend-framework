import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ],
  // DEV only: this circumvents CORS issues by proxying requests through the Vite dev server
  // to the re3data API
  server: {
    proxy: {
      '/re3data': {
        target: 'https://www.re3data.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/re3data/, ''),
      },
    },
  },
});
