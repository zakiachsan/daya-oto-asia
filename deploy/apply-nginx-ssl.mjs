#!/usr/bin/env node
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "ssh2";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PASS = process.env.VPS_PASS;
if (!PASS) {
  console.error("Set VPS_PASS environment variable.");
  process.exit(1);
}

function exec(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
      stream.on("data", (d) => process.stdout.write(d));
      stream.stderr.on("data", (d) => process.stderr.write(d));
    });
  });
}

const nginx = readFileSync(path.join(__dirname, "nginx/daya-oto-asia.conf"), "utf8");
const ssl = readFileSync(path.join(__dirname, "setup-ssl.sh"), "utf8");
const nginxB64 = Buffer.from(nginx).toString("base64");
const sslB64 = Buffer.from(ssl).toString("base64");

const conn = new Client();
conn.on("ready", async () => {
  try {
    await exec(conn, `echo '${nginxB64}' | base64 -d | sudo tee /etc/nginx/sites-available/daya-oto-asia.conf > /dev/null`);
    await exec(conn, "sudo ln -sf /etc/nginx/sites-available/daya-oto-asia.conf /etc/nginx/sites-enabled/daya-oto-asia.conf && sudo nginx -t && sudo systemctl reload nginx");
    await exec(conn, `echo '${sslB64}' | base64 -d > /tmp/setup-ssl.sh && chmod +x /tmp/setup-ssl.sh && bash /tmp/setup-ssl.sh`);
    conn.end();
  } catch (e) {
    console.error(e.message);
    conn.end();
    process.exit(1);
  }
}).connect({ host: "43.157.226.190", username: "ubuntu", password: PASS, readyTimeout: 30000 });
