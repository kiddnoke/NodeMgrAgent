'use strict';
const util = require('../lib/util');
const port = 10000 ;
util.isPortUsed(port).then((ret)=>{
  if(ret) {
    console.log(`${port} is Used`);
  } else {
    console.log(`${port} is not Used`);
  }
}).catch(e=>{
  console.error(e);
});

const Net = require('net');
const server = Net.createServer().listen(10001) ;
server.on('error',e=>{
  console.error(e);
});
