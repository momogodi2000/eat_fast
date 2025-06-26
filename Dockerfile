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

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]