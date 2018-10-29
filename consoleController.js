'use strict';
const Client = require('./lib/Comm');
const NodeConfig = require('./config/webclientconfig');
const client = new Client({ host: 'localhost', port: 7001, router: '/' }, { Ip: 'localhost' });
const rl = require('readline')
  .createInterface({
    input: process.stdin,
    output: process.stdout
  });
client.OnConnect(() => {
  console.log('connected');
  rl.on('line', function(input) {
    switch (input) {
      case 'l' : {
        client.Request('login', { ip: 'localhost', port: 6001, range: 3000, state: 'CN', area: 1 }, (msgbody) => {
          let body = JSON.stringify(msgbody);
          console.log(`register done : ${body}`);
        });
      }
        break;
      case 'hb' : {
        client.Request('heartbeat', NodeConfig, (msgbody) => {
          let body = JSON.stringify(msgbody);
          console.log(`register done : ${body}`);
        });
      }
        break;
      case 'h' : {
        client.Notify('health', 100000000);
      }
        break;
      case 'close' : {
        client.Notify('close', [ 1001 ]);
      }
        break;
      case 'open' : {
        client.Notify('open', {});
      }
        break;
      case 'stat' : {
        let msg = {
          1001: 1234,
          1002: 54362,
          1003: 90348,
        };
        client.Notify('stat', msg);
      }
        break;
    }
  });
});


client.OnClose((config, ack) => {
  console.log(config);
  ack(true);
});
client.OnOpen((config, ack) => {
  console.log(config);
  ack(true);
});
rl.on('close', function() {
  console.log('程序结束');
  process.exit(0);
});
