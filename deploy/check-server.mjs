#!/usr/bin/env node
import { Client } from "ssh2";

const PASS = process.env.VPS_PASS;
if (!PASS) process.exit(1);

const conn = new Client();
conn.on("ready", () => {
  conn.exec("sudo ufw status; ss -tlnp | grep -E ':80|:8080|:3300|:3301'; curl -s -o /dev/null -w 'local8080:%{http_code}\\n' http://127.0.0.1:8080/", (err, s) => {
    s.on("data", (d) => process.stdout.write(d));
    s.stderr.on("data", (d) => process.stderr.write(d));
    s.on("close", () => conn.end());
  });
}).connect({ host: "43.157.226.190", username: "ubuntu", password: PASS });