module.exports = {
  apps : [{
    name        : "nodemgr",
    script      : "app.js",
    cwd : "./NodeMgrAgent/",
    args:['-H','10.0.2.70', '-P' ,'7001', '-h','10.0.2.72' ,'-R','10000:20000' ,'-M','8001' ,'-C','8002' ,'-S','CN' ,'-A','1' ],
    watch       : true,
  },{
    name       : "sssmanager",
    script     : "onlymanager.py",
    cwd : "./VpnEdge/shadowsocks/",
    args:['--manager-address','127.0.0.1:8001'],
    interpreter   : "python",
    watch       : true,
  }]
};
