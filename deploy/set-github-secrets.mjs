#!/usr/bin/env node
/** Push VPS_SSH_KEY to GitHub secrets (key never printed). Requires VPS_PASS + gh CLI. */
import { Client } from "ssh2";
import { spawnSync } from "child_process";

const HOST = process.env.VPS_HOST ?? "43.157.226.190";
const USER = process.env.VPS_USER ?? "ubuntu";
const PASS = process.env.VPS_PASS;
const REPO = process.env.GITHUB_REPO ?? "zakiachsan/daya-oto-asia";

if (!PASS) {
  console.error("Set VPS_PASS");
  process.exit(1);
}

const conn = new Client();
conn.on("ready", () => {
  conn.exec("cat ~/.ssh/github_actions_deploy", (err, stream) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    let key = "";
    stream
      .on("data", (d) => {
        key += d.toString();
      })
      .on("close", (code) => {
        conn.end();
        if (code !== 0 || !key.includes("PRIVATE KEY")) {
          console.error("Could not read deploy key from server");
          process.exit(1);
        }
        const gh =
          process.env.GH_PATH ??
          (process.platform === "win32"
            ? `${process.env.ProgramFiles}\\GitHub CLI\\gh.exe`
            : "gh");
        const r = spawnSync(gh, ["secret", "set", "VPS_SSH_KEY", "--repo", REPO], {
          input: key,
          encoding: "utf8",
        });
        if (r.status !== 0) {
          console.error(r.stderr || r.stdout);
          process.exit(1);
        }
        console.log("✓ VPS_SSH_KEY set in GitHub Actions secrets");
      });
  });
});
conn.connect({ host: HOST, port: 22, username: USER, password: PASS });
