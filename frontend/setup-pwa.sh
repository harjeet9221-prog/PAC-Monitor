#!/bin/bash

echo "🚀 PAC Monitor PWA Setup Script"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

echo "✅ Current directory: $(pwd)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    yarn install
    echo ""
fi

# Check if build works
echo "🔨 Testing build process..."
if yarn build; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo ""
echo "📱 PWA Status Check"
echo "=================="

# Check for required files
echo "Checking required PWA files..."

files=(
    "public/manifest.json"
    "public/sw.js"
    "public/browserconfig.xml"
    "src/utils/serviceWorker.js"
    "src/components/PWAInstall.js"
    "src/config/pwa.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
    fi
done

echo ""
echo "⚠️  Icon Files Status"
echo "===================="

# Check icon files
icon_files=(
    "public/favicon-16x16.png"
    "public/favicon-32x32.png"
    "public/logo192.png"
    "public/logo512.png"
    "public/screenshot1.png"
)

for icon in "${icon_files[@]}"; do
    if [ -f "$icon" ]; then
        # Check if it's a placeholder
        if grep -q "placeholder\|This is a placeholder" "$icon" 2>/dev/null; then
            echo "⚠️  $icon (placeholder - needs replacement)"
        else
            echo "✅ $icon"
        fi
    else
        echo "❌ $icon (missing)"
    fi
done

echo ""
echo "🎯 Next Steps"
echo "============="
echo "1. Replace placeholder icon files with actual PNG images"
echo "2. Test PWA functionality: yarn start"
echo "3. Build and test: yarn build && npx serve -s build"
echo "4. Open test-pwa.html to verify all features work"
echo ""
echo "📚 Documentation"
echo "==============="
echo "- PWA Setup: PWA_SETUP.md"
echo "- Icon Setup: ICON_SETUP.md"
echo "- PWA Summary: PWA_SUMMARY.md"
echo "- Test File: test-pwa.html"
echo ""
echo "🎉 Your PWA is ready! Just add the icons and you're good to go!"