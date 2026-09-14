#!/usr/bin/env node
/** Post-setup: open-note for cloud firewall + create GitHub Actions deploy key */
import { Client } from "ssh2";
import { generateKeyPairSync } from "crypto";

const PASS = process.env.VPS_PASS;
if (!PASS) {
  console.error("Set VPS_PASS");
  process.exit(1);
}

const { publicKey, privateKey } = generateKeyPairSync("ed25519");
const pubOpenSSH = publicKey.export({ type: "spki", format: "pem" })
  .toString()
  .includes("PUBLIC") ? null : null;

// Use ssh-keygen on server instead for proper OpenSSH format
const conn = new Client();
conn.on("ready", () => {
  const cmd = `
    test -f ~/.ssh/github_actions_deploy || ssh-keygen -t ed25519 -N "" -f ~/.ssh/github_actions_deploy -C "github-actions-deploy"
    grep -q github-actions-deploy ~/.ssh/authorized_keys 2>/dev/null || cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys ~/.ssh/github_actions_deploy
    echo "---PRIVATE_KEY_START---"
    cat ~/.ssh/github_actions_deploy
    echo "---PRIVATE_KEY_END---"
  `;
  conn.exec(cmd, (err, s) => {
    let out = "";
    s.on("data", (d) => { out += d; process.stdout.write(d); });
    s.stderr.on("data", (d) => process.stderr.write(d));
    s.on("close", () => conn.end());
  });
}).connect({ host: "43.157.226.190", username: "ubuntu", password: PASS });
