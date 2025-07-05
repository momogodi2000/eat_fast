#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
};

// Configuration
const config = {
  environments: {
    development: {
      name: 'Development',
      buildCommand: 'npm run build',
      deployCommand: 'netlify deploy --dir=dist --prod',
      envFile: '.env.development'
    },
    staging: {
      name: 'Staging',
      buildCommand: 'npm run build',
      deployCommand: 'netlify deploy --dir=dist --prod',
      envFile: '.env.staging'
    },
    production: {
      name: 'Production',
      buildCommand: 'npm run build',
      deployCommand: 'netlify deploy --dir=dist --prod',
      envFile: '.env.production'
    }
  }
};

// Utility functions
function runCommand(command, options = {}) {
  try {
    log.info(`Running: ${command}`);
    const result = execSync(command, {
      stdio: 'inherit',
      ...options
    });
    return result;
  } catch (error) {
    log.error(`Command failed: ${command}`);
    throw error;
  }
}

function checkPrerequisites() {
  log.header('Checking Prerequisites');
  
  // Check if Node.js is installed
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    log.success(`Node.js version: ${nodeVersion}`);
  } catch (error) {
    log.error('Node.js is not installed');
    process.exit(1);
  }
  
  // Check if npm is installed
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    log.success(`npm version: ${npmVersion}`);
  } catch (error) {
    log.error('npm is not installed');
    process.exit(1);
  }
  
  // Check if .env file exists
  if (!fs.existsSync('.env')) {
    log.warning('.env file not found. Please create one from env.example');
  }
  
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    log.error('package.json not found. Are you in the correct directory?');
    process.exit(1);
  }
}

function installDependencies() {
  log.header('Installing Dependencies');
  
  if (fs.existsSync('package-lock.json')) {
    runCommand('npm ci');
  } else {
    runCommand('npm install');
  }
  
  log.success('Dependencies installed successfully');
}

function runTests() {
  log.header('Running Tests');
  
  try {
    runCommand('npm run test');
    log.success('All tests passed');
  } catch (error) {
    log.warning('Some tests failed, but continuing with deployment');
  }
}

function buildProject(environment) {
  log.header(`Building for ${environment.name}`);
  
  // Set environment variables
  process.env.NODE_ENV = environment.name.toLowerCase();
  
  // Copy environment file if it exists
  if (fs.existsSync(environment.envFile)) {
    fs.copyFileSync(environment.envFile, '.env');
    log.info(`Using environment file: ${environment.envFile}`);
  }
  
  // Run build command
  runCommand(environment.buildCommand);
  log.success('Build completed successfully');
}

function deployProject(environment) {
  log.header(`Deploying to ${environment.name}`);
  
  try {
    runCommand(environment.deployCommand);
    log.success(`Deployed to ${environment.name} successfully`);
  } catch (error) {
    log.error(`Deployment to ${environment.name} failed`);
    throw error;
  }
}

function runLinting() {
  log.header('Running Linting');
  
  try {
    runCommand('npm run lint');
    log.success('Linting passed');
  } catch (error) {
    log.warning('Linting failed, but continuing with deployment');
  }
}

function runTypeCheck() {
  log.header('Running Type Check');
  
  try {
    runCommand('npm run type-check');
    log.success('Type check passed');
  } catch (error) {
    log.warning('Type check failed, but continuing with deployment');
  }
}

function analyzeBundle() {
  log.header('Analyzing Bundle');
  
  try {
    runCommand('npm run analyze');
    log.success('Bundle analysis completed');
  } catch (error) {
    log.warning('Bundle analysis failed');
  }
}

function cleanup() {
  log.header('Cleaning Up');
  
  // Remove build artifacts
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    log.info('Removed dist directory');
  }
  
  // Remove node_modules if requested
  if (process.argv.includes('--clean')) {
    if (fs.existsSync('node_modules')) {
      fs.rmSync('node_modules', { recursive: true, force: true });
      log.info('Removed node_modules directory');
    }
  }
  
  log.success('Cleanup completed');
}

function showHelp() {
  console.log(`
${colors.bright}Eat Fast Deployment Script${colors.reset}

Usage: node scripts/deploy.js [environment] [options]

Environments:
  development  Deploy to development environment
  staging      Deploy to staging environment
  production   Deploy to production environment

Options:
  --skip-tests     Skip running tests
  --skip-lint      Skip running linting
  --skip-type-check Skip running type check
  --analyze        Run bundle analysis
  --clean          Clean up node_modules after deployment
  --help           Show this help message

Examples:
  node scripts/deploy.js development
  node scripts/deploy.js production --skip-tests
  node scripts/deploy.js staging --analyze --clean
`);
}

// Main deployment function
async function deploy(environmentName) {
  const environment = config.environments[environmentName];
  
  if (!environment) {
    log.error(`Unknown environment: ${environmentName}`);
    showHelp();
    process.exit(1);
  }
  
  try {
    log.header(`Starting deployment to ${environment.name}`);
    
    // Check prerequisites
    checkPrerequisites();
    
    // Install dependencies
    installDependencies();
    
    // Run tests (unless skipped)
    if (!process.argv.includes('--skip-tests')) {
      runTests();
    }
    
    // Run linting (unless skipped)
    if (!process.argv.includes('--skip-lint')) {
      runLinting();
    }
    
    // Run type check (unless skipped)
    if (!process.argv.includes('--skip-type-check')) {
      runTypeCheck();
    }
    
    // Build project
    buildProject(environment);
    
    // Run bundle analysis (if requested)
    if (process.argv.includes('--analyze')) {
      analyzeBundle();
    }
    
    // Deploy project
    deployProject(environment);
    
    log.success(`Deployment to ${environment.name} completed successfully!`);
    
    // Cleanup
    cleanup();
    
  } catch (error) {
    log.error(`Deployment failed: ${error.message}`);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const environment = args[0];

if (args.includes('--help') || !environment) {
  showHelp();
  process.exit(0);
}

// Start deployment
deploy(environment); 