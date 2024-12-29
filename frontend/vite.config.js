import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Expose the server to external hosts
    port: 5173,      // Ensure this matches the port used in Docker
  },
})
