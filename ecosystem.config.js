module.exports = {
  apps: [
    {
      name: "isubtext",
      script: "npm",
      args: "start",
      cwd: "/var/www/isubtext",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
