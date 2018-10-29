'use strict';
const os = require('os');
exports.getIp = () => {
  let ips = [];
  const interfaces = os.networkInterfaces();
  for (const index in interfaces) {
    const netcard = interfaces[ index ];
    for (const item of netcard) {
      if (item.family === 'IPv4' && item.internal === false) {
        ips.push(item.address);
      }
    }
  }
  return ips;
};
exports.getCpuCount = () => {
  return os.cpus().length;
};
exports.getFreeMem = () => {
  return Math.round(os.freemem() / (1024 * 1024));
};
exports.getTotalMem = () => {
  return Math.round(os.totalmem() / (1024 * 1024));
};
exports.getTempDir = () => {
  return os.tmpdir();
};
exports.getHomeDir = () => {
  return os.homedir();
};
exports.getHostname = () => {
  return os.hostname() ;
};
exports.getOsType = () =>{
  return os.type() ;
};