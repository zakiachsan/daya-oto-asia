#!/usr/bin/env bash
# Deploy single environment — usage: ./deploy-app.sh production|staging
set -euo pipefail

ENV="${1:-production}"

case "$ENV" in
  production)
    DIR="/var/www/daya-oto-asia-production"
    BRANCH="main"
    PM2_NAME="daya-oto-production"
    ;;
  staging)
    DIR="/var/www/daya-oto-asia-staging"
    BRANCH="staging"
    PM2_NAME="daya-oto-staging"
    ;;
  *)
    echo "Usage: $0 production|staging"
    exit 1
    ;;
esac

echo "==> Deploy $ENV ($BRANCH) in $DIR"
cd "$DIR"
git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
npm ci
if [ "$ENV" = "staging" ]; then
  export NEXT_PUBLIC_BASE_PATH=/staging
fi
npm run build
pm2 restart "$PM2_NAME"
pm2 save
echo "==> $ENV deployed"
