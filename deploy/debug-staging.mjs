#!/usr/bin/env node
import { Client } from "ssh2";

const PASS = process.env.VPS_PASS;
if (!PASS) process.exit(1);

const cmd = `
for p in / /modules /staging/demo /staging/modules/; do
  echo -n "3301$p -> "; curl -s -o /dev/null -w '%{http_code}\n' "http://127.0.0.1:3301$p"
done
ls -la /var/www/daya-oto-asia-staging/.next/BUILD_ID
cat /var/www/daya-oto-asia-staging/.next/required-server-files.json | head -c 400
`;

const conn = new Client();
conn.on("ready", () => {
  conn.exec(cmd, (err, s) => {
    s.on("data", (d) => process.stdout.write(d));
    s.stderr.on("data", (d) => process.stderr.write(d));
    s.on("close", () => conn.end());
  });
}).connect({ host: "43.157.226.190", username: "ubuntu", password: PASS });
