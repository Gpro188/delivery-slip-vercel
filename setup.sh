#!/bin/bash

echo "🚀 Delivery Slip Generator - Setup Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Setup environment file
if [ ! -f .env.local ]; then
    echo "🔧 Creating environment file..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your:"
    echo "   - PostgreSQL connection string"
    echo "   - NEXTAUTH_SECRET (run: openssl rand -base64 32)"
    echo ""
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your .env.local file with database credentials"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:3000"
echo ""
echo "For deployment to Vercel:"
echo "1. Push to GitHub"
echo "2. Import at vercel.com"
echo "3. Add environment variables"
echo "4. Deploy!"
echo ""
