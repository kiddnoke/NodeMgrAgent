module.exports = {
  apps : [{
    name        : "nodemgr",
    script      : "app.js",
    cwd : "./NodeMgrAgent/",
    args:['10.0.2.70', 'FR', '1'],
    watch       : true,
  },{
    name       : "ss",
    script     : "ssserver",
    cwd : "./shadowsocks-3.0.0/",
    args:['--manager-address','127.0.0.1:6001','-c','shadowsocks.json'],
    interpreter   : "python",
    watch       : true,
  }]
};
