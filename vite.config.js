import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { lingui } from "@lingui/vite-plugin";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["macros"],
      },
    }),
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
  },
  
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      "localhost",
      "c1a0-154-72-162-132.ngrok-free.app", // Replace with your current Ngrok domain
    ],
  },
  
  // Minimal optimizations to avoid esbuild/rollup issues
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  
  // Define basic environment variables
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  }
});