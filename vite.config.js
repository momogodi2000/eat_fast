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
      'f28c-102-244-98-27.ngrok-free.app', // Replace with your current Ngrok domain
    ],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
