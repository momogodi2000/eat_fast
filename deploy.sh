#!/bin/bash

# 🚀 Eat Fast - Quick Deployment Script
# This script automates the setup, build, and deployment process

set -e  # Exit on any error

echo "🚀 Starting Eat Fast deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi

print_success "npm version: $(npm -v)"

# Check Git
if ! command -v git &> /dev/null; then
    print_warning "Git is not installed. Some features may not work."
fi

# Clean installation
print_status "Cleaning previous installation..."
rm -rf node_modules package-lock.json dist

# Install dependencies
print_status "Installing dependencies..."
npm install

# Compile translations
print_status "Compiling translations..."
npm run compile

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from template..."
    cp env.example .env
    print_warning "Please edit .env file with your configuration before deploying."
fi

# Lint code
print_status "Running code linting..."
npm run lint

# Build project
print_status "Building project for production..."
npm run build

print_success "Build completed successfully!"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    print_warning "Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Deploy to Netlify
print_status "Deploying to Netlify..."
netlify deploy --prod --dir=dist

print_success "Deployment completed successfully!"
print_success "Your Eat Fast application is now live! 🍕"

# Optional: Open the deployed site
read -p "Would you like to open the deployed site? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    netlify open
fi

echo ""
print_success "Deployment script completed!"
print_status "For more information, check deploy-commands.md" 