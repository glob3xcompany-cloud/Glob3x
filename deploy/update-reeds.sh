#!/usr/bin/env bash
# Pull the latest Reeds Towers site (branch reeds-site) and redeploy it at glob3x.com/reeds. Run as root: bash update-reeds.sh
set -euo pipefail
APP_USER="glob3x"
APP_DIR="/var/www/reeds/app"

sudo -u "$APP_USER" git -C "$APP_DIR" fetch --depth 1 origin reeds-site
sudo -u "$APP_USER" git -C "$APP_DIR" reset --hard origin/reeds-site
cd "$APP_DIR"
sudo -u "$APP_USER" npm ci
sudo -u "$APP_USER" NODE_ENV=production npm run build
systemctl restart glob3x-reeds
systemctl status glob3x-reeds --no-pager | head -n 5
echo "Reeds updated."
