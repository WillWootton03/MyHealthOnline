import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    }
  },

  server : {
    // Used For Docker Container
    host : '0.0.0.0',
    port : 5173,
    watch : {
      usePolling: true,   // Set to true during dev and false during production to prevent hot reload
    },
    fs: {
      allow: ['..'],
    },
    // Used for api connections
    proxy : {
      '/api' : {
        target : "http://api:5000",
        changeOrigin : true,
      },
    },
  },
})
