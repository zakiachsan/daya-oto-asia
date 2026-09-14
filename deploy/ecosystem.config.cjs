/** PM2 — production :3300, staging :3301 */
module.exports = {
  apps: [
    {
      name: "daya-oto-production",
      cwd: "/var/www/daya-oto-asia-production",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3300",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3300",
      },
    },
    {
      name: "daya-oto-staging",
      cwd: "/var/www/daya-oto-asia-staging",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3301",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3301",
      },
    },
  ],
};
