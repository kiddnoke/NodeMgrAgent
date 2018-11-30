module.exports = {
  apps: [{
    name: "nodemgr0",
    script: "app.js",
    args: ['-H', '47.88.218.197', '-M', '8000', '-C', '9000', '-R', '20000:20999', '-S', 'SG', '-A', '1'],
    watch: true,
  }, {
    name: "nodemgr1",
    script: "app.js",
    args: ['-H', '47.88.218.197', '-M', '8001', '-C', '9001', '-R', '21000:21999', '-S', 'SG', '-A', '1'],
    watch: true,
  }, {
    name: "nodemgr2",
    script: "app.js",
    args: ['-H', '47.88.218.197', '-M', '8002', '-C', '9002', '-R', '22000:22999', '-S', 'SG', '-A', '1'],
    watch: true,
  }, {
    name: "nodemgr3",
    script: "app.js",
    args: ['-H', '47.88.218.197', '-M', '8003', '-C', '9003', '-R', '23000:23999', '-S', 'SG', '-A', '1'],
    watch: true,
  },
    {
      name: "ssmanager0",
      script: "ssmanager",
      interpreter: "python",
      args: ['--manager-address', '127.0.0.1:8000',],
      watch: true,
    },
    {
      name: "ssmanager1",
      script: "ssmanager",
      interpreter: "python",
      args: ['--manager-address', '127.0.0.1:8001',],
      watch: true,
    },
    {
      name: "ssmanager2",
      script: "ssmanager",
      interpreter: "python",
      args: ['--manager-address', '127.0.0.1:8002',],
      watch: true,
    },
    {
      name: "ssmanager3",
      script: "ssmanager",
      interpreter: "python",
      args: ['--manager-address', '127.0.0.1:8003',],
      watch: true,
    }]
};

