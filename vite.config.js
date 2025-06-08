import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { lingui } from '@lingui/vite-plugin';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['macros'],
      },
    }),
    tailwindcss(),
    lingui(),
  ],
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      '6e3d-102-244-54-237.ngrok-free.app', // Replace with your current Ngrok domain
    ],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
