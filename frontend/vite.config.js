import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose the server to external hosts
    port: 5173,
    watch: {
      usePolling: true, // This is important for Docker, especially on Windows or Mac
    },
  },
})
