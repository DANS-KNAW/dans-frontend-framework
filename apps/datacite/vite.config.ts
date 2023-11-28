import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	console.log(process.env)

	return defineConfig({
		server: {
			proxy: {
				'/api/search': {
					target: process.env.VITE_ELASTICSEARCH_API_ENDPOINT,
					changeOrigin: true,
					rewrite: path => {
						return path.replace(/^\/api\/search/, '')
					},
					configure: (_proxy, options) => {
						const user = process.env.VITE_ELASTICSEARCH_API_USER;
						const pass = process.env.VITE_ELASTICSEARCH_API_PASS;
						options.auth = `${user}:${pass}`;
					},
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
