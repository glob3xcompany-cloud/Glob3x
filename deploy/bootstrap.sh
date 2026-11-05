#!/usr/bin/env bash
# =============================================================================
# Glob3x Group — one-shot server bootstrap for Ubuntu 22.04/24.04 (run as root)
#
#   bash bootstrap.sh <REPO_URL> [DOMAIN] [LETSENCRYPT_EMAIL]
#
# Example:
#   bash bootstrap.sh https://github.com/you/glob3x-group-web.git glob3x.al you@glob3x.al
#
# Installs Node 22 + nginx + certbot, clones the repo, builds the site, runs it
# as a systemd service behind nginx, and (if DNS already points here) issues TLS.
# Idempotent: safe to re-run. Touches ONLY the web stack — never mail/DNS.
# =============================================================================
set -euo pipefail

REPO_URL="${1:-}"
DOMAIN="${2:-glob3x.al}"
LE_EMAIL="${3:-admin@${DOMAIN}}"
APP_USER="glob3x"
APP_HOME="/var/www/glob3x"
APP_DIR="${APP_HOME}/app"

log() { printf "\n\033[1;36m==> %s\033[0m\n" "$*"; }
die() { printf "\n\033[1;31mERROR: %s\033[0m\n" "$*" >&2; exit 1; }

[ "$(id -u)" = "0" ] || die "Run as root (sudo)."
[ -n "$REPO_URL" ] || die "Usage: bash bootstrap.sh <REPO_URL> [DOMAIN] [EMAIL]"

export DEBIAN_FRONTEND=noninteractive

log "Updating apt and installing base packages"
apt-get update -y
apt-get install -y ca-certificates curl gnupg git ufw

log "Installing Node.js 22 (NodeSource)"
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi
node -v && npm -v

log "Installing nginx + certbot"
apt-get install -y nginx certbot python3-certbot-nginx
mkdir -p /var/www/certbot

log "Creating service user ${APP_USER}"
id -u "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --home-dir "$APP_HOME" --shell /usr/sbin/nologin "$APP_USER"
mkdir -p "$APP_HOME"
chown -R "$APP_USER":"$APP_USER" "$APP_HOME"

log "Fetching application code"
if [ -d "${APP_DIR}/.git" ]; then
    sudo -u "$APP_USER" git -C "$APP_DIR" fetch --depth 1 origin main
    sudo -u "$APP_USER" git -C "$APP_DIR" reset --hard origin/main
else
    rm -rf "$APP_DIR"
    sudo -u "$APP_USER" git clone --depth 1 "$REPO_URL" "$APP_DIR"
fi

log "Writing .env.production (edit later to add optional keys)"
if [ ! -f "${APP_DIR}/.env.production" ]; then
    cat > "${APP_DIR}/.env.production" <<EOF
# Runtime environment for ${DOMAIN}. Add optional values here, then: systemctl restart glob3x
NODE_ENV=production
PORT=3001
HOSTNAME=127.0.0.1
NEXT_PUBLIC_SITE_URL=https://${DOMAIN}
# LEAD_WEBHOOK_URL=
# DEEPL_API_KEY=
# HF_API_KEY=
# HF_API_SECRET=
EOF
    chown "$APP_USER":"$APP_USER" "${APP_DIR}/.env.production"
fi

log "Installing dependencies and building"
cd "$APP_DIR"
sudo -u "$APP_USER" npm ci
sudo -u "$APP_USER" NODE_ENV=production npm run build

log "Installing systemd service"
install -m 644 "${APP_DIR}/deploy/glob3x.service" /etc/systemd/system/glob3x.service
systemctl daemon-reload
systemctl enable glob3x
systemctl restart glob3x

log "Configuring nginx"
sed "s/glob3x\\.al/${DOMAIN}/g" "${APP_DIR}/deploy/nginx.conf" > /etc/nginx/sites-available/glob3x.conf
ln -sf /etc/nginx/sites-available/glob3x.conf /etc/nginx/sites-enabled/glob3x.conf
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

log "Opening firewall for HTTP/HTTPS (SSH stays open)"
ufw allow OpenSSH   >/dev/null 2>&1 || true
ufw allow 'Nginx Full' >/dev/null 2>&1 || true
yes | ufw enable >/dev/null 2>&1 || true

log "Attempting TLS certificate (needs DNS A record -> this server already live)"
if certbot --nginx --non-interactive --agree-tos -m "$LE_EMAIL" \
        -d "$DOMAIN" -d "www.${DOMAIN}" --redirect 2>/tmp/certbot.log; then
    echo "TLS issued."
else
    echo "TLS not issued yet (expected if DNS not pointed here yet)."
    echo "After you repoint the A record at mysitearea.com, run:"
    echo "  certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --redirect -m ${LE_EMAIL} --agree-tos"
    tail -n 5 /tmp/certbot.log || true
fi

log "Done. App: http://127.0.0.1:3001  |  Public: http://${DOMAIN}"
echo "Check status: systemctl status glob3x --no-pager ; curl -I http://127.0.0.1:3001"
