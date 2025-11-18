#!/bin/bash

echo "🔍 AI Model Registry - Diagnostic Script"
echo "=========================================="
echo ""

# Check current directory
echo "📁 Current directory:"
pwd
echo ""

# Check if key files exist
echo "📄 Checking for required files..."
if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json NOT FOUND!"
fi

if [ -f "tsconfig.json" ]; then
    echo "✅ tsconfig.json found"
else
    echo "❌ tsconfig.json NOT FOUND!"
fi

if [ -f "server.ts" ]; then
    echo "✅ server.ts found"
else
    echo "❌ server.ts NOT FOUND!"
fi
echo ""

# Check if node_modules exists
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules folder exists"
    MODULE_COUNT=$(ls node_modules | wc -l)
    echo "   Contains $MODULE_COUNT packages"
else
    echo "❌ node_modules NOT FOUND!"
    echo "   You need to run: npm install"
    exit 1
fi
echo ""

# Check TypeScript
echo "🔧 Checking TypeScript..."
if [ -f "node_modules/.bin/tsc" ]; then
    echo "✅ TypeScript compiler found"
    ./node_modules/.bin/tsc --version
else
    echo "❌ TypeScript compiler NOT FOUND!"
    echo "   Try: npm install typescript"
    exit 1
fi
echo ""

# Show tsconfig.json content
echo "⚙️  TypeScript Configuration:"
echo "----------------------------"
cat tsconfig.json
echo "----------------------------"
echo ""

# Try to compile
echo "🔨 Attempting to compile..."
echo "Command: npx tsc"
echo ""
npx tsc 2>&1 | head -30
echo ""

# Check if dist was created
echo "📂 Checking output..."
if [ -d "dist" ]; then
    echo "✅ dist folder created"
    echo "   Contents:"
    ls -lh dist/
else
    echo "❌ dist folder NOT created"
    echo "   Compilation may have failed"
fi
echo ""

echo "✅ Diagnostic complete!"