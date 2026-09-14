#!/usr/bin/env node
import { Client } from "ssh2";

const PASS = process.env.VPS_PASS;
if (!PASS) process.exit(1);

const cmd = `
set -e
cd /var/www/daya-oto-asia-production && git pull origin main
cd /var/www/daya-oto-asia-staging && git pull origin staging
sudo cp /var/www/daya-oto-asia-production/deploy/nginx/daya-oto-asia.conf /etc/nginx/sites-available/daya-oto-asia.conf
sudo nginx -t && sudo systemctl reload nginx
bash /var/www/daya-oto-asia-staging/deploy/deploy-app.sh staging
pm2 restart daya-oto-staging --update-env
pm2 save
echo OK
`;

const conn = new Client();
conn.on("ready", () => {
  conn.exec(cmd, (err, s) => {
    s.on("data", (d) => process.stdout.write(d));
    s.stderr.on("data", (d) => process.stderr.write(d));
    s.on("close", () => conn.end());
  });
}).connect({ host: "43.157.226.190", username: "ubuntu", password: PASS });
