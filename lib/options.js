'use strict';
const program = require('commander');

function range(val) {
  return val.split(':')
    .map(Number);
}


/**
 * @return {number}
 */
function ParseInt(val) {
  return parseInt(val);
}

let params = [];
if (process.argv.slice(2).length) {
  params = process.argv;
} else {
  params = process.env.AGENTARGS.split(' ');
  params.unshift(process.argv[0], process.argv[1]);
}
program
  .version('0.1.0')
  .option('-H, --center_host [value]', '指定中心的地址')
  .option('-P, --center_port [value]', '指定中心的端口', ParseInt, 7001)
  .option('-R, --range <a>:<b>', 'A range', range, [20000, 30000])
  .option('-M, --manager_port [value]', 'ss manager-port', ParseInt, 8001)
  .option('-C, --controller_port [value]', 'ss controller-port', ParseInt, 8002)
  .option('-S, --state [value]', 'StateAbb', null)
  .option('-A, --area [value]', 'AreaCode', ParseInt, 0)
  .parse(params);

module.exports = program;
