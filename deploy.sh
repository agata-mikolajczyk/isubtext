#!/bin/bash

echo "🚀 Starting deploy..."

cd /var/www/isubtext || exit

echo "📥 Pulling changes..."
git pull origin main

echo "📦 Installing deps..."
npm install --omit=dev

echo "🏗 Building app..."
npm run build

echo "♻️ Reloading app (zero downtime)..."
pm2 reload ecosystem.config.js --update-env

echo "✅ Deploy finished!"

