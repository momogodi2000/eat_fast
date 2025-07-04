#!/bin/bash

# Eat Fast Installation Script
echo "🚀 Installing Eat Fast..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Clean previous installation
echo "🧹 Cleaning previous installation..."
rm -rf node_modules package-lock.json dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Compile translations
echo "🌍 Compiling translations..."
npm run compile

# Build the project
echo "🔨 Building the project..."
npm run build

echo "✅ Installation completed successfully!"
echo "🚀 To start development server: npm run dev"
echo "🌐 To preview production build: npm run preview" 