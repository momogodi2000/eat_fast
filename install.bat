@echo off
echo 🚀 Installing Eat Fast...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Clean previous installation
echo 🧹 Cleaning previous installation...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist dist rmdir /s /q dist

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Compile translations
echo 🌍 Compiling translations...
npm run compile

REM Build the project
echo 🔨 Building the project...
npm run build

echo ✅ Installation completed successfully!
echo 🚀 To start development server: npm run dev
echo 🌐 To preview production build: npm run preview
pause 