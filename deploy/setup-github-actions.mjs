#!/usr/bin/env node
/**
 * One-time setup: VPS deploy key + GitHub Actions secrets + initial deploy.
 * Usage: VPS_PASS='...' [GITHUB_TOKEN='ghp_...'] node deploy/setup-github-actions.mjs
 */
import { Client } from "ssh2";
import { execSync } from "child_process";

const HOST = process.env.VPS_HOST ?? "43.157.226.190";
const USER = process.env.VPS_USER ?? "ubuntu";
const PASS = process.env.VPS_PASS;
const REPO = process.env.GITHUB_REPO ?? "zakiachsan/daya-oto-asia";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

if (!PASS) {
  console.error("Set VPS_PASS environment variable.");
  process.exit(1);
}

function exec(conn, cmd, label) {
  return new Promise((resolve, reject) => {
    if (label) console.log(`\n>>> ${label}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = "";
      stream
        .on("close", (code) => {
          if (code === 0) resolve(out);
          else reject(new Error(`Command failed (${code}): ${cmd}\n${out}`));
        })
        .on("data", (d) => {
          process.stdout.write(d);
          out += d.toString();
        })
        .stderr.on("data", (d) => process.stderr.write(d));
    });
  });
}

function connect() {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", () => resolve(conn))
      .on("error", reject)
      .connect({ host: HOST, port: 22, username: USER, password: PASS });
  });
}

async function setupServer(conn) {
  const setupCmd = `
set -e
KEY="$HOME/.ssh/github_actions_deploy"
if [ ! -f "$KEY" ]; then
  ssh-keygen -t ed25519 -f "$KEY" -N "" -C "github-actions-daya-oto-asia"
fi
grep -qF "$(cat "$KEY.pub")" "$HOME/.ssh/authorized_keys" 2>/dev/null || cat "$KEY.pub" >> "$HOME/.ssh/authorized_keys"
chmod 700 "$HOME/.ssh"
chmod 600 "$KEY" "$HOME/.ssh/authorized_keys"

for pair in "/var/www/daya-oto-asia-production main" "/var/www/daya-oto-asia-staging staging"; do
  set -- $pair
  D=$1; B=$2
  if [ -d "$D/.git" ]; then
    cd "$D"
    git fetch origin
    git checkout "$B"
    git reset --hard "origin/$B"
  fi
done

echo "===DEPLOY_KEY_START==="
cat "$KEY"
echo "===DEPLOY_KEY_END==="
`;
  const out = await exec(conn, setupCmd, "Configure deploy SSH key & sync repos");
  const m = out.match(/===DEPLOY_KEY_START===\n([\s\S]*?)\n===DEPLOY_KEY_END===/);
  if (!m) throw new Error("Could not read deploy private key from server");
  return m[1].trim();
}

async function deployProduction(conn) {
  await exec(
    conn,
    "bash /var/www/daya-oto-asia-production/deploy/deploy-app.sh production",
    "Deploy production (build + pm2 restart)",
  );
}

async function ghAvailable() {
  try {
    execSync("gh --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function setSecretViaGh(name, value) {
  const { spawnSync } = await import("child_process");
  const r = spawnSync("gh", ["secret", "set", name, "--repo", REPO], {
    input: value,
    encoding: "utf8",
    shell: true,
  });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout || `gh secret set ${name} failed`);
}

/** GitHub Actions secret encryption (libsodium sealed box compatible) */
async function setSecretViaApi(name, value) {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN required for API secret setup");

  const keyRes = await fetch(`https://api.github.com/repos/${REPO}/actions/secrets/public-key`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!keyRes.ok) throw new Error(`public-key: ${keyRes.status} ${await keyRes.text()}`);
  const { key, key_id } = await keyRes.json();

  const sodium = await import("libsodium-wrappers");
  await sodium.ready;
  const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL);
  const encBytes = sodium.crypto_box_seal(value, binkey);
  const encrypted = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);

  const putRes = await fetch(`https://api.github.com/repos/${REPO}/actions/secrets/${name}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ encrypted_value: encrypted, key_id }),
  });
  if (!putRes.ok) throw new Error(`set ${name}: ${putRes.status} ${await putRes.text()}`);
}

async function setGitHubSecrets(privateKey) {
  const secrets = {
    VPS_HOST: HOST,
    VPS_USER: USER,
    VPS_SSH_KEY: privateKey,
  };

  if (await ghAvailable()) {
    console.log("\nSetting GitHub secrets via gh CLI...");
    for (const [name, value] of Object.entries(secrets)) {
      await setSecretViaGh(name, value);
      console.log(`  ✓ ${name}`);
    }
    return true;
  }

  if (GITHUB_TOKEN) {
    console.log("\nSetting GitHub secrets via GitHub API...");
    const { spawnSync } = await import("child_process");
    spawnSync("npm", ["install", "libsodium-wrappers", "--no-save"], { stdio: "inherit", shell: true });
    for (const [name, value] of Object.entries(secrets)) {
      await setSecretViaApi(name, value);
      console.log(`  ✓ ${name}`);
    }
    return true;
  }

  console.log("\n⚠ Could not set GitHub secrets automatically (need gh CLI or GITHUB_TOKEN).");
  console.log("Add these manually in GitHub → Settings → Secrets → Actions:");
  console.log(`  VPS_HOST = ${HOST}`);
  console.log(`  VPS_USER = ${USER}`);
  console.log("  VPS_SSH_KEY = (private key from server ~/.ssh/github_actions_deploy)");
  return false;
}

async function main() {
  console.log(`Connecting to ${USER}@${HOST}...`);
  const conn = await connect();
  try {
    const privateKey = await setupServer(conn);
    await deployProduction(conn);
    const secretsOk = await setGitHubSecrets(privateKey);
    console.log("\n✅ VPS production deployed.");
    if (secretsOk) {
      console.log("✅ GitHub Actions secrets configured — push to main/staging will auto-deploy.");
    } else {
      console.log("⏳ Set secrets manually, then push to main to trigger auto-deploy.");
    }
  } finally {
    conn.end();
  }
}

main().catch((e) => {
  console.error("\n❌", e.message);
  process.exit(1);
});
