import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true // Allows all hosts
  },
  base: '/', // ← ADD THIS LINE
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})