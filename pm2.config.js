module.exports = {
  apps: [{
    name: "nodemgr",
    script: "app.js",
    args: ['-H', 'localhost', '-S', 'State', '-A', 'Area'],
    watch: true,
  }]
};
