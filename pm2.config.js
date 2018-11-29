module.exports = {
  apps: [{
    name: "nodemgr0",
    script: "app.js",
    args: ['-H', '47.88.218.197', '-M', '8000', '-C', '9000', '-R', '20000:20999', '-S', 'SG', '-A', '1'],
    watch: true,
  }, {
    name: "ssmanager0",
    script: "ssmanager",
    interpreter: "python",
    args: ['--manager-address', '127.0.0.1:8000', '--log-file=/var/log/shadowsocks0.log', '--pid-file=/var/run/shadowsocks0.pid'],
    watch: true,
  }]
};
