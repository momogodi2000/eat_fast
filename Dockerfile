<<<<<<< HEAD
<<<<<<< HEAD
# Use Node.js 18 Alpine for smaller image size
=======
# Multi-stage build for production optimization
>>>>>>> Divinson-NewIUX
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

<<<<<<< HEAD
# Set environment variables
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=https://your-backend-api.com/api/v1

=======
>>>>>>> Divinson-NewIUX
# Build the application
RUN npm run build

# Production image, copy all the files and run the app
FROM nginx:alpine AS runner
<<<<<<< HEAD
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=builder /app/dist .
=======
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/dist /app/dist
>>>>>>> Divinson-NewIUX

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

<<<<<<< HEAD
# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
=======
# Use official Node.js runtime as base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false --include=optional

# Copy source code
COPY . .

# Compile Lingui translations
RUN npm run compile

# Build the application
RUN NODE_OPTIONS="--max-old-space-size=1024" npm run build

# Production stage
FROM node:18-alpine AS production

# Install serve to run the built app
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built application from build stage
COPY --from=base /app/dist ./dist

# Copy package.json for metadata
COPY --from=base /app/package.json ./
=======
# Copy custom nginx configuration for the app
COPY nginx-app.conf /etc/nginx/conf.d/default.conf

# Set proper permissions
RUN chown -R nextjs:nodejs /app
RUN chmod -R 755 /app

# Switch to non-root user
USER nextjs
>>>>>>> Divinson-NewIUX

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
<<<<<<< HEAD
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
=======
  CMD curl -f http://localhost:3000/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 
>>>>>>> Divinson-NewIUX
