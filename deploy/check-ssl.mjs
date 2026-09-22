#!/usr/bin/env node
import { Client } from "ssh2";

const PASS = process.env.VPS_PASS;
if (!PASS) process.exit(1);

const cmd = `
sudo ufw status | grep 443 || true
ss -tlnp | grep -E ':443|:80'
curl -s -o /dev/null -w 'local_https:%{http_code}\\n' https://127.0.0.1/modules -k --resolve dayaotoasia.com:443:127.0.0.1
curl -s -o /dev/null -w 'local_http:%{http_code}\\n' http://127.0.0.1/modules
`;

const conn = new Client();
conn.on("ready", () => {
  conn.exec(cmd, (err, s) => {
    s.on("data", (d) => process.stdout.write(d));
    s.stderr.on("data", (d) => process.stderr.write(d));
    s.on("close", () => conn.end());
  });
}).connect({ host: "43.157.226.190", username: "ubuntu", password: PASS });
