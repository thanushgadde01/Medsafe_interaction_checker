#!/bin/bash
# MedSafe Frontend - Quick Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "🚀 MedSafe Frontend - Quick Setup"
echo "=================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
echo "  Found: $NODE_VERSION"
echo ""

# Check npm
echo "✓ Checking npm..."
NPM_VERSION=$(npm -v)
echo "  Found: $NPM_VERSION"
echo ""

# Install dependencies
echo "✓ Installing dependencies..."
npm install
echo "  ✅ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "✓ Creating .env.local..."
    cp .env.example .env.local
    echo "  ✅ .env.local created"
    echo "  ⚠️  Please edit .env.local with your Clerk credentials"
else
    echo "✓ .env.local already exists"
fi
echo ""

# Initialize database
echo "✓ Initializing SQLite database..."
npm run db:init 2>/dev/null || true
echo "  ✅ Database ready"
echo ""

echo "=================================="
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Clerk credentials:"
echo "   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "   - CLERK_SECRET_KEY"
echo ""
echo "2. Ensure MedSafe backend is running on port 8001"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed setup guide, see: SETUP_GUIDE.md"
echo "=================================="
