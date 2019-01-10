'use strict';
const dgram = require('dgram');
const {EventEmitter} = require('events');
const Session = require('./Cache');
const Divder = require('./divider');

const __senToSS = (self, data) => {
  self.udp.send(JSON.stringify(data), self.ss_manager_port, 'localhost');
};

const __dispatch = (self, data, who) => {
  let object;
  try {
    if (typeof data === 'string') {
      object = JSON.parse(data);
    } else if (typeof data === 'object') {
      object = data;
    }
  } catch (e) {
    self.emit('error', e);
  }
  for (const index in object) {
    self.emit(index, object[index], who);
  }
};

class Command extends EventEmitter {
  /**
   *
   * @param options
   */
  constructor(options = {controller_port: 7000, manager_port: 8001, beginport: 7001, endport: 8000}) {
    super();
    this.self_port = options.controller_port;
    this.ss_manager_port = options.manager_port;
    this.udp = dgram.createSocket('udp4');
    this.sessionCache = new Session();
    this.port_pool = new Divder({rangMin: options.beginport, rangMax: options.endport});
    this.pingid = 0;
  }

  /**
   *
   * @constructor
   */
  Init() {
    this.udp.bind(this.self_port);
    this.udp.on('listening', () => {
      const address = this.udp.address();
      console.log(`cmd listening ${address.address}:${address.port}`);
      this.udp.on('message', (data, rinfo) => __dispatch(this, data.toString(), rinfo));
      this.udp.on('error', (err) => {
        console.error(`cmd error:\n${err.stack}`);
        this.udp.close();
      });

      this.on('open', (msg) => {
        const port = msg;
        this.emit('open_' + port);
      });
      this.on('opened', (msg) => {
        const port = msg;
        this.emit('opened_' + port);
      });
      this.on('close', (msg) => {
        const port = msg;
        this.emit('close_' + port);
      });
      this.on('closed', (msg) => {
        const port = msg;
        this.emit('closed_' + port);
      });
      this.on('remove', (msg) => {
        const port = msg;
        this.emit('remove_' + port);
      });
      this.on('removed', (msg) => {
        const port = msg;
        this.emit('removed_' + port);
      });
      this.on('tcptransfer', async (msg) => {
        for (let port in msg) {
          const i_port = parseInt(port);
          const up = msg[port][0];
          const down = msg[port][1];
          this.sessionCache.addtraffic(i_port, [up, down, 0, 0]);
        }
      });
      this.on('udptransfer', async (msg) => {
        for (let port in msg) {
          const i_port = parseInt(port);
          const up = msg[port][0];
          const down = msg[port][1];
          this.sessionCache.addtraffic(i_port, [0, 0, up, down]);
        }
      });
    });
  }

  Fire(events, params) {
    this.emit(events, params);
  }

  On(event, callback) {
    this.on(event, callback);
  }

  EnableClear(enable, interval = 120) {
    const handler = async () => {
      const now = Math.round(Date.now() / 1000);
      for (const [port, item] of this.sessionCache.entries()) {
        const uid = item[0].uid;
        const sid = item[0].sid;
        const timeout = parseInt(item[0].timeout);
        const timestamp = item[2];
        if (timeout !== 0 && now - timestamp > timeout) {
          this.Fire('timeout', {port: port, uid: uid, sid: sid});
        }
        const expire = parseInt(item[0].expire);
        if (expire !== 0 && now > expire) {
          this.Fire('expire', {port: port, uid: uid, sid: sid});
        }
        const remain = parseInt(item[0].remain);
        const tcp = parseInt(item[1][0]) + parseInt(item[1][1]);
        const udp = parseInt(item[1][2]) + parseInt(item[1][3]);
        if (remain !== 0 && Math.round((tcp + udp) / 1024) >= remain) {
          this.Fire('overflow', {
            port: port,
            uid: uid,
            sid: sid,
            limitup: item[0].nextlimitup,
            limitdown: item[0].nextlimitdown,
          });
        }
        const balancenotifytime = parseInt(item[0].balancenotifytime);
        if (balancenotifytime !== 0 && expire - now < balancenotifytime) {
          this.Fire('balance', {
            port: item[0].port,
            uid: item[0].uid,
            sid: item[0].sid,
            balancenotifytime: expire - now
          });
          item[0].balancenotifytime = 0 ;
        }
      }
    };
    if (enable) {
      this.timeouthandler = setInterval(handler, interval * 1000);
    } else {
      if (!!!this.timeouthandler) return;
      clearInterval(this.timeouthandler);
    }
  }

  OnTimeOut(callback) {
    this.On('timeout', callback);
  }

  OnExpire(callback) {
    this.On('expire', callback);
  }

  OnOverflow(callback) {
    this.On('overflow', callback);
  }

  OnBalance(callback) {
    this.On('balance', callback)
  }

  async WaitOpenedEvent(port, timeout = 10000) {
    return new Promise(((resolve, reject) => {
      const open = 'open_' + port;
      const opened = 'opened_' + port;
      let timer = setTimeout(() => {
        this.removeAllListeners(open);
        this.removeAllListeners(opened);
        reject(new Error(`等待开启端口${port}超时`));
      }, timeout);
      this.once(open, () => {
        /**
         * open success
         */
        this.removeAllListeners(opened);
        clearTimeout(timer);
        resolve(true);
      });
      this.once(opened, () => {
        /**
         * open failed
         */
        this.removeAllListeners(open);
        clearTimeout(timer);
        resolve(false);
      });
    }));
  }

  async WaitClosedEvent(port, timeout = 10000) {
    return new Promise(((resolve, reject) => {
      port = parseInt(port);
      const close = 'close_' + port;
      const closed = 'closed_' + port;
      this.once(close, () => {
        /**
         * close success
         */
        this.removeAllListeners(closed);
        resolve(true);
      });
      this.once(closed, () => {
        /**
         * close failed
         */
        this.removeAllListeners(close);
        resolve(false);
      });
    }));
  }

  async WaitRemovedEvent(port, timeout = 5000) {
    return new Promise(((resolve, reject) => {
      const remove = 'remove_' + port;
      const removed = 'removed_' + port;
      const timer = setTimeout(() => {
        this.removeAllListeners(remove);
        this.removeAllListeners(removed);
        reject(new Error(`等待关闭端口${port}超时`));
      }, timeout);
      this.once(remove, () => {
        /**
         * remove success
         */
        clearTimeout(timer);
        this.removeAllListeners(removed);
        resolve(true);
      });
      this.once(removed, () => {
        /**
         * removed failed
         */
        this.removeAllListeners(remove);
        clearTimeout(timer);
        resolve(false);
      });
    }));
  }

  async OpenPort(config, timeout = 5000) {
    while (true) {
      const port = this.port_pool.getport;
      try {
        if (!!!port) {
          return Promise.reject(new Error(`端口耗尽`));
        }
        config['server_port'] = port;
        config['limitup'] = config['currlimitup'];
        config['limitdown'] = config['currlimitdown'];
        await __senToSS(this, {open: config});
        const ret = await this.WaitOpenedEvent(port);
        this.port_pool.addport(port);
        if (ret) {
          this.sessionCache.add(port, config);
          return await config;
        }
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async ClosePort(port, timeout = 15 * 1000) {
    try {
      port = parseInt(port);
      if (!this.port_pool.has(port)) {
        return Promise.reject(new Error(`分配器里没有${port}`));
      }
      await __senToSS(this, {close: {server_port: port}});
      const ret = await this.WaitClosedEvent(port, timeout);
      if (ret) {
        this.port_pool.delport(port);
        return await this.sessionCache.delport(port);
      }
      return Promise.reject(new Error(`SS没有 ${port}`));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async RemovePort(port, timeout = 5000) {
    try {
      if (!this.port_pool.has(port)) {
        return Promise.reject(new Error(`分配器里没有${port}`));
      }
      await __senToSS(this, {remove: {server_port: port}});
      const ret = await this.WaitRemovedEvent(port, timeout);
      if (ret) {
        port = parseInt(port);
        this.port_pool.delport(port);
        return await this.sessionCache.delport(port);
      }
      return Promise.reject(new Error(`SS没有 ${port}`));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async UpdateLimit(port, limitup, limitdown) {
    try {
      if (!this.port_pool.has(port)) {
        return Promise.reject(new Error(`分配器里没有${port}`));
      }
      await __senToSS(this, {limit: {server_port: port, limitup: limitup, limitdown: limitdown}});
      return await this.sessionCache.get(port);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async ping(timeout = 1) {
    const pingId = ++this.pingid;
    const pre = Date.now();
    await __senToSS(this, {ping: pingId});
    return new Promise(((resolve, reject) => {
      const timer = setTimeout(async () => {
        this.removeAllListeners('pong');
        return reject(new Error(`ping SS timeout`));
      }, timeout * 1000);
      this.once('pong', (pongId) => {
        if (parseInt(pongId) === parseInt(pingId)) {
          clearTimeout(timer);
          return resolve(Date.now() - pre);
        }
      });
    }));
  }
}

module.exports = Command;
