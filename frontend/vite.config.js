import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: 'https://student-portfolio-ckpc.onrender.com', changeOrigin: true }
    }
  },
  build: {
    // Split heavy libraries into their own chunks so the initial load is
    // small; the 3D bundle is only fetched when a portfolio renders it.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber'],
          motion: ['framer-motion'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'axios']
        }
      }
    },
    chunkSizeWarningLimit: 1100
  }
})
