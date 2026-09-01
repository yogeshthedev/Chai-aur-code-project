import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Threshold in kB for chunk size warnings
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Separate third-party dependencies into isolated, cacheable vendor chunks
        manualChunks: {
          // React Core & Router dependencies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Server state management
          'query-vendor': ['@tanstack/react-query'],
          // UI Icons
          'lucide-icons': ['lucide-react'],
        },
      },
    },
  },
})


