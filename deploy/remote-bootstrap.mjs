#!/usr/bin/env node
/**
 * One-time local bootstrap — uploads setup-server.sh and runs it on VPS.
 * Usage: VPS_PASS='...' node deploy/remote-bootstrap.mjs
 */
import { readFileSync } from "fs";
import { Client } from "ssh2";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HOST = process.env.VPS_HOST ?? "43.157.226.190";
const USER = process.env.VPS_USER ?? "ubuntu";
const PASS = process.env.VPS_PASS;

if (!PASS) {
  console.error("Set VPS_PASS environment variable.");
  process.exit(1);
}

const setupScript = readFileSync(path.join(__dirname, "setup-server.sh"), "utf8");

function exec(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = "";
      stream
        .on("close", (code) => (code === 0 ? resolve(out) : reject(new Error(`exit ${code}\n${out}`))))
        .on("data", (d) => {
          process.stdout.write(d);
          out += d;
        })
        .stderr.on("data", (d) => process.stderr.write(d));
    });
  });
}

const conn = new Client();
conn
  .on("ready", async () => {
    try {
      console.log("Connected. Uploading setup script...");
      const b64 = Buffer.from(setupScript).toString("base64");
      await exec(conn, `echo '${b64}' | base64 -d > /tmp/setup-daya-oto.sh && chmod +x /tmp/setup-daya-oto.sh`);
      console.log("Running setup (may take several minutes)...");
      await exec(conn, "bash /tmp/setup-daya-oto.sh");
      console.log("Bootstrap complete.");
      conn.end();
    } catch (e) {
      console.error(e.message);
      conn.end();
      process.exit(1);
    }
  })
  .on("error", (e) => {
    console.error("SSH error:", e.message);
    process.exit(1);
  })
  .connect({ host: HOST, port: 22, username: USER, password: PASS, readyTimeout: 30000 });
