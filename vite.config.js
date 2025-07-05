import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
<<<<<<< HEAD
import { lingui } from "@lingui/vite-plugin";
import path from "path";
=======
import tailwindcss from "@tailwindcss/vite";
import { lingui } from "@lingui/vite-plugin";
<<<<<<< HEAD
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
=======
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
>>>>>>> Divinson-NewIUX

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
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Eat Fast - Food Delivery Cameroon',
        short_name: 'Eat Fast',
        description: 'Order delicious food online in Cameroon. Fast delivery to your doorstep in Yaoundé, Douala, and across Cameroon.',
        theme_color: '#FF6B35',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/src/assets/logo/eat_fast.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/src/assets/logo/eat_fast.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Order Food',
            short_name: 'Order',
            description: 'Quick access to order food',
            url: '/restaurants',
            icons: [{ src: '/src/assets/logo/eat_fast.png', sizes: '96x96' }]
          },
          {
            name: 'My Orders',
            short_name: 'Orders',
            description: 'View your order history',
            url: '/client/orders',
            icons: [{ src: '/src/assets/logo/eat_fast.png', sizes: '96x96' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,woff,woff2,ttf,eot}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}?${Date.now()}`;
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
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
<<<<<<< HEAD
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
=======
    port: 3000,
>>>>>>> Divinson-NewIUX
    allowedHosts: [
      "localhost",
      "c1a0-154-72-162-132.ngrok-free.app", // Replace with your current Ngrok domain
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  // Minimal optimizations to avoid esbuild/rollup issues
  optimizeDeps: {
    include: ['react', 'react-dom']
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
  },
  
  resolve: {
    alias: {
<<<<<<< HEAD
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
=======
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@pages": resolve(__dirname, "src/pages"),
      "@services": resolve(__dirname, "src/Services"),
      "@utils": resolve(__dirname, "src/utils"),
      "@assets": resolve(__dirname, "src/assets"),
      "@styles": resolve(__dirname, "src/styles"),
      "@theme": resolve(__dirname, "src/theme"),
      "@i18n": resolve(__dirname, "src/i18n"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@tailwindcss/forms', 'framer-motion'],
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
          maps: ['leaflet', 'react-leaflet', '@googlemaps/js-api-loader'],
          utils: ['axios', 'date-fns', 'yup', 'react-hook-form']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'framer-motion',
      'chart.js',
      'react-chartjs-2',
      'recharts',
      'leaflet',
      'react-leaflet',
      '@googlemaps/js-api-loader'
    ]
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});
>>>>>>> Divinson-NewIUX
