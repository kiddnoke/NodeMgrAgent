module.exports = {
  apps: [{
    name: "nodemgr",
    script: "app.js",
    args: ['-H', 'localhost'],
    watch: true,
  }]
};
