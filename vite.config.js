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
  
  // Add build optimizations for Render deployment
  build: {
    // Reduce memory usage during build
    chunkSizeWarningLimit: 1000,
    
    // Enable code splitting and optimization
    rollupOptions: {
      output: {
        // Manual chunking to reduce bundle size (only for packages that exist)
        manualChunks: {
          // Vendor chunk for large dependencies
          vendor: ['react', 'react-dom'],
          
          // Router chunk
          router: ['react-router-dom'],
          
          // Lingui internationalization chunk
          i18n: ['@lingui/react', '@lingui/core'],
          
          // Charts chunk
          charts: ['chart.js', 'react-chartjs-2'],
          
          // Maps chunk
          maps: ['leaflet', 'react-leaflet'],
          
          // Animation and motion
          animations: ['framer-motion', 'gsap'],
          
          // Forms and validation
          forms: ['react-hook-form', 'yup', '@hookform/resolvers'],
          
          // Utilities
          utils: ['date-fns', 'axios', '@tanstack/react-query']
        },
        
        // Optimize chunk naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    
    // Reduce build concurrency to save memory
    minify: 'esbuild',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline small assets
    
    // Target modern browsers to enable better optimization
    target: 'esnext',
  },
  
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      'bf07-154-72-161-212.ngrok-free.app', // Replace with your current Ngrok domain
    ],
  },
  
  // Optimize dependencies for better build performance
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@lingui/react',
      '@lingui/core',
      'react-hook-form',
      '@tanstack/react-query'
    ],
    exclude: [
      // Exclude heavy dependencies from pre-bundling to save memory
      'chart.js',
      'leaflet',
      'framer-motion',
      'gsap'
    ]
  },
  
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  }
});