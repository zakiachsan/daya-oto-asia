#!/usr/bin/env bash
# Install certbot + HTTPS for dayaotoasia.com
set -euo pipefail

DOMAIN="${DOMAIN:-dayaotoasia.com}"
EMAIL="${SSL_EMAIL:-admin@dayaotoasia.com}"
PROD_DIR="${PROD_DIR:-/var/www/daya-oto-asia-production}"

echo "==> Install certbot"
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update -qq
sudo apt-get install -y -qq certbot python3-certbot-nginx

echo "==> Update nginx config"
sudo cp "$PROD_DIR/deploy/nginx/daya-oto-asia.conf" /etc/nginx/sites-available/daya-oto-asia.conf
sudo ln -sf /etc/nginx/sites-available/daya-oto-asia.conf /etc/nginx/sites-enabled/daya-oto-asia.conf
sudo nginx -t
sudo systemctl reload nginx

echo "==> Obtain SSL certificate"
sudo certbot --nginx \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  -d "staging.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  -m "$EMAIL" \
  --redirect

echo "==> Done"
sudo certbot certificates
