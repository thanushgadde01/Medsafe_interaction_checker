@echo off
REM MedSafe Frontend - Quick Setup Script (Windows)
REM This script automates the initial setup process

setlocal enabledelayedexpansion

echo.
echo MedSafe Frontend - Quick Setup
echo ==============================
echo.

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo   Found: %NODE_VERSION%
echo.

REM Check npm
echo Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo   Found: %NPM_VERSION%
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo   ✅ Dependencies installed
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo Creating .env.local...
    copy .env.example .env.local >nul
    echo   ✅ .env.local created
    echo   ⚠️  Please edit .env.local with your Clerk credentials
) else (
    echo .env.local already exists
)
echo.

REM Initialize database
echo Initializing SQLite database...
npm run db:init >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✅ Database ready
) else (
    echo   ⚠️  Database initialization (can skip if using MongoDB)
)
echo.

echo ==============================
echo ✅ Setup Complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your Clerk credentials:
echo    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo    - CLERK_SECRET_KEY
echo.
echo 2. Ensure MedSafe backend is running on port 8001
echo.
echo 3. Start the development server:
echo    npm run dev
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo For detailed setup guide, see: SETUP_GUIDE.md
echo ==============================
echo.
pause
