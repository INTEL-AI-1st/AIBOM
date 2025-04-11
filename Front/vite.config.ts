import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import fs from 'fs'
import path from 'path'

const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, 'certs', 'private.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'public.pem')),
}


export default defineConfig({
  envDir: '..', 
  plugins: [react(), tsconfigPaths()],
  server: {
    https: httpsOptions,
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/upload-video': {
        target: 'http://192.168.219.186:5000',
        changeOrigin: true,
        rewrite: (path) => path, 
      }
    }
  },
  build: {
    outDir: 'build'
  }
})
