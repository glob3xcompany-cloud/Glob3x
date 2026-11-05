#!/usr/bin/env bash
# Pull the latest code and redeploy. Run as root: bash update.sh
set -euo pipefail
APP_USER="glob3x"
APP_DIR="/var/www/glob3x/app"

sudo -u "$APP_USER" git -C "$APP_DIR" fetch --depth 1 origin main
sudo -u "$APP_USER" git -C "$APP_DIR" reset --hard origin/main
cd "$APP_DIR"
sudo -u "$APP_USER" npm ci
sudo -u "$APP_USER" NODE_ENV=production npm run build
systemctl restart glob3x
systemctl status glob3x --no-pager | head -n 5
echo "Updated."
