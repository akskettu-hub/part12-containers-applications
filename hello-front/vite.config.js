import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],


  server: {
    host: true,
    strictPort: true,
    cors: true,
    origin: 'http://app:5173',
  },
})
