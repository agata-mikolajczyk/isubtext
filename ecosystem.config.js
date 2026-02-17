module.exports = {
  apps: [
    {
      name: "isubtext",
      script: "npm",
      args: "start",
      watch: true,
      ignore_watch: [
        "node_modules",
        ".next",
        ".git",
        "logs"
      ],
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
