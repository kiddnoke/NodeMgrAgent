'use strict';
const os = require('os');
const resource = require('../lib/Resource');
module.exports = {
  Ip: resource.getHostname(),
  Port: 6001,
  State: process.argv[5],
  Area: process.argv[6],
};
