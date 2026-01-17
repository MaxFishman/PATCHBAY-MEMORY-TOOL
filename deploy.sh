#!/bin/bash

echo "🚀 Patchbay Memory Tool - Deployment Setup"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install
cd client && npm install && cd ..

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "🌐 Step 2: Set up your backend"
echo "1. Go to https://render.com and sign up/login"
echo "2. Click 'New +' -> 'Web Service'"
echo "3. Connect your GitHub repo: MaxFishman/PATCHBAY-MEMORY-TOOL"
echo "4. Use these settings:"
echo "   - Name: patchbay-memory-tool-api"
echo "   - Environment: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: npm run server"
echo "   - Plan: Free"
echo ""
read -p "Press Enter when your backend is deployed on Render..."

echo ""
read -p "Enter your Render backend URL (e.g., https://patchbay-memory-tool-api.onrender.com): " BACKEND_URL

# Create .env.production file
echo "REACT_APP_API_URL=$BACKEND_URL" > client/.env.production

echo ""
echo "✅ Backend URL configured!"
echo ""
echo "🚀 Step 3: Deploying to GitHub Pages..."
cd client
npm run deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎉 Your app is now live at:"
echo "   https://maxfishman.github.io/PATCHBAY-MEMORY-TOOL"
echo ""
echo "📝 Note: First load may take 30 seconds as Render wakes up the free tier backend"
