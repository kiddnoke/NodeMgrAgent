'use strict';
const logger = require('../lib/logger');
const ss = require('dgram')
  .createSocket('udp4');
const GetRandomNum = (Min, Max) => {
  const Range = Max - Min;
  const Rand = Math.random();
  return (Min + Math.round(Rand * Range));
};
let ports = new Set();
let g_rinfo;
ss.on('listening', () => {
  const Send = (msg) => {
    ss.send(JSON.stringify(msg), g_rinfo.port, g_rinfo.address);
  };
  ss.on('error', () => {
  });
  ss.on('message', (msg, rinfo) => {
    g_rinfo = rinfo;
    switch (typeof msg) {
      case 'string' : {
        console.warn(`it is a string ${msg.toString()}`);
        let message = JSON.parse(msg);
        for (const index of message) {
          switch (index) {
            case 'open': {
              const port = message [ index ][ 'server_port' ];
              if (ports.has(port)) {
                Send({ opened: port });
              } else {
                ports.add(port);
                Send({ open: port });
              }
            }
              break;
            case 'close' : {
              const port = message [ index ][ 'server_port' ];
              if (ports.has(port)) {
                ports.delete(port);
                Send({ close: port });
              } else {
                Send({ closed: port });
              }
            }
              break;
          }
        }
      }
        break;
      case 'object' : {
        let message = JSON.parse(msg.toString());
        for (const index in message) {
          switch (index) {
            case 'open': {
              console.warn(`it is a object ${msg.toString()}`);
              const port = message [ index ][ 'server_port' ];
              if (ports.has(port)) {
                Send({ opened: port });
              } else {
                Send({ open: port });
                ports.add(port);
              }
            }
              break;
            case 'close' : {
              console.warn(`it is a object ${msg.toString()}`);
              const port = message [ index ][ 'server_port' ];
              if (ports.has(port)) {
                ports.delete(port);
                Send({ close: port });
              } else {
                Send({ closed: port });
              }
            }
              break;
            case 'ping' : {
              Send({ pong: 'pong' });
            }
              break;
          }
        }
      }
        break;
      case 'array' : {
        logger.warn(`it is a array`);
      }
        break;
    }
  });
  const stat = () => {
    ports.forEach((port) => {
      let msg = {};
      msg.stat = {};
      msg.stat[ port ] = GetRandomNum(1000, 100000);
      Send(msg);
    });
  };
  const maketraffic = () => {
    ports.forEach((port) => {
      const uptraffic = GetRandomNum(1000, 100000);
      const downtraffic = GetRandomNum(100000, 1000000);
      let msg = {};
      msg.traffic = {};
      msg.traffic[ port ] = [ uptraffic, downtraffic ];
      Send(msg);
    });
  };
  const remove = (port) => {
    if (!!!port) {
      const index = GetRandomNum(1, 1000) % ports.size;
      let i = 0;
      for (const port of ports) {
        if (index !== i++) continue;
        if (ports.has(port)) {
          ports.delete(port);
          Send({ remove: port });
        }
      }
    } else {
      Send({ remove: port });
    }
  };
  setInterval(stat, 1000); // 每秒生产一条state 的信息
  setInterval(maketraffic, 1000); // 每秒生产一条state 的信息
  setInterval(remove, 120 * 1000);
  const rl = require('readline')
    .createInterface({
      input: process.stdin,
      output: process.stdout
    });
  rl.on('line', (params) => {
    let inputArr = params.toString()
      .split(' ');
    let input = inputArr[ 0 ];

    switch (input) {
      case 'r': {
        remove(inputArr[ 1 ]);
      }
        break;
    }
  });
});
ss.bind(6001);
