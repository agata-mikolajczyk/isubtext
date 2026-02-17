#!/bin/bash

echo "=== DEPLOY START ==="

cd /var/www/isubtext || exit

echo "Pulling latest code..."
git pull origin main

echo "Installing dependencies..."
npm install

echo "Building app..."
npm run build

echo "Restarting app..."
pm2 restart isubtext

echo "=== DEPLOY DONE ==="
