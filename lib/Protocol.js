'use strict';

const { isVail } = require('./util');
const Message = {};
Message.decode = (router, packet) => {
  if (isVail(packet)) packet = router;
  return JSON.parse(packet);
};
Message.encode = (id, router, msg) => {
  if (isVail(msg)) msg = router;
  const packet = {};
  packet.id = id;
  packet.body = msg;
  return JSON.stringify(packet);
};
module.exports = {
  Message: Message,
};
