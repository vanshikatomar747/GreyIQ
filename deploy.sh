#!/bin/bash

# Configuration
SERVER_IP="72.61.125.73"
SSH_KEY="~/.ssh/id_ed25519"
REMOTE_PATH="/var/www/greyiq"

echo "🚀 Starting GreyIQ Deployment Update..."

# 1. Sync files to VPS (excluding node_modules, logs, and server's .env configuration)
echo "📦 Syncing files to server..."
rsync -avz \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'client/node_modules' \
  --exclude 'client/dist' \
  --exclude 'server/.env' \
  -e "ssh -i $SSH_KEY" \
  ./ root@$SERVER_IP:$REMOTE_PATH/

# 2. Build the frontend client on the server
echo "🏗️ Installing frontend dependencies and building React client..."
ssh -i $SSH_KEY root@$SERVER_IP "cd $REMOTE_PATH/client && npm install && npm run build"

# 3. Restart the backend service
echo "🔄 Restarting Node.js backend service..."
ssh -i $SSH_KEY root@$SERVER_IP "systemctl restart greyiq"

echo "✅ Deployment updated successfully! Check https://greyiqsolutions.com"
