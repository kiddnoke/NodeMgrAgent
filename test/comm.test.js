'use strict';
const io = require('socket.io')(3000, {
  path: '/',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});
let only_socket;
io.on('connect', (socket) => {
  // ...
  console.log(`socket ${socket.id} is connected`);
  only_socket = socket.id;
  socket.on('open', (params) => {
    console.log(`${params}`);
  });
  socket.on('close', (params) => {
    console.log(`${params}`);
  });
});

const rl = require('readline')
  .createInterface({
    input: process.stdin,
    output: process.stdout
  });
rl.on('line', (input) => {
  const params = input.toString()
    .split(' ');
  const command = params[ 0 ];
  const config = params[ 1 ];
  switch (command) {
    case 'open' : {
      io.sockets.sockets[ only_socket ].emit('open', config, (ack) => {
        console.error(`收到了返回一应答包 ${ack}`);
      });
    }
      break;
    case 'close' : {
      io.sockets.sockets[ only_socket ].emit('close', config, (ack) => {
        console.error(`收到了返回一应答包 ${ack}`);
      });
    }
      break;
  }
});

const Comm = require('../lib/Comm');
const NodeConfig = require('../config/webclientconfig');
let comm = new Comm({ host: 'localhost', port: 3000, router: '/' }, NodeConfig);
comm.OnClose((config, ack) => {
  console.log(config);
  ack(config.server_port);
});
comm.OnOpen((config, ack) => {
  console.log(config);
  ack(config.server_port);
});
