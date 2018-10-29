'use strict';
const crypto = require('crypto');
exports.isVail = (data) => {
  return (data === "" || data === undefined || data == null)
};
const methodtable = {
  1: 'rc4-md5',
  2: 'chacha20',
  3: 'aes-256-cfb'
};
exports.selectmethod = (Uid) => {
  return 'rc4-md5';
  return methodtable[ Math.round(Math.random() *  methodtable.length) ];
};
exports.makepassed = (Uid) => {
  return Uid.toString();
};
exports.generatePassword = (Uid)=>{
  return Uid.toString();
};