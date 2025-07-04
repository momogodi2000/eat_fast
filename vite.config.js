import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
<<<<<<< HEAD
import { lingui } from "@lingui/vite-plugin";
import path from "path";
=======
import tailwindcss from "@tailwindcss/vite";
import { lingui } from "@lingui/vite-plugin";
>>>>>>> 753220f0986fa4338251ff890c029766f035deec

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["macros"],
      },
    }),
<<<<<<< HEAD
    lingui(),
  ],
  
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
          maps: ['leaflet', 'react-leaflet']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
=======
    tailwindcss(),
    lingui(),
  ],
  
  // Simplified build to avoid rollup binary issues
  build: {
    target: 'es2015',
    
    // Disable problematic optimizations that require native binaries
    minify: false,
    
    // Simple rollup configuration
    rollupOptions: {
      output: {
        // Basic chunking without complex native optimizations
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    },
    
    // Disable asset inlining that might cause issues
    assetsInlineLimit: 0,
    
    // Increase chunk size limit to avoid warnings
    chunkSizeWarningLimit: 2000,
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
  },
  
  server: {
    host: true,
    port: 5173,
<<<<<<< HEAD
    open: true,
    cors: true,
    hmr: {
      overlay: false
    }
  },
  
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'axios',
      'i18next',
      'react-i18next'
    ],
    exclude: ['@lingui/macro']
=======
    allowedHosts: [
      "localhost",
      "c1a0-154-72-162-132.ngrok-free.app", // Replace with your current Ngrok domain
    ],
  },
  
  // Minimal optimizations to avoid esbuild/rollup issues
  optimizeDeps: {
    include: ['react', 'react-dom']
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
  },
  
  resolve: {
    alias: {
<<<<<<< HEAD
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
    global: 'globalThis'
  },

  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
=======
      "@": "/src",
    },
  },
  
  // Define basic environment variables
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
  }
});