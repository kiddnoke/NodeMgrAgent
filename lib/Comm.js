'use strict';
const SocketIoClass = require('socket.io-client');
const {EventEmitter} = require('events');
const url = require('url');
const md5 = require('crypto')
  .createHash('md5');

class WrappClient extends EventEmitter {
  /**
   * 接受两个重要的参数
   * @param connector 服务中心的地址端口 和 nsp
   * @param config
   */
  constructor(connector) {
    super();
    const now = Date.now()
      .toString();
    md5.update(now);
    md5.update('VpnMgrCore');
    const keys = md5.digest('hex');
    const Url = url.format({
      protocol: 'http:',
      hostname: connector.host,
      port: connector.port,
      pathname: connector.router,
      query: {
        keys: keys,
        timestamp: now,
      }
    });
    this.seqid = 0;
    this.io = new SocketIoClass(Url, {forceNew: false});
    this.callbacks = {};

  }

  OnConnect(cb) {
    this.io.on('connect', cb);
  }

  OnReconnect(cb) {
    this.io.on('reconnect', cb);
  }

  OnReconnectError(cb) {
    this.io.on('reconnect_error', cb);

  }

  OnDisconnect(cb) {
    this.io.on('disconnect', cb);
  }

  Connect() {
    this.io.connect();
  }
  /**
   * 专门监听Socket.io Server 上发过来的Close事件，针对性处理
   * @param callback
   * @constructor
   */
  OnClose(callback) {
    this.io.on(`close`, callback);
  }

  /**
   * 专门监听Socket.io Server 上发过来的Open事件，针对性处理
   * @param callback
   * @constructor
   */
  OnOpen(callback) {
    this.io.on('open', callback);
  }

  /**
   * 通知不要求应答
   * @param router
   * @param msg
   * @constructor
   */
  Notify(router, msg) {
    let self = this;
    msg = msg || {};
    msg = {id: 0, body: msg};
    self.io.emit(router, msg);
  };

  /**
   * 请求, 有应答
   * @param router
   * @param msg
   * @param callback
   */
  Request(router, msg, callback) {
    let self = this;
    msg = msg || {};
    router = router || msg.router;
    if (!router) {
      console.error('fail to send request without route.');
      return;
    }
    ++self.seqid;
    self.callbacks[self.seqid] = callback;
    self.io.emit(router, {id: self.seqid, body: msg});
    self.io.on(router, (data) => {
      const tempmsg = data;
      const cb = self.callbacks[tempmsg.id];
      delete self.callbacks[tempmsg.id];
      if (typeof  cb !== 'function') return;
      return cb(tempmsg.body);
    });
  }

  /**
   * get socket id
   * @returns {*}
   * @constructor
   */
  SocketId() {
    return this.io.id;
  }

  /**
   * 断开
   * @constructor
   */
  Disconnect() {
    this.io.disconnect();
  }

  /**
   * 触发事件
   * @param events
   * @param params
   * @constructor
   */
  Fire(events, params) {
    this.emit(events, params);
  }
}

module.exports = WrappClient;

