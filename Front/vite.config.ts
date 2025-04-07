import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  envDir: '..', 
  plugins: [react(), tsconfigPaths()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/upload-video': {
        target: 'http://192.168.219.192:5000',
        changeOrigin: true,
        rewrite: (path) => path, 
      }
    }
  },
})
