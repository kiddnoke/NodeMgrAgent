'use strict';
const program = require('commander');

function range(val) {
  return val.split(':')
    .map(Number);
}

program
  .version('0.1.0')
  .option('-H, --center_host [value]', '指定中心的地址')
  .option('-P, --center_port [value]', '指定中心的端口', parseInt)
  .option('-h, --myhostname [value]', '本主机的主机名')
  .option('-R, --range <a>:<b>', 'A range', range)
  .option('-M, --manager_port [value]', 'ss manager-port', parseInt)
  .option('-C, --controller_port [value]', 'ss controller-port', parseInt)
  .option('-S, --state [value]', 'StateAbb',)
  .option('-A, --area [value]', 'AreaCode', parseInt)
  .parse(process.argv);

module.exports = program;
