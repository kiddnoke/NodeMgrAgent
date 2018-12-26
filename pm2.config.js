module.exports = {
  apps: [{
    name: "nodemgr0",
    cwd: 'NodeMgrAgent',
    script: "app.js",
    args: ['-H', '10.0.2.70', '-M', '8000', '-C', '9000', '-R', '20000:20999', '-S', 'SG', '-A', 1],
    watch: true,
  }, {
    name: "nodemgr1",
    cwd: 'NodeMgrAgent',
    script: "app.js",
    args: ['-H', '10.0.2.70', '-M', '8001', '-C', '9001', '-R', '21000:21999', '-S', 'SG', '-A', 2],
    watch: true,
  }, {
    name: "nodemgr2",
    cwd: 'NodeMgrAgent',
    script: "app.js",
    args: ['-H', '10.0.2.70', '-M', '8002', '-C', '9002', '-R', '22000:22999', '-S', 'GE', '-A', 1],
    watch: true,
  }, {
    name: "nodemgr3",
    cwd: 'NodeMgrAgent',
    script: "app.js",
    args: ['-H', '10.0.2.70', '-M', '8003', '-C', '9003', '-R', '23000:23999', '-S', 'GE', '-A', 2],
    watch: true,
  }, {
    name: "nodemgr4",
    cwd: 'NodeMgrAgent',
    script: "app.js",
    args: ['-H', '10.0.2.70', '-M', '8004', '-C', '9004', '-R', '24000:24999', '-S', 'HK', '-A', 1],
    watch: true,
  }, {
    name: "nodemgr5",
    cwd: 'NodeMgrAgent',
    script: "app.js",
    args: ['-H', '10.0.2.70', '-M', '8005', '-C', '9005', '-R', '25000:25999', '-S', 'HK', '-A', 2],
    watch: true,
  }, {
    name: "nodemgr6",
    cwd: 'NodeMgrAgent',
    script: "app.js",
    args: ['-H', '10.0.2.70', '-M', '8006', '-C', '9006', '-R', '26000:26999', '-S', 'SG', '-A', 1],
    watch: true,
  }, {
    name: "ssmanager0",
    cwd: './',
    script: "shadowsocks_server_linux",
    args: ['--manager-port', '8000',],
  }, {
    name: "ssmanager1",
    cwd: './',
    script: "shadowsocks_server_linux",
    args: ['--manager-port', '8001',],
  }, {
    name: "ssmanager2",
    cwd: './',
    script: "shadowsocks_server_linux",
    args: ['--manager-port', '8002',],
  }, {
    name: "ssmanager3",
    cwd: './',
    script: "shadowsocks_server_linux",
    args: ['--manager-port', '8003',],
  },{
    name: "ssmanager4",
    cwd: './',
    script: "shadowsocks_server_linux",
    args: ['--manager-port', '8004',],
  }, {
    name: "ssmanager5",
    cwd: './',
    script: "shadowsocks_server_linux",
    args: ['--manager-port', '8005',],
  },{
    name: "ssmanager6",
    cwd: './',
    script: "shadowsocks_server_linux",
    args: ['--manager-port', '8006',],
  }]
};

