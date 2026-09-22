#!/usr/bin/env bash
# One-time VPS bootstrap · Ubuntu 22.04+
set -euo pipefail

REPO="${REPO:-https://github.com/zakiachsan/daya-oto-asia.git}"
PROD_DIR="/var/www/daya-oto-asia-production"
STAGE_DIR="/var/www/daya-oto-asia-staging"
DEPLOY_USER="${SUDO_USER:-ubuntu}"

echo "==> Install system packages"
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update -qq
sudo apt-get install -y -qq curl git nginx ufw

if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  echo "==> Install Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y -qq nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "==> Install PM2"
  sudo npm install -g pm2
fi

echo "==> Firewall"
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 8080/tcp
sudo ufw --force enable || true

echo "==> App directories"
sudo mkdir -p "$PROD_DIR" "$STAGE_DIR"
sudo chown -R "$DEPLOY_USER:$DEPLOY_USER" /var/www

clone_or_pull() {
  local dir="$1"
  local branch="$2"
  if [[ -d "$dir/.git" ]]; then
    git -C "$dir" fetch origin
    git -C "$dir" checkout "$branch"
    git -C "$dir" reset --hard "origin/$branch"
  else
    git clone --branch "$branch" --depth 1 "$REPO" "$dir"
  fi
}

echo "==> Clone repositories"
clone_or_pull "$PROD_DIR" main
clone_or_pull "$STAGE_DIR" staging

build_app() {
  local dir="$1"
  echo "==> Build $dir"
  cd "$dir"
  npm ci
  npm run build
}

build_app "$PROD_DIR"
build_app "$STAGE_DIR"

echo "==> Nginx"
sudo cp "$PROD_DIR/deploy/nginx/daya-oto-asia.conf" /etc/nginx/sites-available/daya-oto-asia.conf
sudo ln -sf /etc/nginx/sites-available/daya-oto-asia.conf /etc/nginx/sites-enabled/daya-oto-asia.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx

echo "==> PM2"
pm2 start "$PROD_DIR/deploy/ecosystem.config.cjs"
pm2 save
sudo env PATH="$PATH:/usr/bin" pm2 startup systemd -u "$DEPLOY_USER" --hp "/home/$DEPLOY_USER" | tail -1 | bash || true

echo "==> Done"
pm2 status
echo "Production: http://$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')/"
echo "Staging:    http://$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')/staging/"
echo "Staging alt: http://$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}'):8080/ (if firewall allows)"
