import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      'ccd0-154-72-163-22.ngrok-free.app'  // Add your current Ngrok domain here
    ]
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});