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
      '5e84-154-72-162-131.ngrok-free.app', // Replace with your current Ngrok domain
    ],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
