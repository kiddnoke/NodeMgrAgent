'use strict';
const ss_util = require('../../app/util/methodtable');
const logger = require('../lib/logger');
const Manager = require('../lib/SSManager');
const ports = new Set();
const SS = require('dgram')
  .createSocket('udp4');
const GetRandomNum = (Min, Max) => {
  const Range = Max - Min;
  const Rand = Math.random();
  return (Min + Math.round(Rand * Range));
};
SS.on('listening', () => {
  const address = SS.address();
  logger.info(`服务器监听 ${address.address}:${address.port}`);
  SS.on('error', (err) => {

  });

  SS.on('message', (msg, rinfo) => {
    console.debug(`Receive from ${rinfo.address}:${rinfo.port} :${msg.toString()}`);
    switch (typeof msg) {
      case 'string' : {
        logger.warn(`it is a string`);
        console.warn(`${msg.toString()}`);
        let message = JSON.parse(msg);
        for (const index of message) {
          switch (index) {
            case 'open': {
              ports.add(message[ index ].server_port);
              SS.send(JSON.stringify({ open: message[ index ].server_port }), rinfo.address, rinfo.port);
            }
              break;
            case 'close' : {
              ports.delete(message[ index ].server_port);
              SS.send(JSON.stringify({ close: message[ index ].server_port }), rinfo.address, rinfo.port);
            }
              break;
          }
        }
      }
        break;
      case 'object' : {
        logger.warn(`it is a object ${msg.toString()}`);
        console.warn(`it is a object ${msg.toString()}`);
        let message = JSON.parse(msg.toString());
        for (const index in message) {
          switch (index) {
            case 'open': {
              if (ports.has(message[ index ].server_port)) {
                SS.send(JSON.stringify({ opened: message[ index ].server_port }), rinfo.port, rinfo.address);
              } else {
                ports.add(message[ index ].server_port);
                SS.send(JSON.stringify({ open: message[ index ].server_port }), rinfo.port, rinfo.address);
              }
            }
              break;
            case 'close' : {
              if (ports.has(message[ index ].server_port)) {
                ports.delete(message[ index ].server_port);
                SS.send(JSON.stringify({ close: message[ index ].server_port }), rinfo.port, rinfo.address);
              } else {
                SS.send(JSON.stringify({ closed: message[ index ].server_port }), rinfo.port, rinfo.address);
              }
            }
              break;
          }
        }
      }
        break;
      case  'array' : {
        logger.warn(`it is a array`);
      }
        break;
    }
  });
  const maketraffic = () => {
    for (const port of ports) {
      const uptraffic = GetRandomNum(1000, 100000);
      const downtraffic = GetRandomNum(100000, 1000000);
      let msg = {};
      msg.tcptransfer = {};
      msg.tcptransfer[ port ] = [ uptraffic, downtraffic ];
      SS.send(JSON.stringify(msg), 60001, 'localhost');
      msg = {};
      msg.udptransfer = {};
      msg.udptransfer[ port ] = [ uptraffic, downtraffic ];
      SS.send(JSON.stringify(msg), 60001, 'localhost');
    }
  };
  setInterval(maketraffic, 1000); // 每秒生产一条traffic 的信息
});
SS.bind(6001);
const manager = new Manager({ agent_port: 6009, ss_manger_port: 6001 });
manager.Init();
manager.OnTraffic((msg) => {
  logger.info(`这是上下行流量汇报的消息`, msg);
});


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
    case 'open' : {
      let config = {};
      config.uid = 1;
      config.sid = 2;
      config.timeout = 3;
      config.limitup = 100;
      config.limitdown = 100;
      config.method = ss_util.selectmethod();
      config.password = ss_util.generatePassword('JohnSon');
      manager.OpenPort(config)
        .then((ret) => {
          if (!!ret) {
            console.log(ret);
            console.error(`open成功了`);
          } else {
            console.error(`open失败了`);
          }
        })
        .catch((err) => {
          if (err) {
            console.error(err);
          }
        });
    }
      break;
    case 'close' : {
      const port = +inputArr[ 1 ];
      manager.ClosePort(port)
        .then((ret) => {
          if (!!ret) {
            console.log(ret);
            console.error(`close成功了`);
          } else {
            console.error(`close失败了`);
          }
        })
        .catch(console.error);
    }
      break;
  }
});
